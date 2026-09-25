# ai-referrer-list

**Which AI assistant sent this visit?** A small, maintained list of the referrer hostnames and `utm_source` values that AI assistants send: ChatGPT, Gemini, Perplexity, Claude, Copilot, Meta AI, Grok, DeepSeek, Mistral, You.com, Phind and Poe. It comes with a tiny detector and a ready-made GA4 regex.

It's the list [Which AI Sent](https://whichaisent.com) uses in production for [AI search attribution](https://whichaisent.com/ai-search-attribution/).

```js
import { detectAISource, detectAIReferrer, ga4Regex } from 'ai-referrer-list';

detectAIReferrer(document.referrer);
// → { isAI: true, provider: 'chatgpt', via: 'referrer', match: 'chatgpt.com', confidence: 1 }  or null

detectAISource({ referrer: document.referrer, url: location.href });
// also checks utm_source (e.g. ChatGPT's utm_source=chatgpt.com), confidence 0.9
```

- `referrers.json`: the raw data, for any language.
- `ga4Regex`: paste into a GA4 channel group (Source matches regex). Or use the [online generator](https://whichaisent.com/tools/ai-referral-regex/) for GTM and Looker Studio versions.

## What it can't detect
- **Google AI Overviews and AI Mode** send a plain `google.com` referrer and are indistinguishable from organic search.
- **App visits with no referrer** (common from the ChatGPT and Gemini mobile apps) land as direct unless a UTM survives.
- **People who asked an AI, then searched your name or phoned.** Only asking them works. See [why](https://whichaisent.com/blog/how-did-you-hear-about-us-question/).

## Contributing
Seen an AI assistant sending traffic that isn't listed? Open an issue with the referrer hostname and an example landing URL (strip any personal data).

MIT licensed.
