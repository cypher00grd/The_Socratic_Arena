import { supabase } from './lib/supabaseClient.js';

const topicsToAdd = [
  "Technology", "Geopolitics", "Food", "Travel", "Science",
  "Politics", "Society", "Philosophy", "Sports", "Economics",
  "Health", "Entertainment", "Artificial Intelligence", "Climate Change",
  "Space Exploration", "Cryptocurrency", "Education System",
  "Remote Work", "Mental Health", "Social Media", "Renewable Energy",
  "Universal Basic Income", "Data Privacy", "Genetic Engineering",
  "Cybersecurity", "Electric Vehicles", "Global Warming", "Human Rights",
  "Automation", "Future of Work", "Healthcare Systems", "Veganism",
  "Censorship", "Cancel Culture", "Space Colonization", "E-sports",
  "Globalization", "Nuclear Energy", "Capitalism vs Socialism", "Free Speech",
  "Gun Control", "Immigration", "Artificial General Intelligence", "Web3",
  "Virtual Reality", "Quantum Computing", "Democracy", "Freedom of Press",
  "Income Inequality", "Vaccine Mandates"
];

setTimeout(async () => {
  console.log("[SEED] Starting database topic seed...");
  try {
    const { data: existing, error: err1 } = await supabase.from('topics').select('title');
    if (err1) { console.error("[SEED] Fetch error:", err1); return; }
    
    const existingTitles = existing ? existing.map(t => t.title.toLowerCase()) : [];
    const toInsert = topicsToAdd
      .filter(t => !existingTitles.includes(t.toLowerCase()))
      .map(t => ({ title: t, category: 'Community' }));

    if (toInsert.length > 0) {
      console.log(`[SEED] Inserting ${toInsert.length} topics...`);
      const { error } = await supabase.from('topics').insert(toInsert);
      if (error) console.error("[SEED] Insert error:", error);
      else console.log("[SEED] Insert SUCCESS!");
    } else {
      console.log("[SEED] Topics already exist. No insertion needed.");
    }
  } catch (e) {
    console.error("[SEED] Exception:", e.message);
  }
}, 2000);
