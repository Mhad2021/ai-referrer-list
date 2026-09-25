import assert from 'node:assert/strict';
import { detectAISource, detectAIReferrer, ga4Regex } from './index.js';

assert.deepEqual(detectAISource({ referrer: 'https://chatgpt.com/' }), { isAI: true, provider: 'chatgpt', source: 'chatgpt', via: 'referrer', match: 'chatgpt.com', confidence: 1 });
assert.equal(detectAIReferrer('https://claude.ai/chat/x').provider, 'claude');
assert.equal(detectAISource({ url: 'https://example.com/?utm_source=chatgpt.com' }).confidence, 0.9);
assert.equal(detectAISource({ referrer: 'https://www.perplexity.ai/search?q=x' }).source, 'perplexity');
assert.equal(detectAISource({ url: 'https://example.com/?utm_source=chatgpt.com' }).via, 'utm_source');
assert.equal(detectAISource({ referrer: 'https://www.google.com/' }), null, 'AI Overviews look like Google: not detectable');
assert.equal(detectAISource({ referrer: 'https://notclaude.ai.evil.com/' }), null);
assert.ok(new RegExp(`^(${ga4Regex})$`).test('claude.ai'));
console.log('ok');
