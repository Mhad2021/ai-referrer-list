// Detects which AI assistant sent a visit, from the referrer and/or landing URL.
// Data: referrers.json (the list Which AI Sent uses in production).
import data from './referrers.json' with { type: 'json' };

const HOSTS = data.hosts;
const UTM = data.utm.map(({ pattern, source }) => [new RegExp(pattern), source]);

function hostOf(value) {
  try { return new URL(value).hostname.toLowerCase(); } catch { return ''; }
}

/**
 * detectAISource({ referrer, url }) → result or null
 *   { isAI: true, provider, source, via, match, confidence }
 *   provider/source: chatgpt | gemini | perplexity | claude | copilot | other_ai
 *   via: 'referrer' (confidence 1) | 'utm_source' (confidence 0.9: UTMs can be copied or faked)
 * Google AI Overviews / AI Mode are NOT detectable (they send a plain google.com referrer) and return null.
 */
export function detectAISource({ referrer = '', url = '' } = {}) {
  const host = hostOf(referrer);
  if (host) {
    for (const { host: h, source } of HOSTS) {
      if (host === h || host.endsWith(`.${h}`)) return { isAI: true, provider: source, source, via: 'referrer', match: h, confidence: 1 };
    }
  }
  let utm = '';
  try { utm = (new URL(url).searchParams.get('utm_source') || '').toLowerCase(); } catch {}
  if (utm) {
    for (const [re, source] of UTM) if (re.test(utm)) return { isAI: true, provider: source, source, via: 'utm_source', match: utm, confidence: 0.9 };
  }
  return null;
}

/** Shorthand: detect from a referrer string only, e.g. detectAIReferrer(document.referrer). */
export const detectAIReferrer = (referrer) => detectAISource({ referrer });

/** Regex of every AI referrer hostname, for GA4 channel groups and report filters. */
export const ga4Regex = HOSTS.map(({ host }) => host.replace(/\./g, '\\.')).join('|');

export const hosts = HOSTS.map(({ host, source }) => ({ host, source }));
