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

async function dump() {
  const { data, error } = await supabase.from('topics').select('*');
  if (error) {
    console.error(error);
    return;
  }
  console.log("TOTAL TOPICS:", data.length);
  data.sort((a,b) => a.title.localeCompare(b.title)).forEach(t => {
    console.log(`[${t.id}] "${t.title}" | Category: ${t.category}`);
  });
}

dump();
