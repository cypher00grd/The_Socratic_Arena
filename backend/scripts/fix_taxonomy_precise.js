/**
 * fix_taxonomy_precise.js
 * -----------------------------------------------------------------------------
 * Precise manual correction for topics incorrectly classified as "Society".
 * Uses a hand-curated mapping based on the actual database dump.
 * -----------------------------------------------------------------------------
 */
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.join(__dirname, '../.env') });

import { supabase } from '../lib/supabaseClient.js';

// Hand-curated corrections for every misclassified topic
const CORRECTIONS = {
  // Science
  "Is The Multiverse Theory Scientifically Falsifiable?": "Science",
  "Is The Speed Of Light A Universal Constant?": "Science",
  "Should We De-extinct The Woolly Mammoth?": "Science",
  "Should Human Germline Editing Be Globally Banned?": "Science",
  "Space Exploration Vs Oceans: Which Is More Critical?": "Science",
  "Space Exploration": "Science",
  "Space Colonization": "Science",
  "Nuclear Energy": "Science",
  "Science In India Is Never Taken Seriously": "Science",

  // Technology
  "Artificial General Intelligence": "Technology",
  "Should Ai Be Granted Legal Personhood?": "Technology",
  "Should Neural Implants Be Regulated Like Medical Drugs?": "Technology",
  "Is Internet Access A Basic Human Right?": "Technology",
  "Will Blockchain Actually Decentralize Power?": "Technology",
  "Will Agi Inevitably Lead To Human Obsolescence?": "Technology",
  "Virtual Reality": "Technology",
  "Web3": "Technology",
  "Data Is The New Oil": "Technology",
  "Data Privacy": "Technology",
  "Social Media": "Technology",
  "Instagram Is Bad For Youngsters": "Technology",

  // Geopolitics
  "Is The Era Of Us Hegemony Officially Over?": "Geopolitics",
  "Should India Be A Permanent Member Of The Unsc?": "Geopolitics",
  "Is Space The Next Frontier For Military Conflict?": "Geopolitics",
  "Will The Arctic Be The Next Flashpoint For War?": "Geopolitics",
  "Should The Un Be Reformed To Yield More Power?": "Geopolitics",
  "India Vs Pakistan": "Geopolitics",
  "Is America The Final Boss??": "Geopolitics",

  // Politics
  "Is Direct Democracy Feasible In The Digital Age?": "Politics",
  "Should Political Leaders Have Maximum Age Limits?": "Politics",
  "Is The Concept Of The Nation-state Dying?": "Politics",
  "Should Voting Be Mandatory In All Democracies?": "Politics",
  "Is Technocracy Better Than Traditional Politics?": "Politics",
  "Democracy": "Politics",
  "Politics": "Politics",
  "Gun Control": "Politics",
  "Freedom Of Press": "Politics",
  "Free Speech": "Politics",
  "Ai Is Good For Democracy": "Politics",
  "Does Social Media Do More Harm Than Good To Democracy?": "Politics",

  // Economics
  "Is Capitalism Still The Best Economic System?": "Economics",
  "Will Crypto Replace Central Bank Currencies?": "Economics",
  "Should The Billionaires' Wealth Be Capped?": "Economics",
  "Is Globalization Good For Developing Nations?": "Economics",
  "Will Ai-driven Deflation Collapse The Economy?": "Economics",
  "Capitalism Vs Socialism": "Economics",
  "Should Ubi Be Implemented To Counter Automation?": "Economics",
  "Globalization": "Economics",
  "Income Inequality": "Economics",

  // Philosophy
  "Do We Live In A Computer Simulation?": "Philosophy",
  "Is Morality Objective Or Entirely Subjective?": "Philosophy",
  "What Is The Meaning Of Life In A Post-ai World?": "Philosophy",
  "Is Free Will An Illusion Created By Biology?": "Philosophy",
  "Should We Aim For Biological Immortality?": "Philosophy",

  // Food
  "Should Sugar Be Taxed Like Tobacco?": "Food",
  "Is A Strictly Vegan Diet Healthier For Humans?": "Food",
  "Should We Ban Pesticides In All Agriculture?": "Food",
  "Is Organic Food Worth The Premium Price?": "Food",
  "Is Lab-grown Meat The Only Sustainable Future?": "Food",
  "Can I Eat Veg": "Food",
  "Veg Vs Non-veg": "Food",
  "Veganism": "Food",
  "Non veg should be banned": "Food",

  // Sports
  "Should E-sports Be Included In The Olympics?": "Sports",
  "Does Var Improve Or Ruin The Spirit Of Football?": "Sports",
  "Should Doping Be Allowed In Separate Leagues?": "Sports",
  "Are College Athletes Being Exploited?": "Sports",
  "Should Men And Women Compete In The Same League?": "Sports",
  "E-sports": "Sports",

  // Health
  "Solitude Can Restore Good Mental Health.": "Health",
  "Vaccine Mandates": "Health",

  // Society (correct as-is, but upgrade some edge cases)
  "Should We Shift To A 4-day Work Week?": "Society",
  "Has Social Media Damaged Human Attention Spans?": "Society",
  "Is Cancel Culture A Form Of Digital Justice?": "Society",
  "Is Privacy A Luxury Or A Fundamental Right?": "Society",
  "Human Rights": "Society",
  "Remote Work": "Society",
  "Future Of Work": "Society",
  "Cancel Culture": "Society",
  "Arrange Marriage Vs Love Marriage": "Society",
  "Marriage": "Society",
  "Relationship": "Society",
  "People": "Society",

  // Education
  "education": "Society",
  "Education": "Society",
  "Education System": "Society",
  "Online education": "Society",
  "Online Education Is Better Than Offline Education": "Society",
  "online education is better than offline education": "Society",
  "Parents should start home schooling for kids greater than 10-15 yr old": "Society",

  // Misc/General
  "Travel": "Society",
  "General": "Society",
  "Consistency beats talent": "Philosophy",
  "Person With Relationship Have More Chance Of Getting Succeed In Life": "Society",
  "Meditation Practice should be made mandatory in Schools": "Health",
  "Is Fasting good?": "Health",
};

