import type { IntelligenceQuery, IntelligenceResponse, Signal, SignalDomain } from './types';
import { getRuntimeSources } from './source-registry';

export function planQuery(query: IntelligenceQuery) {
  const domains = query.domains?.length ? query.domains : ['general','geopolitics','markets'] as SignalDomain[];
  return getRuntimeSources(domains).map((source) => ({
    domain: source.domain,
    endpoint: source.endpoint,
    source: source.id,
    priority: source.priority,
    query: query.query.trim(),
  }));
}

export function mergeSignals(query: IntelligenceQuery, batches: Signal[][]): IntelligenceResponse {
  const limit = Math.max(1, Math.min(query.limit ?? 50, 200));
  const seen = new Set<string>();
  const signals = batches.flat().filter((signal) => {
    const key = `${signal.source}:${signal.title.toLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, limit);
  const sources = [...new Set(signals.map((signal) => signal.source))];

  return {
    query: query.query.trim(),
    generatedAt: new Date().toISOString(),
    sources,
    signals,
    status: signals.length ? 'ok' : 'partial',
  };
}
