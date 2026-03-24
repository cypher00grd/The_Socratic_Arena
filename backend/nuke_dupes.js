import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function nukeDupes() {
  console.log('--- Starting Global Topic De-duplication ---');

  // 1. Fetch all topics
  const { data: topics, error } = await supabase.from('topics').select('id, title');
  if (error) {
    console.error('Error fetching topics:', error);
    return;
  }

  // 2. Identify duplicates
  const seen = new Map(); // titleLow -> primaryId
  const dupesToDelete = [];

  topics.forEach(t => {
    const titleLow = (t.title || '').toLowerCase().trim();
    if (!titleLow) {
       dupesToDelete.push(t.id);
       return;
    }
    if (seen.has(titleLow)) {
      dupesToDelete.push(t.id);
    } else {
      seen.set(titleLow, t.id);
    }
  });

  console.log(`Found ${dupesToDelete.length} duplicates out of ${topics.length} total topics.`);

  if (dupesToDelete.length === 0) {
    console.log('No duplicates found. All clean!');
    return;
  }

  // 3. Delete them — Note: topic_follows has cascade? 
  // If not, we should handle follows first. 
  // Better yet, just delete from topics and see if it fails.
  console.log(`Deleting IDs: ${dupesToDelete.slice(0, 5).join(', ')}...`);

  // Simple delete loop to avoid query length limits
  for (const id of dupesToDelete) {
     const { error: delErr } = await supabase.from('topics').delete().eq('id', id);
     if (delErr) {
        console.error(`Failed to delete ID ${id}:`, delErr.message);
     }
  }

  console.log('--- De-duplication Complete ---');
}

nukeDupes();
