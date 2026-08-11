import type { IntelligenceQuery, IntelligenceResponse, Signal, SignalDomain } from './types';
import { getRuntimeSources } from './source-registry';
import { assessEvidence } from './evidence-fusion';

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
  const deduped = batches.flat().filter((signal) => {
    const key = `${signal.source}:${signal.title.toLowerCase().trim()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const assessed = assessEvidence(deduped);
  const signals = assessed.slice(0, limit).map(({ signal, score }) => ({
    ...signal,
    confidence: Number(score.toFixed(3)),
  }));
  const sources = [...new Set(signals.map((signal) => signal.source))];

  return {
    query: query.query.trim(),
    generatedAt: new Date().toISOString(),
    sources,
    signals,
    status: signals.length ? 'ok' : 'partial',
  };
}
