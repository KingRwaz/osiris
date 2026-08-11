import type { SignalDomain, SystemComponent } from './types';
import { getDatasetCatalog } from './dataset-catalog';

export type RuntimeSource = {
  id: string;
  name: string;
  domain: SignalDomain;
  endpoint: string;
  kind: 'internal-api' | 'external-adapter';
  enabled: boolean;
  priority: number;
};

export const RUNTIME_SOURCES: RuntimeSource[] = [
  { id:'news', name:'RSS geopolitical news', domain:'geopolitics', endpoint:'/api/news', kind:'internal-api', enabled:true, priority:100 },
  { id:'live-news', name:'Live news', domain:'general', endpoint:'/api/live-news', kind:'internal-api', enabled:true, priority:90 },
  { id:'markets', name:'Financial markets', domain:'markets', endpoint:'/api/markets', kind:'internal-api', enabled:true, priority:100 },
  { id:'gdelt', name:'GDELT event/news data', domain:'trade', endpoint:'/api/gdelt', kind:'internal-api', enabled:true, priority:90 },
  { id:'infrastructure', name:'Infrastructure monitoring', domain:'infrastructure', endpoint:'/api/infrastructure', kind:'internal-api', enabled:true, priority:80 },
  { id:'maritime', name:'Maritime intelligence', domain:'maritime', endpoint:'/api/maritime', kind:'internal-api', enabled:true, priority:80 },
  { id:'flights', name:'Aviation intelligence', domain:'aviation', endpoint:'/api/flights', kind:'internal-api', enabled:true, priority:80 },
  { id:'cyber', name:'Cyber threat intelligence', domain:'cyber', endpoint:'/api/cyber-threats', kind:'internal-api', enabled:true, priority:80 },
  { id:'air-quality', name:'Weather/environment', domain:'weather', endpoint:'/api/air-quality', kind:'internal-api', enabled:true, priority:70 },
];

export function getRuntimeSources(domains?: SignalDomain[]) {
  return RUNTIME_SOURCES.filter((source) => source.enabled && (!domains?.length || domains.includes(source.domain)));
}

export function getSystemComponents(): SystemComponent[] {
  return [
    { id:'orchestrator', name:'Query Orchestrator', role:'Plans domain fan-out and evidence merge.', kind:'core', enabled:true },
    { id:'provenance', name:'Evidence/Provenance Layer', role:'Preserves source, timestamps and confidence boundaries.', kind:'core', enabled:true },
    { id:'runtime-sources', name:'Runtime Source Adapters', role:'Normalizes existing OSIRIS live APIs.', kind:'adapter', enabled:true },
    ...getDatasetCatalog({ enabledOnly:true }).map((source) => ({
      id:`dataset:${source.id}`,
      name:source.repository,
      role:source.role,
      kind:(source.kind === 'memory' || source.kind === 'knowledge' ? 'data' : source.kind === 'agent-runtime' ? 'execution' : 'adapter') as SystemComponent['kind'],
      enabled:source.enabled,
    })),
  ];
}
