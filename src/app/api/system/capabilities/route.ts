import { NextResponse } from 'next/server';
import { getDatasetCatalog } from '@/lib/system/dataset-catalog';
import { getSystemComponents } from '@/lib/system/source-registry';

export const dynamic = 'force-dynamic';

export async function GET() {
  const catalog = getDatasetCatalog();
  return NextResponse.json({
    system: 'OSIRIS',
    generatedAt: new Date().toISOString(),
    principle: 'Evidence first; popularity is not evidence; unverified repositories are not runtime dependencies.',
    capabilities: catalog.map((item) => ({
      id: item.id,
      repository: item.repository,
      kind: item.kind,
      domains: item.domains,
      role: item.role,
      integration: item.integration,
      enabled: item.enabled,
      observedAt: item.observedAt,
    })),
    components: getSystemComponents(),
  });
}
