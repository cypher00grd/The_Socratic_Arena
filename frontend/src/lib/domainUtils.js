export const domainRules = [
  { domain: 'Food', color: 'text-green-300 bg-green-950/40 border-green-500/30', keywords: ['food', 'veg', 'non-veg', 'meat', 'diet', 'nutrition', 'cooking', 'recipe', 'organic', 'vegan', 'vegetarian', 'eating', 'cuisine', 'restaurant', 'sustainable', 'agriculture', 'pesticide', 'farming', 'crop', 'junk food', 'fast food', 'processed food'] },
  { domain: 'Health', color: 'text-teal-300 bg-teal-950/40 border-teal-500/30', keywords: ['health', 'healthy', 'medical', 'doctor', 'hospital', 'disease', 'vaccine', 'drug', 'therapy', 'treatment', 'pandemic', 'virus', 'cancer', 'surgery', 'pharma', 'sugar', 'tobacco', 'fitness', 'exercise', 'yoga', 'wellness', 'sleep', 'obesity', 'smoking'] },
  { domain: 'Science', color: 'text-blue-300 bg-blue-950/40 border-blue-500/30', keywords: ['science', 'physics', 'chemistry', 'biology', 'evolution', 'quantum', 'space', 'universe', 'climate', 'environment', 'nature', 'genetics', 'genetic', 'dna', 'atom', 'molecule', 'experiment', 'research', 'theory', 'hypothesis', 'global warming', 'warming', 'sustainability', 'asteroid', 'planet', 'mars', 'moon'] },
  { domain: 'Technology', color: 'text-cyan-300 bg-cyan-950/40 border-cyan-500/30', keywords: ['technology', 'tech', 'ai', 'artificial intelligence', 'machine learning', 'robot', 'software', 'hardware', 'internet', 'cyber', 'digital', 'computer', 'algorithm', 'programming', 'coding', 'blockchain', 'crypto', 'agi', 'automation', 'data', 'virtual reality', 'vr', 'metaverse', 'neural', 'mobile', 'phone', 'smartphone', 'laptop', 'gadget', 'app', 'device', 'screen', 'social media'] },
  { domain: 'Geopolitics', color: 'text-rose-300 bg-rose-950/40 border-rose-500/30', keywords: ['geopolitics', 'india', 'pakistan', 'china', 'russia', 'america', 'usa', 'war', 'military', 'nuclear', 'weapon', 'nato', 'united nations', 'conflict', 'border', 'territory', 'sanction', 'diplomacy', 'peace', 'defense', 'army', 'navy'] },
  { domain: 'Politics', color: 'text-red-300 bg-red-950/40 border-red-500/30', keywords: ['politics', 'political', 'politician', 'democracy', 'government', 'election', 'vote', 'parliament', 'law', 'constitution', 'president', 'minister', 'policy', 'regulation', 'rights', 'freedom', 'liberty', 'socialism', 'capitalism', 'fascism', 'communism', 'authoritarian', 'liberal', 'conservative'] },
  { domain: 'Society', color: 'text-amber-300 bg-amber-950/40 border-amber-500/30', keywords: ['social media', 'society', 'social', 'culture', 'community', 'inequality', 'gender', 'race', 'class', 'poverty', 'education', 'school', 'university', 'marriage', 'family', 'religion', 'harm', 'mental health', 'addiction', 'instagram', 'tiktok', 'snapchat'] },
  { domain: 'Philosophy', color: 'text-violet-300 bg-violet-950/40 border-violet-500/30', keywords: ['philosophy', 'philosophical', 'moral', 'ethics', 'exist', 'consciousness', 'truth', 'knowledge', 'wisdom', 'belief', 'reality', 'meaning', 'purpose', 'free will', 'soul', 'mind'] },
  { domain: 'Sports', color: 'text-orange-300 bg-orange-950/40 border-orange-500/30', keywords: ['sports', 'sport', 'cricket', 'football', 'soccer', 'basketball', 'tennis', 'olympic', 'athlete', 'game', 'match', 'tournament', 'ipl', 'fifa', 'nba', 'hockey', 'swimming', 'wrestling', 'boxing', 'gym'] },
  { domain: 'Economics', color: 'text-emerald-300 bg-emerald-950/40 border-emerald-500/30', keywords: ['economics', 'economic', 'finance', 'money', 'market', 'stock', 'trade', 'gdp', 'inflation', 'tax', 'budget', 'investment', 'bank', 'currency', 'wealth', 'debt'] },
  { domain: 'Entertainment', color: 'text-pink-300 bg-pink-950/40 border-pink-500/30', keywords: ['entertainment', 'movie', 'film', 'music', 'song', 'celebrity', 'bollywood', 'hollywood', 'tv', 'series', 'anime', 'manga', 'comic', 'performing art', 'dance', 'theater', 'streaming', 'netflix', 'youtube'] },
];

