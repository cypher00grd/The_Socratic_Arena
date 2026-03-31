import { supabase } from './lib/supabaseClient.js';

const topicsToAdd = [
  // Science
  { title: "Is the Multiverse Theory scientifically falsifiable?", category: "Science" },
  { title: "Should we de-extinct the Woolly Mammoth?", category: "Science" },
  { title: "Is the speed of light a universal constant?", category: "Science" },
  { title: "Should human germline editing be globally banned?", category: "Science" },
  { title: "Space exploration vs Oceans: which is more critical?", category: "Science" },
  
  // Technology
  { title: "Will AGI inevitably lead to human obsolescence?", category: "Technology" },
  { title: "Should neural implants be regulated like medical drugs?", category: "Technology" },
  { title: "Is internet access a basic human right?", category: "Technology" },
  { title: "Will blockchain actually decentralize power?", category: "Technology" },
  { title: "Should AI be granted legal personhood?", category: "Technology" },
  
  // Geopolitics
  { title: "Is the era of US hegemony officially over?", category: "Geopolitics" },
  { title: "Should India be a permanent member of the UNSC?", category: "Geopolitics" },
  { title: "Is space the next frontier for military conflict?", category: "Geopolitics" },
  { title: "Will the Arctic be the next flashpoint for war?", category: "Geopolitics" },
  { title: "Should the UN be reformed to yield more power?", category: "Geopolitics" },
  
  // Politics
  { title: "Is direct democracy feasible in the digital age?", category: "Politics" },
  { title: "Should political leaders have maximum age limits?", category: "Politics" },
  { title: "Is the concept of the nation-state dying?", category: "Politics" },
  { title: "Should voting be mandatory in all democracies?", category: "Politics" },
  { title: "Is technocracy better than traditional politics?", category: "Politics" },
  
  // Society
  { title: "Has social media damaged human attention spans?", category: "Society" },
  { title: "Should UBI be implemented to counter automation?", category: "Society" },
  { title: "Is privacy a luxury or a fundamental right?", category: "Society" },
  { title: "Should we shift to a 4-day work week?", category: "Society" },
  { title: "Is cancel culture a form of digital justice?", category: "Society" },
  
  // Food
  { title: "Is lab-grown meat the only sustainable future?", category: "Food" },
  { title: "Should sugar be taxed like tobacco?", category: "Food" },
  { title: "Is a strictly vegan diet healthier for humans?", category: "Food" },
  { title: "Should we ban pesticides in all agriculture?", category: "Food" },
  { title: "Is organic food worth the premium price?", category: "Food" },
  
  // Philosophy
  { title: "Do we live in a computer simulation?", category: "Philosophy" },
  { title: "Is morality objective or entirely subjective?", category: "Philosophy" },
  { title: "What is the meaning of life in a post-AI world?", category: "Philosophy" },
  { title: "Is free will an illusion created by biology?", category: "Philosophy" },
  { title: "Should we aim for biological immortality?", category: "Philosophy" },
  
  // Sports
  { title: "Should e-sports be included in the Olympics?", category: "Sports" },
  { title: "Does VAR improve or ruin the spirit of football?", category: "Sports" },
  { title: "Should doping be allowed in separate leagues?", category: "Sports" },
  { title: "Are college athletes being exploited?", category: "Sports" },
  { title: "Should men and women compete in the same league?", category: "Sports" },
  
  // Economics
  { title: "Is capitalism still the best economic system?", category: "Economics" },
  { title: "Will crypto replace central bank currencies?", category: "Economics" },
  { title: "Should the billionaires' wealth be capped?", category: "Economics" },
  { title: "Is globalization good for developing nations?", category: "Economics" },
  { title: "Will AI-driven deflation collapse the economy?", category: "Economics" },
  
  // Health
  { title: "Is technology the cause of the mental health crisis?", category: "Health" },
  { title: "Should gene-editing remain illegal for humans?", category: "Health" },
  { title: "Will AI surgeons eventually replace humans?", category: "Health" },
  { title: "Should healthcare be 100% government funded?", category: "Health" },
  { title: "Is longevity research a waste of resources?", category: "Health" },
  
  // Entertainment
  { title: "Has streaming killed the movie theater experience?", category: "Entertainment" },
  { title: "Is AI-generated music real art?", category: "Entertainment" },
  { title: "Should celebrity private lives be public domain?", category: "Entertainment" },
  { title: "Is movie stardom over in the age of creators?", category: "Entertainment" },
  { title: "Should fan-fiction be protected as original work?", category: "Entertainment" }
];

setTimeout(async () => {
  console.log("[SEED] Starting database topic seed...");
  try {
    const { data: existing, error: err1 } = await supabase.from('topics').select('title');
    if (err1) { console.error("[SEED] Fetch error:", err1); return; }
    
    const existingTitles = existing ? existing.map(t => t.title.toLowerCase()) : [];
    const toInsert = topicsToAdd
      .filter(t => !existingTitles.includes(t.title.toLowerCase()))
      .map(t => ({ title: t.title, category: t.category }));

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
