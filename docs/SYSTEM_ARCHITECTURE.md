# OSIRIS Intelligence Platform

OSIRIS is the command and integration surface for a modular private intelligence and decision-support system.

## Initial architecture

```text
Command Surface
      |
      v
Intelligence API
      |
      v
Domain Orchestrator
  |       |       |
 News   Markets  Trade
  |       |       |
  +-------+-------+
          |
          v
 Signal / Evidence Model
          |
          v
 Knowledge + Memory Layer
          |
          v
 Decision Support
          |
          v
 Workflow / Enterprise Execution
          |
          v
 Observability
```

## Integration principles

1. OSIRIS owns the command surface and canonical signal contract.
2. External repositories are integrated as adapters, not copied wholesale into the core.
3. Every signal should retain source, observation time, confidence and domain metadata.
4. Providers can be replaced without changing the UI or decision layer.
5. AI reasoning is downstream of evidence collection; it must not silently manufacture source data.
6. Sensitive or security-oriented capabilities remain isolated and defensive by default.
7. The system is modular: OpenViking, Memori, Qdrant, MinerU, OpenBB, n8n, ERPNext and Grafana can be connected incrementally.

## Current implementation

- `/api/system` exposes the system registry and now executes live multi-domain intelligence queries.
- `src/lib/system/types.ts` defines the canonical signal and query contracts.
- `src/lib/system/config.ts` defines enabled platform components.
- `src/lib/system/orchestrator.ts` plans domains, calls existing OSIRIS data endpoints in parallel, and merges results.
- `src/lib/system/normalize.ts` converts heterogeneous endpoint payloads into the canonical `Signal` contract without assuming a single provider schema.
- `/api/investigate` exposes the evidence-first investigation engine.
- `src/lib/osiris/core/types.ts` defines evidence, entity, assessment and investigation contracts.
- `src/lib/osiris/core/store.ts` provides the bounded in-process evidence store used by the first investigation-engine implementation.
- `src/lib/osiris/core/engine.ts` ranks evidence using source authority, confidence, freshness and query relevance, then produces a confidence-banded assessment.

## Implementation sequence

1. Live endpoint integration and canonical signal normalization — implemented in this development increment.
2. Evidence-first investigation API and bounded evidence store — implemented as the initial reasoning boundary.
3. Persistent event/evidence storage with provenance and deduplication.
4. Document ingestion through MinerU.
5. Vector/knowledge retrieval through Qdrant/OpenViking.
6. Financial research adapters through OpenBB.
7. Workflow execution through n8n.
8. Observability, provenance validation and source-health monitoring.
9. Agent reasoning only after the evidence layer is operational and auditable.
