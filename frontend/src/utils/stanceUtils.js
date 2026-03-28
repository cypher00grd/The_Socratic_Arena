/**
 * generateStances
 * Logic for dynamic stance mapping in Socratic Arena.
 * Splits topics into Stance A (Pro/Left) and Stance B (Contra/Right).
 */
export const generateStances = (topicTitle) => {
  if (!topicTitle) return { 
    stanceA: "Support this topic", 
    stanceB: "Oppose this topic" 
  };

  // Strip trailing question marks and handle basic casing
  const cleanTitle = topicTitle.trim().replace(/\?+$/, '');
  const lowerTitle = cleanTitle.toLowerCase();

  // 1. Comparative Topic (A vs B or A vs. B)
  const vsPattern = /\s+vs\.?\s+/i;
  if (vsPattern.test(cleanTitle)) {
    const parts = cleanTitle.split(vsPattern);
    if (parts.length >= 2) {
      const partA = parts[0].trim();
      const partB = parts[1].trim();
      return {
        stanceA: `Argue for ${partA}`,
        descA: `PRO-${partA.toUpperCase()}: Defend the merits of ${partA}`,
        stanceB: `Argue for ${partB}`,
        descB: `PRO-${partB.toUpperCase()}: Champion the case for ${partB}`
      };
    }
  }

  // 2. Binary Questions (Should, Is, Do, Does, Can, Will)
  const binaryCheck = /^(should|is|do|does|can|will)\b/i;
  if (binaryCheck.test(lowerTitle)) {
    const firstSpace = cleanTitle.indexOf(' ');
    const restOfTopic = firstSpace !== -1 ? cleanTitle.substring(firstSpace + 1) : cleanTitle;
    
    return {
      stanceA: `Yes, ${restOfTopic}`,
      descA: "AFFIRMATIVE: Support the proposition",
      stanceB: `No, ${restOfTopic}`,
      descB: "NEGATIVE: Refute the proposition with logic"
    };
  }

  // 3. Statement Topics
  return {
    stanceA: `Support the claim: "${cleanTitle}"`,
    descA: "DEFENDER: Uphold the validity of this stance",
    stanceB: `Oppose the claim: "${cleanTitle}"`,
    descB: "CRITIC: Expose the fallacies in this logic"
  };
};
