<div align="center">

# ⬡ AURELIS

### Adaptive Unified Reasoning, Evidence, Research, Intelligence & Strategic Execution System

**AURELIS is the primary system identity. OSIRIS is its first-generation intelligence and OSINT subsystem.**

</div>

## Foundation

AURELIS is being developed as a private, owner-controlled intelligence and strategic-execution platform. Its purpose is to combine evidence ingestion, knowledge, reasoning, intelligence, situational awareness and execution into one auditable system.

The current `KingRwaz/osiris` repository is a fork of `simplifaisoul/osiris`. It remains a staging/reference source while the AURELIS architecture is separated from fork identity and provenance is preserved.

## OSIRIS inside AURELIS

OSIRIS supplies the first-generation situational-awareness layer, including geospatial visualization, live intelligence feeds, aviation, maritime, seismic, fire, weather and space monitoring, news aggregation, OSINT interfaces and vulnerability intelligence presentation.

The existing implementation uses Next.js 16, TypeScript, React, MapLibre GL, Framer Motion and related web infrastructure. See `docs/AURELIS_FOUNDATION.md` for the integration boundary.

## AURELIS architecture

```text
                         AURELIS
                            |
       +--------------------+--------------------+
       |                    |                    |
    Evidence            Knowledge             Governance
       |                    |                    |
  APIs / Files       Memory / Graph        Identity / Audit
       +--------------------+--------------------+
                            |
                       Reasoning Core
                            |
              +-------------+-------------+
              |                           |
        Intelligence                 Verification
              |                           |
          OSIRIS                    Evidence QA
              +-------------+-------------+
                            |
                    Strategic Execution
                            |
               Plans / Tasks / Decisions
                            |
                     Operator UI
```

## Design principles

- Evidence before assertion.
- Provenance is retained for imported components and data.
- OSIRIS capabilities are modularized rather than treated as the system identity.
- Intelligence outputs remain distinguishable from verified facts and hypotheses.
- Sensitive configuration and credentials remain outside source control.
- The architecture is designed for modular agent, memory, retrieval and analytics integrations.

## Migration status

The `aurelis-foundation` branch is the controlled staging point for the transition from the fork-derived OSIRIS application to the AURELIS system architecture.

The intended destination is a new private `KingRwaz` repository dedicated to AURELIS. The connected GitHub tooling currently available in this session does not expose repository-creation or visibility-change operations, so the private destination has **not** been falsely represented as created.

Once the destination repository exists, this branch can be migrated into it while retaining OSIRIS under an explicit subsystem boundary and preserving upstream attribution and licensing.
