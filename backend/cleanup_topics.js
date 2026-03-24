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

async function cleanup() {
  console.log("--- Topic Cleanup Started ---");
  
  // 1. Fetch all topics
  const { data: topics, error } = await supabase.from('topics').select('*');
  if (error) {
    console.error("Error fetching topics:", error);
    return;
  }
  
  console.log(`Analyzing ${topics.length} topics...`);
  
  const junkIds = [];
  const titlesSeen = new Set();
  
  topics.forEach(topic => {
    const title = (topic.title || "").trim();
    const lower = title.toLowerCase();
    
    let isJunk = false;
    
    // Baseless/Junk criteria
    if (title.length < 3) isJunk = true;
    if (lower.includes("ok ok")) isJunk = true;
    if (lower.includes("test topic")) isJunk = true;
    if (lower.includes("custom debate")) isJunk = true;
    if (lower === "technology" || lower === "science" || lower === "food" || 
        lower === "geopolitics" || lower === "politics" || lower === "society" || 
        lower === "philosophy" || lower === "sports" || lower === "economics" || 
        lower === "health" || lower === "entertainment") {
      // Keep these as they are domain categories
    } else if (titlesSeen.has(lower)) {
      isJunk = true; // Duplicate
    }
    
    // Gibberish check: if no vowels and length > 5
    if (!/[aeiou]/i.test(title) && title.length > 5) isJunk = true;

    if (isJunk) {
      junkIds.push(topic.id);
      console.log(`Marked for deletion: "${title}"`);
    } else {
      titlesSeen.add(lower);
    }
  });

  if (junkIds.length > 0) {
    console.log(`Deleting ${junkIds.length} junk topics...`);
    const { error: delError } = await supabase.from('topics').delete().in('id', junkIds);
    if (delError) console.error("Delete error:", delError);
    else console.log("Cleanup SUCCESS!");
  } else {
    console.log("No junk topics found.");
  }
  
  console.log("--- Cleanup Finished ---");
}

cleanup();
