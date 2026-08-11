import type { IntelligenceQuery, Signal, SignalDomain } from './types';
import { getRuntimeSources } from './source-registry';
import { normalizeBatch } from './normalizer';

export type AdapterResult = { source: string; signals: Signal[]; error?: string };

export async function collectRuntimeSources(query: IntelligenceQuery, fetcher: typeof fetch = fetch): Promise<AdapterResult[]> {
  const plans = getRuntimeSources(query.domains?.length ? query.domains : undefined);
  return Promise.all(plans.map(async (plan) => {
    try {
      const url = new URL(plan.endpoint, 'http://osiris.internal');
      url.searchParams.set('q', query.query.trim());
      const response = await fetcher(url.pathname + url.search, { headers: { accept: 'application/json' } });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const payload = await response.json();
      return { source: plan.id, signals: normalizeBatch(plan.domain as SignalDomain, plan.id, payload) };
    } catch (error) {
      return { source: plan.id, signals: [], error: error instanceof Error ? error.message : String(error) };
    }
  }));
}
