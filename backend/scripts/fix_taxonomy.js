/**
 * fix_taxonomy.js
 * -----------------------------------------------------------------------------
 * One-off script to repair the database by re-categorizing topics marked as 'Community'.
 * Uses Gemini AI for high-fidelity classification.
 * -----------------------------------------------------------------------------
 */

import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { supabase } from '../lib/supabaseClient.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Setup environment
const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.join(__dirname, '../.env') });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const VALID_CATEGORIES = [
  'Food', 'Health', 'Science', 'Technology', 'Geopolitics', 
  'Politics', 'Society', 'Philosophy', 'Sports', 'Economics', 'Entertainment'
];

async function classifyTopic(title) {
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash",
    generationConfig: { responseMimeType: "application/json" }
  });

  const prompt = `You are a topic classifier for a debate platform.
Classify this debate topic into exactly ONE category from the list below.
Topic: "${title}"
Categories: ${VALID_CATEGORIES.join(', ')}
If none fit well, use "Society" (it covers general human interests).
Respond STRICTLY with a valid JSON object: {"category": "CategoryName"}`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const json = JSON.parse(text);
    if (json.category && VALID_CATEGORIES.includes(json.category)) {
      return json.category;
    }
    return 'Society';
  } catch (err) {
    console.error(`[Fix] AI Error for "${title}":`, err.message);
    return 'Society';
  }
}

async function classifyWithRetry(title, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const category = await classifyTopic(title);
      return category;
    } catch (err) {
      if (err.message.includes('429') && i < retries - 1) {
        console.warn(`[Taxonomy Repair] 429 Rate Limited. Retrying in 10s...`);
        await new Promise(r => setTimeout(r, 10000));
        continue;
      }
      throw err;
    }
  }
}

async function startRepair() {
  console.log('[Taxonomy Repair] Fetching "Community" topics...');
  
  const { data: topics, error } = await supabase
    .from('topics')
    .select('id, title')
    .eq('category', 'Community');

  if (error) {
    console.error('[Taxonomy Repair] Fetch error:', error);
    return;
  }

  if (!topics || topics.length === 0) {
    console.log('[Taxonomy Repair] No "Community" topics found. Database is healthy.');
    return;
  }

  console.log(`[Taxonomy Repair] Found ${topics.length} topics to re-categorize.`);

  for (let i = 0; i < topics.length; i++) {
    const topic = topics[i];
    console.log(`[${i+1}/${topics.length}] Classifying: "${topic.title}"...`);
    
    try {
      const newCategory = await classifyWithRetry(topic.title);
      
      const { error: updateError } = await supabase
        .from('topics')
        .update({ category: newCategory })
        .eq('id', topic.id);

      if (updateError) {
        console.error(`[Taxonomy Repair] Failed to update "${topic.title}":`, updateError.message);
      } else {
        console.log(`[Taxonomy Repair] Updated "${topic.title}" -> ${newCategory}`);
      }
    } catch (e) {
      console.error(`[Taxonomy Repair] Final failure for "${topic.title}":`, e.message);
    }

    // Rate limiting for Gemini (Free tier is 15-20 RPM)
    await new Promise(r => setTimeout(r, 6000));
  }

  console.log('[Taxonomy Repair] ✅ Repair complete!');
}

startRepair();
