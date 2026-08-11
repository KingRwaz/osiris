import type { Signal, SignalDomain } from './types';

const ARRAY_KEYS = ['signals','news','articles','items','results','data','events','threats','flights','ships','infrastructure','markets'];
const text = (item: Record<string, unknown>, keys: string[]) => keys.map(k => item[k]).find(v => typeof v === 'string' && v.trim()) as string | undefined;

export function normalizeBatch(domain: SignalDomain, source: string, payload: unknown): Signal[] {
  const root = payload && typeof payload === 'object' ? payload as Record<string, unknown> : {};
  let items: unknown[] = [];
  for (const key of ARRAY_KEYS) if (Array.isArray(root[key])) { items = root[key]; break; }
  if (!items.length && Array.isArray(payload)) items = payload;

  return items.slice(0, 200).map((raw, index) => {
    const item = raw && typeof raw === 'object' ? raw as Record<string, unknown> : {};
    const title = text(item, ['title','name','headline','symbol','label']) || `${source} signal ${index + 1}`;
    const summary = text(item, ['summary','description','text','content','message']) || JSON.stringify(item).slice(0, 500);
    const confidenceRaw = Number(item.confidence ?? item.confidence_score ?? 0.6);
    return {
      id: `${source}:${domain}:${index}`,
      domain,
      title,
      summary,
      source,
      url: text(item, ['url','link','href']),
      publishedAt: text(item, ['publishedAt','published','pubDate','timestamp','time']),
      observedAt: new Date().toISOString(),
      confidence: Number.isFinite(confidenceRaw) ? Math.max(0, Math.min(1, confidenceRaw)) : 0.6,
      tags: [domain, source],
      entities: [],
    } satisfies Signal;
  });
}
