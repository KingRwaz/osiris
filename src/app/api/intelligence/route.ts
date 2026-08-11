import { NextResponse } from "next/server";
import { SOURCE_CATALOG, buildAssessment, type EvidenceItem, type IntelligenceDomain } from "@/lib/osiris/intelligence";

const demoEvidence: EvidenceItem[] = [
  {
    id: "usgs-demo-001",
    title: "Seismic activity feed",
    domain: "seismic",
    kind: "official",
    source: "USGS Earthquake Hazards Program",
    observedAt: new Date().toISOString(),
    summary: "Structured seismic evidence supplied by an official earthquake monitoring source.",
    confidence: 0.98,
    tags: ["earthquake", "real-time"],
  },
  {
    id: "gdelt-demo-001",
    title: "Global event reporting",
    domain: "news",
    kind: "open-dataset",
    source: "GDELT",
    observedAt: new Date().toISOString(),
    summary: "Machine-readable global event and media signals for corroboration and discovery.",
    confidence: 0.78,
    tags: ["events", "media", "discovery"],
  },
];

function isDomain(value: string | null): value is IntelligenceDomain {
  return Boolean(value && SOURCE_CATALOG.some((source) => source.domain === value));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const domain = searchParams.get("domain");

  const evidence = domain && isDomain(domain)
    ? demoEvidence.filter((item) => item.domain === domain)
    : demoEvidence;

  const assessment = buildAssessment(
    {
      id: "osiris-bootstrap-assessment",
      title: domain ? `${domain} intelligence bootstrap` : "OSIRIS intelligence bootstrap",
      domain: (domain && isDomain(domain) ? domain : "news"),
      summary: "Evidence-fusion endpoint is operational. Live source adapters can be attached without changing the assessment contract.",
      evidenceIds: evidence.map((item) => item.id),
      caveats: ["Bootstrap evidence is illustrative; it is not a live operational intelligence finding."],
    },
    evidence,
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