export const getTopicDomain = (title) => {
  if (!title) return { domain: 'General', color: 'text-slate-300 bg-slate-800/50 border-slate-600/30' };
  const lower = title.toLowerCase();

  // Primary Check: Exact Domain Match (Case Insensitive)
  for (const rule of domainRules) {
    if (lower === rule.domain.toLowerCase()) return rule;
  }

  // Secondary Check: Keyword with word boundaries to avoid substrings like 'ai' in 'Entertainment'
  for (const rule of domainRules) {
    for (const kw of rule.keywords) {
      const regex = new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (regex.test(lower)) return rule;
    }
  }

  return { domain: 'General', color: 'text-slate-300 bg-slate-800/50 border-slate-600/30' };
};

export const broadTopicsList = [
  "Is the Multiverse Theory scientifically falsifiable?",
  "Should we de-extinct the Woolly Mammoth?",
  "Is the speed of light a universal constant?",
  "Should human germline editing be globally banned?",
  "Space exploration vs Oceans: which is more critical?",
  "Will AGI inevitably lead to human obsolescence?",
  "Should neural implants be regulated like medical drugs?",
  "Is internet access a basic human right?",
  "Will blockchain actually decentralize power?",
  "Should AI be granted legal personhood?",
  "Is the era of US hegemony officially over?",
  "Should India be a permanent member of the UNSC?",
  "Is space the next frontier for military conflict?",
  "Will the Arctic be the next flashpoint for war?",
  "Should the UN be reformed to yield more power?",
  "Is direct democracy feasible in the digital age?",
  "Should political leaders have maximum age limits?",
  "Is the concept of the nation-state dying?",
  "Should voting be mandatory in all democracies?",
  "Is technocracy better than traditional politics?",
  "Has social media damaged human attention spans?",
  "Should UBI be implemented to counter automation?",
  "Is privacy a luxury or a fundamental right?",
  "Should we shift to a 4-day work week?",
  "Is cancel culture a form of digital justice?",
  "Is lab-grown meat the only sustainable future?",
  "Should sugar be taxed like tobacco?",
  "Is a strictly vegan diet healthier for humans?",
  "Should we ban pesticides in all agriculture?",
  "Is organic food worth the premium price?",
  "Do we live in a computer simulation?",
  "Is morality objective or entirely subjective?",
  "What is the meaning of life in a post-AI world?",
  "Is free will an illusion created by biology?",
  "Should we aim for biological immortality?",
  "Should e-sports be included in the Olympics?",
  "Does VAR improve or ruin the spirit of football?",
  "Should doping be allowed in separate leagues?",
  "Are college athletes being exploited?",
  "Should men and women compete in the same league?",
  "Is capitalism still the best economic system?",
  "Will crypto replace central bank currencies?",
  "Should the billionaires' wealth be capped?",
  "Is globalization good for developing nations?",
  "Will AI-driven deflation collapse the economy?",
  "Is technology the cause of the mental health crisis?",
  "Should gene-editing remain illegal for humans?",
  "Will AI surgeons eventually replace humans?",
  "Should healthcare be 100% government funded?",
  "Is longevity research a waste of resources?",
  "Has streaming killed the movie theater experience?",
  "Is AI-generated music real art?",
  "Should celebrity private lives be public domain?",
  "Is movie stardom over in the age of creators?",
  "Should fan-fiction be protected as original work?"
];
