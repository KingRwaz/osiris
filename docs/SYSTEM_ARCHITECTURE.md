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

- `/api/system` exposes the system registry and accepts normalized intelligence queries.
- `src/lib/system/types.ts` defines the canonical signal and query contracts.
- `src/lib/system/config.ts` defines enabled platform components.
- `src/lib/system/orchestrator.ts` maps intelligence domains to existing OSIRIS data endpoints.

## Next implementation sequence

1. Connect the orchestrator to the existing OSIRIS data endpoints.
2. Normalize each endpoint into the canonical `Signal` contract.
3. Add persistent event storage.
4. Add document ingestion through MinerU.
5. Add vector/knowledge retrieval through Qdrant/OpenViking.
6. Add financial research adapters through OpenBB.
7. Add workflow execution through n8n.
8. Add observability and provenance checks.
9. Add agent reasoning only after the evidence layer is operational.
