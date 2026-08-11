export type IntelligenceDomain =
  | "geopolitics"
  | "markets"
  | "trade"
  | "agriculture"
  | "infrastructure"
  | "maritime"
  | "aviation"
  | "cyber"
  | "weather"
  | "documents"
  | "general";

export type Source = {
  id: string;
  name: string;
  url?: string;
  authority: number;
  independenceGroup?: string;
};

export type Evidence = {
  id: string;
  title: string;
  summary: string;
  source: Source;
  observedAt: string;
  publishedAt?: string;
  freshnessHalfLifeHours: number;
  confidence: number;
  tags: string[];
  entityIds: string[];
  contentHash: string;
  ingestedAt: string;
};

export type Entity = {
  id: string;
  canonicalName: string;
  aliases: string[];
  type: string;
  firstSeenAt: string;
  lastSeenAt: string;
  attributes?: Record<string, string | number | boolean | null>;
};

export type IntelligenceQuery = {
  question: string;
  domain?: IntelligenceDomain;
  entity?: string;
  limit?: number;
};

export type Assessment = {
  id: string;
  createdAt: string;
  query: string;
  domain?: IntelligenceDomain;
  claim: string;
  evidenceIds: string[];
  corroboratingSourceCount: number;
  contradictionCount: number;
  confidence: number;
  band: "low" | "moderate" | "high" | "very-high";
  rationale: string;
  caveats: string[];
};

export type Investigation = {
  id: string;
  createdAt: string;
  updatedAt: string;
  question: string;
  status: "complete" | "partial";
  domain?: IntelligenceDomain;
  evidenceIds: string[];
  assessmentIds: string[];
};

export type IntelligenceResult = {
  investigation: Investigation;
  assessments: Assessment[];
  evidence: Evidence[];
  entities: Entity[];
  generatedAt: string;
};

export function confidenceBand(value: number): Assessment["band"] {
  if (value >= 0.85) return "very-high";
  if (value >= 0.70) return "high";
  if (value >= 0.45) return "moderate";
  return "low";
}
