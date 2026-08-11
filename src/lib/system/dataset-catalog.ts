import type { SignalDomain } from './types';

export type DatasetKind = 'live' | 'document' | 'code-intelligence' | 'memory' | 'agent-runtime' | 'market' | 'visual' | 'security' | 'knowledge';

export type DatasetSource = {
  id: string;
  repository: string;
  kind: DatasetKind;
  domains: SignalDomain[];
  role: string;
  url: string;
  integration: 'adapter' | 'reference' | 'optional-runtime';
  enabled: boolean;
  observedAt: string;
};

/** Metadata only. Popularity is never treated as evidence. Runtime truth must come from source adapters. */
export const DATASET_CATALOG: DatasetSource[] = [
  { id:'mineru', repository:'opendatalab/MinerU', kind:'document', domains:['documents','trade','agriculture','general'], role:'PDF/Office parsing into structured Markdown/JSON.', url:'https://github.com/opendatalab/MinerU', integration:'optional-runtime', enabled:true, observedAt:'2026-08-11' },
  { id:'mineru-document-explorer', repository:'opendatalab/MinerU-Document-Explorer', kind:'knowledge', domains:['documents','general'], role:'Agent-native document indexing and deep reading.', url:'https://github.com/opendatalab/MinerU-Document-Explorer', integration:'optional-runtime', enabled:true, observedAt:'2026-08-11' },
  { id:'pdf-inspector', repository:'firecrawl/pdf-inspector', kind:'document', domains:['documents'], role:'PDF classification and extraction routing.', url:'https://github.com/firecrawl/pdf-inspector', integration:'optional-runtime', enabled:true, observedAt:'2026-08-11' },
  { id:'code-graph-rag', repository:'vitali87/code-graph-rag', kind:'code-intelligence', domains:['general'], role:'Graph retrieval for targeted codebase context.', url:'https://github.com/vitali87/code-graph-rag', integration:'optional-runtime', enabled:true, observedAt:'2026-08-11' },
  { id:'code-review-graph', repository:'tirth8205/code-review-graph', kind:'code-intelligence', domains:['general'], role:'Persistent code graph and context reduction.', url:'https://github.com/tirth8205/code-review-graph', integration:'optional-runtime', enabled:true, observedAt:'2026-08-11' },
  { id:'codebase-memory-mcp', repository:'DeusData/codebase-memory-mcp', kind:'memory', domains:['general'], role:'Persistent code knowledge graph.', url:'https://github.com/DeusData/codebase-memory-mcp', integration:'optional-runtime', enabled:true, observedAt:'2026-08-11' },
  { id:'agent-memory', repository:'TencentCloud/TencentDB-Agent-Memory', kind:'memory', domains:['general','documents'], role:'Governed shared memory for conversations, skills, wiki and code graphs.', url:'https://github.com/TencentCloud/TencentDB-Agent-Memory', integration:'optional-runtime', enabled:true, observedAt:'2026-08-11' },
  { id:'memori', repository:'MemoriLabs/Memori', kind:'memory', domains:['general','documents'], role:'LLM-agnostic persistent agent memory.', url:'https://github.com/MemoriLabs/Memori', integration:'optional-runtime', enabled:true, observedAt:'2026-08-11' },
  { id:'omniroute', repository:'diegosouzapw/OmniRoute', kind:'agent-runtime', domains:['general','markets','trade'], role:'Provider/model gateway and fallback routing.', url:'https://github.com/diegosouzapw/OmniRoute', integration:'optional-runtime', enabled:true, observedAt:'2026-08-11' },
  { id:'langchain', repository:'langchain-ai/langchain', kind:'agent-runtime', domains:['general','documents'], role:'Agent and tool orchestration primitives.', url:'https://github.com/langchain-ai/langchain', integration:'reference', enabled:true, observedAt:'2026-08-11' },
  { id:'llamaindex', repository:'run-llama/llama_index', kind:'knowledge', domains:['documents','general'], role:'Document agents, indexing and retrieval architecture.', url:'https://github.com/run-llama/llama_index', integration:'reference', enabled:true, observedAt:'2026-08-11' },
  { id:'qdrant', repository:'qdrant/qdrant', kind:'knowledge', domains:['documents','general'], role:'Vector retrieval backend candidate.', url:'https://github.com/qdrant/qdrant', integration:'optional-runtime', enabled:true, observedAt:'2026-08-11' },
  { id:'chroma', repository:'chroma-core/chroma', kind:'knowledge', domains:['documents','general'], role:'Embedded/local vector search alternative.', url:'https://github.com/chroma-core/chroma', integration:'optional-runtime', enabled:true, observedAt:'2026-08-11' },
  { id:'openbb', repository:'OpenBB-finance/OpenBB', kind:'market', domains:['markets','trade'], role:'Financial data and analyst/quant integration layer.', url:'https://github.com/OpenBB-finance/OpenBB', integration:'optional-runtime', enabled:true, observedAt:'2026-08-11' },
  { id:'daily-stock-analysis', repository:'ZhuLinsen/daily_stock_analysis', kind:'market', domains:['markets'], role:'Reference architecture for multi-market analysis and scheduled runs.', url:'https://github.com/ZhuLinsen/daily_stock_analysis', integration:'reference', enabled:true, observedAt:'2026-08-11' },
  { id:'worldmonitor', repository:'koala73/worldmonitor', kind:'live', domains:['geopolitics','infrastructure','general'], role:'Real-time global intelligence monitoring pattern.', url:'https://github.com/koala73/worldmonitor', integration:'reference', enabled:true, observedAt:'2026-08-11' },
  { id:'agent-reach', repository:'Panniantong/Agent-Reach', kind:'live', domains:['general','geopolitics','markets'], role:'Multi-platform web research retrieval pattern.', url:'https://github.com/Panniantong/Agent-Reach', integration:'optional-runtime', enabled:true, observedAt:'2026-08-11' },
  { id:'swarm-forge', repository:'unclebob/swarm-forge', kind:'agent-runtime', domains:['general'], role:'Multi-agent coordination reference.', url:'https://github.com/unclebob/swarm-forge', integration:'reference', enabled:true, observedAt:'2026-08-11' },
  { id:'loopx', repository:'huangruiteng/loopx', kind:'agent-runtime', domains:['general'], role:'Long-running agent state, evidence logs and handoffs.', url:'https://github.com/huangruiteng/loopx', integration:'reference', enabled:true, observedAt:'2026-08-11' },
  { id:'computer-use', repository:'cloudflare/computer', kind:'agent-runtime', domains:['general'], role:'Computer-use execution capability.', url:'https://github.com/cloudflare/computer', integration:'optional-runtime', enabled:true, observedAt:'2026-08-11' },
  { id:'anthropic-skills', repository:'anthropics/skills', kind:'knowledge', domains:['general','documents'], role:'Production agent skill reference set.', url:'https://github.com/anthropics/skills', integration:'reference', enabled:true, observedAt:'2026-08-11' },
  { id:'google-skills', repository:'google/skills', kind:'knowledge', domains:['general','documents'], role:'Google-oriented agent skill reference set.', url:'https://github.com/google/skills', integration:'reference', enabled:true, observedAt:'2026-08-11' },
  { id:'openmontage', repository:'calesthio/OpenMontage', kind:'visual', domains:['general'], role:'Agentic video production pipeline reference.', url:'https://github.com/calesthio/OpenMontage', integration:'reference', enabled:true, observedAt:'2026-08-11' },
  { id:'comfyui', repository:'Comfy-Org/ComfyUI', kind:'visual', domains:['general'], role:'Modular visual generation backend candidate.', url:'https://github.com/Comfy-Org/ComfyUI', integration:'optional-runtime', enabled:true, observedAt:'2026-08-11' },
];

export function getDatasetCatalog(options?: { enabledOnly?: boolean; domain?: SignalDomain }) {
  return DATASET_CATALOG.filter((source) => {
    if (options?.enabledOnly && !source.enabled) return false;
    if (options?.domain && !source.domains.includes(options.domain)) return false;
    return true;
  });
}
