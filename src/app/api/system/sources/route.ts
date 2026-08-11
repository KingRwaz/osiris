import { NextResponse } from 'next/server';
import { getDatasetCatalog } from '@/lib/system/dataset-catalog';
import { getRuntimeSources, getSystemComponents } from '@/lib/system/source-registry';

export async function GET() {
  return NextResponse.json({
    generatedAt: new Date().toISOString(),
    runtimeSources: getRuntimeSources(),
    datasets: getDatasetCatalog({ enabledOnly: true }),
    components: getSystemComponents(),
  }, { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' } });
}
