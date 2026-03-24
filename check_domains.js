import { getTopicDomain } from './frontend/src/lib/domainUtils.js';

const testCases = [
  'Entertainment',
  'Technology',
  'Food',
  'Health',
  'AI in Entertainment',
  'Healthcare Sustainability',
  'The future of AI',
  'Organic Farming',
  'Sugar and Tobacco',
  'Fairness in Sports'
];

testCases.forEach(t => {
  const result = getTopicDomain(t);
  console.log(`Title: "${t}" -> Domain: ${result.domain}`);
});
