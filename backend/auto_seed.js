import { supabase } from './lib/supabaseClient.js';

const topicsToAdd = [
  // Science
  "Is the Multiverse Theory scientifically falsifiable?",
  "Should we de-extinct the Woolly Mammoth?",
  "Is the speed of light a universal constant?",
  "Should human germline editing be globally banned?",
  "Space exploration vs Oceans: which is more critical?",
  
  // Technology
  "Will AGI inevitably lead to human obsolescence?",
  "Should neural implants be regulated like medical drugs?",
  "Is internet access a basic human right?",
  "Will blockchain actually decentralize power?",
  "Should AI be granted legal personhood?",
  
  // Geopolitics
  "Is the era of US hegemony officially over?",
  "Should India be a permanent member of the UNSC?",
  "Is space the next frontier for military conflict?",
  "Will the Arctic be the next flashpoint for war?",
  "Should the UN be reformed to yield more power?",
  
  // Politics
  "Is direct democracy feasible in the digital age?",
  "Should political leaders have maximum age limits?",
  "Is the concept of the nation-state dying?",
  "Should voting be mandatory in all democracies?",
  "Is technocracy better than traditional politics?",
  
  // Society
  "Has social media damaged human attention spans?",
  "Should UBI be implemented to counter automation?",
  "Is privacy a luxury or a fundamental right?",
  "Should we shift to a 4-day work week?",
  "Is cancel culture a form of digital justice?",
  
  // Food
  "Is lab-grown meat the only sustainable future?",
  "Should sugar be taxed like tobacco?",
  "Is a strictly vegan diet healthier for humans?",
  "Should we ban pesticides in all agriculture?",
  "Is organic food worth the premium price?",
  
  // Philosophy
  "Do we live in a computer simulation?",
  "Is morality objective or entirely subjective?",
  "What is the meaning of life in a post-AI world?",
  "Is free will an illusion created by biology?",
  "Should we aim for biological immortality?",
  
  // Sports
  "Should e-sports be included in the Olympics?",
  "Does VAR improve or ruin the spirit of football?",
  "Should doping be allowed in separate leagues?",
  "Are college athletes being exploited?",
  "Should men and women compete in the same league?",
  
  // Economics
  "Is capitalism still the best economic system?",
  "Will crypto replace central bank currencies?",
  "Should the billionaires' wealth be capped?",
  "Is globalization good for developing nations?",
  "Will AI-driven deflation collapse the economy?",
  
  // Health
  "Is technology the cause of the mental health crisis?",
  "Should gene-editing remain illegal for humans?",
  "Will AI surgeons eventually replace humans?",
  "Should healthcare be 100% government funded?",
  "Is longevity research a waste of resources?",
  
  // Entertainment
  "Has streaming killed the movie theater experience?",
  "Is AI-generated music real art?",
  "Should celebrity private lives be public domain?",
  "Is movie stardom over in the age of creators?",
  "Should fan-fiction be protected as original work?"
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
