import { NextRequest, NextResponse } from 'next/server';
import type { IntelligenceQuery, SignalDomain } from '@/lib/system/types';
import { collectRuntimeSources } from '@/lib/system/adapter';
import { mergeSignals } from '@/lib/system/orchestrator';

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const query: IntelligenceQuery = {
    query: typeof body.query === 'string' ? body.query : '',
    domains: Array.isArray(body.domains) ? body.domains as SignalDomain[] : undefined,
    limit: typeof body.limit === 'number' ? body.limit : 50,
  };
  if (!query.query.trim()) return NextResponse.json({ error: 'query is required' }, { status: 400 });

  const results = await collectRuntimeSources(query, async (input, init) => {
    const url = new URL(input, request.nextUrl.origin);
    return fetch(url.toString(), { ...init, signal: AbortSignal.timeout(10000), cache: 'no-store' });
  });
  const response = mergeSignals(query, results.map(result => result.signals));
  return NextResponse.json({ ...response, adapterErrors: results.filter(r => r.error).map(r => ({ source: r.source, error: r.error })) });
}
