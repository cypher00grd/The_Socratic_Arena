/**
 * fix_taxonomy_fast.js
 * -----------------------------------------------------------------------------
 * Fast, deterministic taxonomy repair — no AI calls needed.
 * Uses keyword-based heuristics to classify all remaining "Community" topics.
 * -----------------------------------------------------------------------------
 */

import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.join(__dirname, '../.env') });

import { supabase } from '../lib/supabaseClient.js';

// Keyword-to-category mapping (order matters — first match wins)
const CATEGORY_RULES = [
  { category: 'Science',       keywords: ['science', 'multiverse', 'mammoth', 'speed of light', 'germline', 'oceans', 'de-extinct', 'falsifiable', 'evolution', 'climate', 'physics', 'biology', 'chemistry', 'space exploration', 'mars', 'quantum', 'nano', 'dna', 'genome', 'asteroid', 'big bang', 'gravity', 'dark matter', 'fusion', 'atom', 'molecule', 'environment', 'pollution', 'carbon', 'earth', 'planet', 'ecosystem'] },
  { category: 'Technology',    keywords: ['ai ', 'agi', 'neural implant', 'internet', 'blockchain', 'personhood', 'technology', 'tech', 'robot', 'automation', 'cyber', 'software', 'hardware', 'algorithm', 'data', 'machine learning', 'deep learning', 'metaverse', 'vr', 'ar ', 'cryptocurrency', 'coding', 'programming', 'silicon', 'computer', 'gpu', 'chips', 'digital', 'cloud', 'saas', 'app ', 'smartphone', 'social media', 'instagram', 'twitter', 'facebook', 'tiktok', 'youtube'] },
  { category: 'Geopolitics',   keywords: ['hegemony', 'unsc', 'military', 'arctic', 'un ', 'united nations', 'geopolitic', 'nato', 'war', 'conflict', 'sanctions', 'nuclear weapon', 'india vs', 'china', 'russia', 'america', 'pakistan', 'taiwan', 'border', 'sovereignty', 'colonialism', 'imperialism', 'superpower', 'cold war'] },
  { category: 'Politics',      keywords: ['democracy', 'voting', 'political', 'nation-state', 'technocracy', 'election', 'government', 'constitution', 'parliament', 'congress', 'president', 'prime minister', 'ideology', 'left wing', 'right wing', 'liberal', 'conservative', 'communism', 'socialism', 'fascism', 'dictatorship', 'monarchy', 'republic', 'freedom of press', 'censorship', 'campaign'] },
  { category: 'Philosophy',    keywords: ['simulation', 'morality', 'meaning of life', 'free will', 'immortality', 'philosophy', 'consciousness', 'ethics', 'existence', 'truth', 'justice', 'virtue', 'stoic', 'nihilism', 'determinism', 'existentialism', 'metaphysics', 'epistemology', 'god', 'afterlife', 'soul', 'reality', 'illusion', 'perception', 'reason'] },
  { category: 'Economics',     keywords: ['capitalism', 'crypto', 'billionaire', 'globalization', 'deflation', 'economy', 'economic', 'inflation', 'gdp', 'market', 'stock', 'trade', 'tariff', 'wealth', 'poverty', 'tax', 'fiscal', 'monetary', 'bank', 'finance', 'investment', 'recession', 'depression', 'subsidy', 'deficit', 'debt', 'ubi', 'income'] },
  { category: 'Health',        keywords: ['mental health', 'gene-editing', 'surgeon', 'healthcare', 'longevity', 'health', 'disease', 'medicine', 'vaccine', 'pandemic', 'epidemic', 'virus', 'therapy', 'drug', 'pharmaceutical', 'hospital', 'doctor', 'patient', 'diagnosis', 'cancer', 'diabetes', 'obesity', 'fitness', 'wellness', 'nutrition'] },
  { category: 'Food',          keywords: ['lab-grown meat', 'sugar', 'vegan', 'pesticide', 'organic food', 'food', 'diet', 'cuisine', 'vegetarian', 'non-veg', 'meat', 'farm', 'agriculture', 'gmo', 'gluten', 'cooking', 'restaurant', 'eating', 'hunger', 'fasting', 'supplement', 'protein', 'calorie'] },
  { category: 'Sports',        keywords: ['olympics', 'var ', 'doping', 'athlete', 'league', 'sport', 'football', 'cricket', 'basketball', 'tennis', 'soccer', 'boxing', 'wrestling', 'e-sport', 'esport', 'racing', 'swimming', 'hockey', 'rugby', 'ipl', 'world cup', 'champion', 'medal', 'coaching', 'team'] },
  { category: 'Entertainment', keywords: ['streaming', 'music', 'celebrity', 'movie', 'fan-fiction', 'entertainment', 'film', 'netflix', 'bollywood', 'hollywood', 'anime', 'manga', 'gaming', 'game', 'art', 'artist', 'creator', 'influencer', 'podcast', 'comedy', 'drama', 'theater', 'theatre', 'concert', 'festival', 'stardom'] },
  { category: 'Society',       keywords: ['attention span', 'ubi', 'privacy', '4-day work', 'cancel culture', 'society', 'culture', 'education', 'school', 'university', 'college', 'marriage', 'family', 'gender', 'feminism', 'equality', 'racism', 'discrimination', 'immigration', 'religion', 'tradition', 'moral', 'community', 'generation', 'millennial', 'gen z', 'population', 'urban', 'rural', 'work', 'career', 'job', 'employment', 'pension', 'retirement', 'travel', 'tourism', 'language', 'people', 'youth', 'senior', 'children', 'human right', 'parenting', 'homeschool', 'exam', 'test', 'grading', 'curriculum'] },
];

function classifyByKeywords(title) {
  const lower = title.toLowerCase();
  for (const rule of CATEGORY_RULES) {
    for (const kw of rule.keywords) {
      if (lower.includes(kw)) {
        return rule.category;
      }
    }
  }
  return 'Society'; // Safe fallback for anything truly ambiguous
}

async function fastRepair() {
  console.log('[Fast Taxonomy] Fetching all "Community" topics...');

  const { data: topics, error } = await supabase
    .from('topics')
    .select('id, title')
    .eq('category', 'Community');

  if (error) {
    console.error('[Fast Taxonomy] Fetch error:', error);
    process.exit(1);
  }

  if (!topics || topics.length === 0) {
    console.log('[Fast Taxonomy] ✅ No "Community" topics remain. Database is clean!');
    process.exit(0);
  }

  console.log(`[Fast Taxonomy] Found ${topics.length} topics to fix.\n`);

  // Build batch updates grouped by category
  const updates = topics.map(t => ({
    id: t.id,
    title: t.title,
    newCategory: classifyByKeywords(t.title),
  }));

  // Log the mapping for review
  for (const u of updates) {
    console.log(`  "${u.title}" → ${u.newCategory}`);
  }

  console.log(`\n[Fast Taxonomy] Applying ${updates.length} updates...`);

  // Execute updates in parallel batches of 10
  const batchSize = 10;
  for (let i = 0; i < updates.length; i += batchSize) {
    const batch = updates.slice(i, i + batchSize);
    await Promise.all(
      batch.map(u =>
        supabase.from('topics').update({ category: u.newCategory }).eq('id', u.id)
      )
    );
    console.log(`[Fast Taxonomy] Batch ${Math.floor(i / batchSize) + 1} complete.`);
  }

  console.log(`\n[Fast Taxonomy] ✅ All ${updates.length} topics re-categorized successfully!`);
  process.exit(0);
}

fastRepair();
