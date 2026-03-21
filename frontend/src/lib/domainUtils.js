export const domainRules = [
  { domain: 'Science', color: 'text-blue-300 bg-blue-950/40 border-blue-500/30', keywords: ['science', 'physics', 'chemistry', 'biology', 'evolution', 'quantum', 'space', 'universe', 'climate', 'environment', 'nature', 'genetics', 'dna', 'atom', 'molecule', 'experiment', 'research', 'theory', 'hypothesis'] },
  { domain: 'Technology', color: 'text-cyan-300 bg-cyan-950/40 border-cyan-500/30', keywords: ['tech', 'ai', 'artificial intelligence', 'machine learning', 'robot', 'software', 'hardware', 'internet', 'cyber', 'digital', 'computer', 'algorithm', 'programming', 'coding', 'blockchain', 'crypto', 'agi', 'automation', 'data'] },
  { domain: 'Geopolitics', color: 'text-rose-300 bg-rose-950/40 border-rose-500/30', keywords: ['geopolitics', 'india', 'pakistan', 'china', 'russia', 'america', 'usa', 'war', 'military', 'nuclear', 'weapon', 'nato', 'united nations', 'conflict', 'border', 'territory', 'sanction', 'diplomacy', 'peace'] },
  { domain: 'Politics', color: 'text-red-300 bg-red-950/40 border-red-500/30', keywords: ['politics', 'political', 'politician', 'democracy', 'government', 'election', 'vote', 'parliament', 'law', 'constitution', 'president', 'minister', 'policy', 'regulation', 'rights', 'freedom', 'liberty', 'socialism', 'capitalism', 'fascism', 'communism', 'authoritarian', 'liberal', 'conservative'] },
  { domain: 'Society', color: 'text-amber-300 bg-amber-950/40 border-amber-500/30', keywords: ['social media', 'society', 'culture', 'community', 'inequality', 'gender', 'race', 'class', 'poverty', 'education', 'school', 'university', 'marriage', 'family', 'religion', 'harm', 'mental health', 'addiction'] },
  { domain: 'Food', color: 'text-green-300 bg-green-950/40 border-green-500/30', keywords: ['food', 'veg', 'non-veg', 'meat', 'diet', 'nutrition', 'cooking', 'recipe', 'organic', 'vegan', 'vegetarian', 'health', 'eating', 'cuisine', 'restaurant'] },
  { domain: 'Philosophy', color: 'text-violet-300 bg-violet-950/40 border-violet-500/30', keywords: ['philosophy', 'moral', 'ethics', 'exist', 'consciousness', 'truth', 'knowledge', 'wisdom', 'belief', 'reality', 'meaning', 'purpose', 'free will', 'soul', 'mind'] },
  { domain: 'Sports', color: 'text-orange-300 bg-orange-950/40 border-orange-500/30', keywords: ['sport', 'cricket', 'football', 'soccer', 'basketball', 'tennis', 'olympic', 'athlete', 'game', 'match', 'tournament', 'ipl', 'fifa', 'nba'] },
  { domain: 'Economics', color: 'text-emerald-300 bg-emerald-950/40 border-emerald-500/30', keywords: ['economic', 'finance', 'money', 'market', 'stock', 'trade', 'gdp', 'inflation', 'tax', 'budget', 'investment', 'bank', 'currency', 'wealth', 'debt'] },
  { domain: 'Health', color: 'text-teal-300 bg-teal-950/40 border-teal-500/30', keywords: ['health', 'medical', 'doctor', 'hospital', 'disease', 'vaccine', 'drug', 'therapy', 'treatment', 'pandemic', 'virus', 'cancer', 'surgery', 'pharma'] },
  { domain: 'Entertainment', color: 'text-pink-300 bg-pink-950/40 border-pink-500/30', keywords: ['movie', 'film', 'music', 'song', 'celebrity', 'bollywood', 'hollywood', 'tv', 'series', 'anime', 'manga', 'comic', 'art', 'dance', 'theater'] },
];

export const getTopicDomain = (title) => {
  if (!title) return { domain: 'General', color: 'text-slate-300 bg-slate-800/50 border-slate-600/30' };
  const lower = title.toLowerCase();
  for (const rule of domainRules) {
    for (const kw of rule.keywords) {
      if (lower.includes(kw)) return rule;
    }
  }
  return { domain: 'General', color: 'text-slate-300 bg-slate-800/50 border-slate-600/30' };
};

export const broadTopicsList = [
  "technology", "geopolitics", "food", "travel", "science",
  "politics", "society", "philosophy", "sports", "economics",
  "health", "entertainment", "artificial intelligence", "climate change",
  "space exploration", "cryptocurrency", "education system", "remote work",
  "mental health", "social media", "renewable energy", "universal basic income",
  "data privacy", "genetic engineering", "cybersecurity", "electric vehicles",
  "global warming", "human rights", "automation", "future of work",
  "healthcare systems", "veganism", "censorship", "cancel culture",
  "space colonization", "e-sports", "globalization", "nuclear energy",
  "capitalism vs socialism", "free speech", "gun control", "immigration",
  "artificial general intelligence", "web3", "virtual reality",
  "quantum computing", "democracy", "freedom of press",
  "income inequality", "vaccine mandates"
];
