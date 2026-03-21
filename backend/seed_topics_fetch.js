import dotenv from 'dotenv';
dotenv.config();

const URL = process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_KEY;

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
  console.log("Fetching existing...");
  const res = await fetch(`${URL}/rest/v1/topics?select=title`, {
    headers: { 'apikey': KEY, 'Authorization': `Bearer ${KEY}` }
  });
  if (!res.ok) { console.error("Fetch failed", await res.text()); return; }
  const existing = await res.json();
  const existingTitles = existing.map(t => t.title.toLowerCase());
  
  const toInsert = topicsToAdd
    .filter(t => !existingTitles.includes(t.toLowerCase()))
    .map(t => ({ title: t, category: 'Community' }));

  if (toInsert.length > 0) {
    console.log("Inserting...", toInsert.length);
    const insertRes = await fetch(`${URL}/rest/v1/topics`, {
      method: 'POST',
      headers: { 'apikey': KEY, 'Authorization': `Bearer ${KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
      body: JSON.stringify(toInsert)
    });
    if (!insertRes.ok) { console.error("Insert failed", await insertRes.text()); }
    else { console.log("Success!"); }
  } else {
    console.log("All exist");
  }
}
seed();