async function preciseRepair() {
  console.log('[Precise Taxonomy] Fetching all topics...');

  const { data: allTopics, error } = await supabase
    .from('topics')
    .select('id, title, category');

  if (error) {
    console.error('[Precise Taxonomy] Fetch error:', error);
    process.exit(1);
  }

  let updated = 0;
  let skipped = 0;

  for (const topic of allTopics) {
    const correction = CORRECTIONS[topic.title];
    if (correction && correction !== topic.category) {
      const { error: updateErr } = await supabase
        .from('topics')
        .update({ category: correction })
        .eq('id', topic.id);

      if (updateErr) {
        console.error(`  ❌ Failed: "${topic.title}":`, updateErr.message);
      } else {
        console.log(`  ✅ "${topic.title}": ${topic.category} → ${correction}`);
        updated++;
      }
    } else {
      skipped++;
    }
  }

  // Also fix the prompt injection entry and "People" / "education" categories
  const { data: badCategories } = await supabase
    .from('topics')
    .select('id, title, category')
    .in('category', ['People', 'education']);

  if (badCategories && badCategories.length > 0) {
    for (const t of badCategories) {
      const newCat = CORRECTIONS[t.title] || 'Society';
      if (newCat !== t.category) {
        await supabase.from('topics').update({ category: newCat }).eq('id', t.id);
        console.log(`  ✅ "${t.title}": ${t.category} → ${newCat}`);
        updated++;
      }
    }
  }

  console.log(`\n[Precise Taxonomy] ✅ Done! Updated: ${updated}, Already correct: ${skipped}`);
  process.exit(0);
}

preciseRepair();
