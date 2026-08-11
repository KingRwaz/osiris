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

/** Popularity is metadata, never evidence. Runtime dependencies require verification. */
export const DATASET_CATALOG: DatasetSource[] = [
  { id:'mineru', repository:'opendatalab/MinerU', kind:'document', domains:['documents','trade','agriculture','general'], role:'PDF/Office parsing into structured Markdown/JSON.', url:'https://github.com/opendatalab/MinerU', integration:'optional-runtime', enabled:true, observedAt:'2026-08-11' },
  { id:'mineru-document-explorer', repository:'opendatalab/MinerU-Document-Explorer', kind:'knowledge', domains:['documents','general'], role:'Agent-native document indexing and deep reading.', url:'https://github.com/opendatalab/MinerU-Document-Explorer', integration:'optional-runtime', enabled:true, observedAt:'2026-08-11' },
  { id:'pdf-inspector', repository:'firecrawl/pdf-inspector', kind:'document', domains:['documents'], role:'PDF classification and extraction routing.', url:'https://github.com/firecrawl/pdf-inspector', integration:'optional-runtime', enabled:true, observedAt:'2026-08-11' },
  { id:'mineru2ppt', repository:'JuniverseCoder/MinerU2PPT', kind:'document', domains:['documents','general'], role:'Editable PPTX reconstruction from parsed PDFs/images.', url:'https://github.com/JuniverseCoder/MinerU2PPT', integration:'optional-runtime', enabled:true, observedAt:'2026-08-11' },
  { id:'book-to-skill', repository:'virgiliojr94/book-to-skill', kind:'knowledge', domains:['documents','general'], role:'Transform technical books into executable agent-study skills.', url:'https://github.com/virgiliojr94/book-to-skill', integration:'reference', enabled:true, observedAt:'2026-08-11' },
  { id:'content-to-skill', repository:'kangarooking/cangjie-skill', kind:'knowledge', domains:['documents','general'], role:'Distill long-form books, video and podcasts into executable skills.', url:'https://github.com/kangarooking/cangjie-skill', integration:'reference', enabled:true, observedAt:'2026-08-11' },
  { id:'code-graph-rag', repository:'vitali87/code-graph-rag', kind:'code-intelligence', domains:['general'], role:'Graph retrieval for targeted codebase context.', url:'https://github.com/vitali87/code-graph-rag', integration:'optional-runtime', enabled:true, observedAt:'2026-08-11' },
  { id:'code-review-graph', repository:'tirth8205/code-review-graph', kind:'code-intelligence', domains:['general'], role:'Persistent code graph and context reduction for review workflows.', url:'https://github.com/tirth8205/code-review-graph', integration:'optional-runtime', enabled:true, observedAt:'2026-08-11' },
  { id:'codebase-memory-mcp', repository:'DeusData/codebase-memory-mcp', kind:'memory', domains:['general'], role:'Persistent code knowledge graph.', url:'https://github.com/DeusData/codebase-memory-mcp', integration:'optional-runtime', enabled:true, observedAt:'2026-08-11' },
  { id:'agent-memory', repository:'TencentCloud/TencentDB-Agent-Memory', kind:'memory', domains:['general','documents'], role:'Governed shared memory for conversations, skills, wiki and code graphs.', url:'https://github.com/TencentCloud/TencentDB-Agent-Memory', integration:'optional-runtime', enabled:true, observedAt:'2026-08-11' },
  { id:'memori', repository:'MemoriLabs/Memori', kind:'memory', domains:['general','documents'], role:'LLM-agnostic persistent agent memory.', url:'https://github.com/MemoriLabs/Memori', integration:'optional-runtime', enabled:true, observedAt:'2026-08-11' },
  { id:'omniroute', repository:'diegosouzapw/OmniRoute', kind:'agent-runtime', domains:['general','markets','trade'], role:'Provider/model gateway and quota-aware fallback routing.', url:'https://github.com/diegosouzapw/OmniRoute', integration:'optional-runtime', enabled:true, observedAt:'2026-08-11' },
  { id:'langchain', repository:'langchain-ai/langchain', kind:'agent-runtime', domains:['general','documents'], role:'Agent and tool orchestration primitives.', url:'https://github.com/langchain-ai/langchain', integration:'reference', enabled:true, observedAt:'2026-08-11' },
  { id:'llamaindex', repository:'run-llama/llama_index', kind:'knowledge', domains:['documents','general'], role:'Document agents, indexing and retrieval architecture.', url:'https://github.com/run-llama/llama_index', integration:'reference', enabled:true, observedAt:'2026-08-11' },
  { id:'paperclip', repository:'paperclipai/paperclip', kind:'agent-runtime', domains:['general'], role:'Agent workforce management and coordination reference.', url:'https://github.com/paperclipai/paperclip', integration:'reference', enabled:true, observedAt:'2026-08-11' },
  { id:'orca', repository:'stablyai/orca', kind:'agent-runtime', domains:['general'], role:'Parallel coding-agent fleet execution reference.', url:'https://github.com/stablyai/orca', integration:'reference', enabled:true, observedAt:'2026-08-11' },
  { id:'loopx', repository:'huangruiteng/loopx', kind:'agent-runtime', domains:['general'], role:'Long-running agent state, evidence logs, quotas and handoffs.', url:'https://github.com/huangruiteng/loopx', integration:'reference', enabled:true, observedAt:'2026-08-11' },
  { id:'swarm-forge', repository:'unclebob/swarm-forge', kind:'agent-runtime', domains:['general'], role:'Multi-agent coordination reference.', url:'https://github.com/unclebob/swarm-forge', integration:'reference', enabled:true, observedAt:'2026-08-11' },
  { id:'pi', repository:'earendil-works/pi', kind:'agent-runtime', domains:['general'], role:'Unified LLM API, agent loop, TUI and coding-agent runtime reference.', url:'https://github.com/earendil-works/pi', integration:'reference', enabled:true, observedAt:'2026-08-11' },
  { id:'pi-web', repository:'agegr/pi-web', kind:'agent-runtime', domains:['general'], role:'Web interface pattern for coding-agent runtime.', url:'https://github.com/agegr/pi-web', integration:'reference', enabled:true, observedAt:'2026-08-11' },
  { id:'t3code', repository:'pingdotgg/t3code', kind:'agent-runtime', domains:['general'], role:'Coding-agent interface and workflow reference.', url:'https://github.com/pingdotgg/t3code', integration:'reference', enabled:true, observedAt:'2026-08-11' },
  { id:'nanobot', repository:'HKUDS/nanobot', kind:'agent-runtime', domains:['general'], role:'Self-hosted personal agent architecture with tools, memory, MCP and automation.', url:'https://github.com/HKUDS/nanobot', integration:'reference', enabled:true, observedAt:'2026-08-11' },
  { id:'worldmonitor', repository:'koala73/worldmonitor', kind:'live', domains:['geopolitics','infrastructure','general'], role:'Real-time global intelligence monitoring pattern.', url:'https://github.com/koala73/worldmonitor', integration:'reference', enabled:true, observedAt:'2026-08-11' },
  { id:'agent-reach', repository:'Panniantong/Agent-Reach', kind:'live', domains:['general','geopolitics','markets'], role:'Multi-platform web research retrieval pattern.', url:'https://github.com/Panniantong/Agent-Reach', integration:'optional-runtime', enabled:true, observedAt:'2026-08-11' },
  { id:'semantica', repository:'semantica-agi/semantica', kind:'knowledge', domains:['general','documents'], role:'Graph-native context and accountability architecture reference.', url:'https://github.com/semantica-agi/semantica', integration:'reference', enabled:true, observedAt:'2026-08-11' },
  { id:'hallmark', repository:'Nutlope/hallmark', kind:'knowledge', domains:['general'], role:'Quality gate for anti-slop, evidence-oriented interface generation.', url:'https://github.com/Nutlope/hallmark', integration:'reference', enabled:true, observedAt:'2026-08-11' },
  { id:'diagram-design', repository:'cathrynlavery/diagram-design', kind:'visual', domains:['general'], role:'Editorial intelligence diagrams for system explanations.', url:'https://github.com/cathrynlavery/diagram-design', integration:'reference', enabled:true, observedAt:'2026-08-11' },
  { id:'archify', repository:'tt-a1i/archify', kind:'visual', domains:['general'], role:'Verifiable architecture, workflow, sequence, data-flow and lifecycle diagrams.', url:'https://github.com/tt-a1i/archify', integration:'reference', enabled:true, observedAt:'2026-08-11' },
  { id:'openbb', repository:'OpenBB-finance/OpenBB', kind:'market', domains:['markets','trade'], role:'Financial data and analyst/quant integration layer.', url:'https://github.com/OpenBB-finance/OpenBB', integration:'optional-runtime', enabled:true, observedAt:'2026-08-11' },
  { id:'daily-stock-analysis', repository:'ZhuLinsen/daily_stock_analysis', kind:'market', domains:['markets'], role:'Reference architecture for multi-market analysis and scheduled runs.', url:'https://github.com/ZhuLinsen/daily_stock_analysis', integration:'reference', enabled:true, observedAt:'2026-08-11' },
  { id:'qdrant', repository:'qdrant/qdrant', kind:'knowledge', domains:['documents','general'], role:'Vector retrieval backend candidate.', url:'https://github.com/qdrant/qdrant', integration:'optional-runtime', enabled:true, observedAt:'2026-08-11' },
  { id:'chroma', repository:'chroma-core/chroma', kind:'knowledge', domains:['documents','general'], role:'Embedded/local vector search alternative.', url:'https://github.com/chroma-core/chroma', integration:'optional-runtime', enabled:true, observedAt:'2026-08-11' },
  { id:'transformers', repository:'huggingface/transformers', kind:'agent-runtime', domains:['documents','general'], role:'Open model inference/training foundation across text, vision, audio and multimodal workloads.', url:'https://github.com/huggingface/transformers', integration:'reference', enabled:true, observedAt:'2026-08-11' },
  { id:'speech-to-speech', repository:'huggingface/speech-to-speech', kind:'agent-runtime', domains:['general'], role:'Local speech-to-speech agent capability reference.', url:'https://github.com/huggingface/speech-to-speech', integration:'optional-runtime', enabled:true, observedAt:'2026-08-11' },
  { id:'comfyui', repository:'Comfy-Org/ComfyUI', kind:'visual', domains:['general'], role:'Modular visual generation backend candidate.', url:'https://github.com/Comfy-Org/ComfyUI', integration:'optional-runtime', enabled:true, observedAt:'2026-08-11' },
  { id:'openmontage', repository:'calesthio/OpenMontage', kind:'visual', domains:['general'], role:'Agentic video production pipeline reference.', url:'https://github.com/calesthio/OpenMontage', integration:'reference', enabled:true, observedAt:'2026-08-11' },
  { id:'opencut', repository:'OpenCut-app/OpenCut', kind:'visual', domains:['general'], role:'Open video-editing pipeline reference.', url:'https://github.com/OpenCut-app/OpenCut', integration:'reference', enabled:true, observedAt:'2026-08-11' },
  { id:'officecli', repository:'iOfficeAI/OfficeCLI', kind:'document', domains:['documents','trade','agriculture','general'], role:'Agent-native Word/Excel/PowerPoint automation reference.', url:'https://github.com/iOfficeAI/OfficeCLI', integration:'optional-runtime', enabled:true, observedAt:'2026-08-11' },
  // Security capability is deliberately non-autonomous and authorization-gated.
  { id:'reverse-skill', repository:'zhaoxuya520/reverse-skill', kind:'security', domains:['cyber','general'], role:'Authorized security-research skill-routing reference; never enabled as an autonomous offensive toolchain.', url:'https://github.com/zhaoxuya520/reverse-skill', integration:'reference', enabled:false, observedAt:'2026-08-11' },
];

export function getDatasetCatalog(options?: { enabledOnly?: boolean; domain?: SignalDomain }) {
  return DATASET_CATALOG.filter((source) => {
    if (options?.enabledOnly && !source.enabled) return false;
    if (options?.domain && !source.domains.includes(options.domain)) return false;
    return true;
  });
}
