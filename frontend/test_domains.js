import { getTopicDomain } from './src/lib/domainUtils.js';

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

if (getTopicDomain('Entertainment').domain === 'Technology') {
  console.error('FAIL: Entertainment still matched Technology!');
} else {
  console.log('PASS: Entertainment correctly categorized.');
}
