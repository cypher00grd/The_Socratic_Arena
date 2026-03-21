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

async function seed() {
  try {
    const { data: existing, error: err1 } = await supabase.from('topics').select('title');
    if (err1) throw err1;
    
    const existingTitles = existing ? existing.map(t => t.title.toLowerCase()) : [];
    
    const toInsert = topicsToAdd
      .filter(t => !existingTitles.includes(t.toLowerCase()))
      .map(t => ({ title: t, category: 'Community' }));

    if (toInsert.length > 0) {
      const { error } = await supabase.from('topics').insert(toInsert);
      if (error) throw error;
      console.log(`Inserted ${toInsert.length} topics successfully.`);
    } else {
      console.log("All topics already exist.");
    }
  } catch (e) {
    console.error("Seeding failed:", e.message || e);
  } finally {
    process.exit(0);
  }
}
seed();
