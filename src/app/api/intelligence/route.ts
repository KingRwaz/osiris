import { NextResponse } from "next/server";
import { SOURCE_CATALOG, buildAssessment, type EvidenceItem, type IntelligenceDomain } from "@/lib/osiris/intelligence";

const bootstrapEvidence: EvidenceItem[] = [
  {
    id: "usgs-bootstrap-001",
    title: "Seismic activity feed contract",
    domain: "seismic",
    kind: "official",
    source: "USGS Earthquake Hazards Program",
    observedAt: new Date().toISOString(),
    summary: "Bootstrap evidence contract for an official seismic source adapter.",
    confidence: 0.98,
    tags: ["earthquake", "real-time", "adapter"],
  },
  {
    id: "gdelt-bootstrap-001",
    title: "Global event reporting contract",
    domain: "news",
    kind: "open-dataset",
    source: "GDELT",
    observedAt: new Date().toISOString(),
    summary: "Bootstrap evidence contract for global event and media discovery signals.",
    confidence: 0.78,
    tags: ["events", "media", "discovery", "adapter"],
  },
];

function isDomain(value: string | null): value is IntelligenceDomain {
  return Boolean(value && SOURCE_CATALOG.some((source) => source.domain === value));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const requestedDomain = searchParams.get("domain");
  const domain = isDomain(requestedDomain) ? requestedDomain : undefined;

  const evidence = domain
    ? bootstrapEvidence.filter((item) => item.domain === domain)
    : bootstrapEvidence;

  // An assessment is only produced for evidence from one domain. This prevents
  // unrelated signals from being fused into a misleading cross-domain score.
  const assessmentEvidence = domain
    ? evidence
    : bootstrapEvidence.filter((item) => item.domain === "news");

  const assessment = buildAssessment(
    {
      id: "osiris-bootstrap-assessment",
      title: domain ? `${domain} intelligence bootstrap` : "OSIRIS news intelligence bootstrap",
      domain: domain ?? "news",
      summary: "Evidence-fusion endpoint is operational. Live source adapters can be attached without changing the assessment contract.",
      evidenceIds: assessmentEvidence.map((item) => item.id),
      caveats: ["Bootstrap evidence is illustrative; it is not a live operational intelligence finding."],
    },
    assessmentEvidence,
  );

  return NextResponse.json({
    system: "OSIRIS",
    version: "0.1-intelligence-core",
    generatedAt: new Date().toISOString(),
    assessment,
    evidence,
    sourceCatalog: SOURCE_CATALOG,
  });
}
