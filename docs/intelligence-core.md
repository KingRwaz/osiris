# OSIRIS Intelligence Core

The intelligence core is the trust layer for OSIRIS. It separates raw observations from assessments and preserves provenance, source type, confidence, and caveats.

## Pipeline

```text
source adapter
    -> normalized EvidenceItem
    -> domain filter
    -> evidence weighting
    -> corroboration / fusion
    -> confidence classification
    -> IntelligenceAssessment
    -> UI / API / downstream agents
```

## Design rules

1. Raw evidence is never silently converted into fact.
2. Every assessment carries evidence IDs and caveats.
3. Source type affects confidence; an unverified report cannot carry the same weight as an official or primary source.
4. Independent corroboration increases confidence using a bounded complement model.
5. Evidence from unrelated domains is not fused into one assessment.
6. Live adapters can be added behind the existing contract without changing consumers.
7. The bootstrap endpoint intentionally contains illustrative evidence only; it is not a live intelligence finding.

## Initial source registry

The registry establishes adapter policy for USGS, NASA FIRMS, NOAA SWPC, OpenSky, NVD, GDELT, FAOSTAT and World Bank Open Data. Refresh intervals are policy metadata and should be adjusted against the source's documented limits and operational requirements.

## API

`GET /api/intelligence`

Returns the current assessment contract, evidence objects and canonical source catalog.

`GET /api/intelligence?domain=seismic`

Returns a domain-scoped assessment. Unsupported domains are treated as an unfiltered bootstrap request rather than being guessed.
