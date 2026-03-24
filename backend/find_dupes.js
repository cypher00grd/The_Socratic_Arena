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

async function findDupes() {
  const { data, error } = await supabase.from('topics').select('*');
  if (error) { console.error(error); return; }
  
  const map = new Map();
  const dupes = [];
  
  data.forEach(t => {
    const low = t.title.toLowerCase().trim();
    if (map.has(low)) {
      dupes.push({ title: t.title, id: t.id, originalId: map.get(low) });
    } else {
      map.set(low, t.id);
    }
  });
  
  console.log("FOUND DUPES:", dupes.length);
  dupes.forEach(d => console.log(`DUPE: "${d.title}" | ID: ${d.id}`));
}

findDupes();
