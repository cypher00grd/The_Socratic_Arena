import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.join(__dirname, '../backend/.env') });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const domains = ["science", "technology", "geopolitics", "politics", "society", "food", "philosophy", "sports", "economics", "health", "entertainment"];

function toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
  );
}

async function deepCleanup() {
  console.log("--- Deep Topic Cleanup V2 Started ---");
  
  const { data: topics, error } = await supabase.from('topics').select('*');
  if (error) { console.error("Error:", error); return; }
  
  console.log(`Analyzing ${topics.length} topics...`);
  
  const junkIds = [];
  const processedTitles = new Map(); // lowerTitle -> id to KEEP
  
  for (const topic of topics) {
    const originalTitle = (topic.title || "").trim();
    const lower = originalTitle.toLowerCase();
    
    let isJunk = false;
    
    // 1. Remove if exactly a domain name
    if (domains.includes(lower)) {
      isJunk = true;
      console.group(`Domain Name Match: "${originalTitle}"`);
    }
    
    // 2. Remove other basics
    if (!isJunk && (originalTitle.length < 4 || lower.includes("ok ok") || lower.includes("custom debate"))) {
      isJunk = true;
      console.group(`Baseless/Short: "${originalTitle}"`);
    }

    if (isJunk) {
      junkIds.push(topic.id);
      console.log("-> MARKED FOR DELETION");
      console.groupEnd();
      continue;
    }

    // 3. Deduplicate
    if (processedTitles.has(lower)) {
      junkIds.push(topic.id);
      console.log(`Duplicate found: "${originalTitle}" (already have "${processedTitles.get(lower).title}") -> MARKED FOR DELETION`);
    } else {
      processedTitles.set(lower, topic);
    }
  }

  // 4. Batch Delete
  if (junkIds.length > 0) {
    console.log(`\nDeleting ${junkIds.length} topics...`);
    const { error: delError } = await supabase.from('topics').delete().in('id', junkIds);
    if (delError) console.error("Delete error:", delError);
    else console.log("Deletion SUCCESS!");
  }

  // 5. Title Case Normalization (Optional but good)
  console.log("\nNormalizing remaining topics to Title Case...");
  for (const [lower, topic] of processedTitles) {
    const formatted = toTitleCase(topic.title);
    if (formatted !== topic.title) {
       await supabase.from('topics').update({ title: formatted }).eq('id', topic.id);
    }
  }

  console.log("--- Cleanup V2 Finished ---");
}

deepCleanup();
