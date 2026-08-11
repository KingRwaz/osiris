export type IntelligenceDomain =
  | "geopolitics"
  | "conflict"
  | "markets"
  | "agriculture"
  | "infrastructure"
  | "weather"
  | "seismic"
  | "aviation"
  | "maritime"
  | "cyber"
  | "space"
  | "public-health"
  | "trade"
  | "news";

export type EvidenceKind = "primary" | "official" | "reputable-media" | "open-dataset" | "derived" | "unverified";

export interface EvidenceItem {
  id: string;
  title: string;
  domain: IntelligenceDomain;
  kind: EvidenceKind;
  source: string;
  observedAt: string;
  url?: string;
  summary: string;
  confidence: number;
  tags: string[];
}

export interface IntelligenceAssessment {
  id: string;
  title: string;
  domain: IntelligenceDomain;
  summary: string;
  confidence: number;
  status: "confirmed" | "probable" | "developing" | "unconfirmed";
  evidenceIds: string[];
  caveats: string[];
  generatedAt: string;
}

const KIND_WEIGHT: Record<EvidenceKind, number> = {
  primary: 1,
  official: 0.95,
  "reputable-media": 0.8,
  "open-dataset": 0.75,
  derived: 0.6,
  unverified: 0.25,
};

export function normalizeConfidence(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

export function scoreEvidence(item: EvidenceItem): number {
  return normalizeConfidence(item.confidence) * KIND_WEIGHT[item.kind];
}

export function fuseEvidence(items: EvidenceItem[]): number {
  if (items.length === 0) return 0;
  const weighted = items.map(scoreEvidence);
  // Independent corroboration raises confidence, while preventing scores from reaching 1 too easily.
  const complement = weighted.reduce((product, score) => product * (1 - score), 1);
  return normalizeConfidence(1 - complement);
}

export function classifyConfidence(confidence: number): IntelligenceAssessment["status"] {
  if (confidence >= 0.9) return "confirmed";
  if (confidence >= 0.7) return "probable";
  if (confidence >= 0.45) return "developing";
  return "unconfirmed";
}

export function buildAssessment(
  input: Omit<IntelligenceAssessment, "confidence" | "status" | "generatedAt">,
  evidence: EvidenceItem[],
): IntelligenceAssessment {
  const relevant = evidence.filter((item) => input.evidenceIds.includes(item.id));
  const confidence = fuseEvidence(relevant);
  const caveats = [...input.caveats];

  if (relevant.length < 2) caveats.push("Assessment has limited independent corroboration.");
  if (relevant.some((item) => item.kind === "unverified")) caveats.push("At least one evidence item is unverified and should not be treated as established fact.");

  return {
    ...input,
    confidence,
    status: classifyConfidence(confidence),
    caveats: [...new Set(caveats)],
    generatedAt: new Date().toISOString(),
  };
}

export const SOURCE_CATALOG = [
  { name: "USGS Earthquake Hazards Program", domain: "seismic" as const, type: "official" },
  { name: "NASA FIRMS", domain: "weather" as const, type: "official" },
  { name: "NASA EONET", domain: "weather" as const, type: "official" },
  { name: "NOAA SWPC", domain: "space" as const, type: "official" },
  { name: "OpenSky Network", domain: "aviation" as const, type: "open-dataset" },
  { name: "NVD", domain: "cyber" as const, type: "official" },
  { name: "GDELT", domain: "news" as const, type: "open-dataset" },
  { name: "World Bank Open Data", domain: "trade" as const, type: "open-dataset" },
  { name: "FAOSTAT", domain: "agriculture" as const, type: "open-dataset" },
] as const;
