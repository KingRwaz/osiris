import { NextRequest, NextResponse } from 'next/server';
import type { IntelligenceQuery, SignalDomain } from '@/lib/system/types';
import { getRuntimeSources } from '@/lib/system/source-registry';
import { normalizeBatch } from '@/lib/system/normalizer';
import { mergeSignals } from '@/lib/system/orchestrator';

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const query: IntelligenceQuery = {
    query: typeof body.query === 'string' ? body.query : '',
    domains: Array.isArray(body.domains) ? body.domains as SignalDomain[] : undefined,
    limit: typeof body.limit === 'number' ? body.limit : 50,
  };
  if (!query.query.trim()) return NextResponse.json({ error: 'query is required' }, { status: 400 });

  const sources = getRuntimeSources(query.domains).sort((a, b) => b.priority - a.priority);
  const base = request.nextUrl.origin;
  const batches = await Promise.all(sources.map(async source => {
    try {
      const response = await fetch(`${base}${source.endpoint}?q=${encodeURIComponent(query.query)}`, { signal: AbortSignal.timeout(10000), cache: 'no-store' });
      if (!response.ok) return [];
      return normalizeBatch(source.domain, source.id, await response.json());
    } catch { return []; }
  }));

  return NextResponse.json(mergeSignals(query, batches));
}
