export type IntelligenceDomain = "geopolitical" | "financial" | "trade" | "agriculture" | "infrastructure" | "cyber" | "environment" | "aviation" | "maritime" | "space" | "social" | "general";
export type EvidenceKind = "observation" | "report" | "dataset" | "document" | "event" | "signal";
export type ConfidenceBand = "very_low" | "low" | "moderate" | "high" | "very_high";
export interface SourceRef { id: string; name: string; uri?: string; authority: number; independenceGroup?: string; }
export interface Evidence { id: string; observedAt: string; ingestedAt: string; source: SourceRef; kind: EvidenceKind; domain: IntelligenceDomain; title: string; summary: string; entityIds: string[]; tags: string[]; confidence: number; freshnessHalfLifeHours: number; contentHash: string; metadata?: Record<string, unknown>; }
export interface Entity { id: string; canonicalName: string; type: string; aliases: string[]; domains: IntelligenceDomain[]; firstSeenAt: string; lastSeenAt: string; attributes: Record<string, unknown>; }
export interface Assessment { id: string; createdAt: string; query: string; domain?: IntelligenceDomain; claim: string; evidenceIds: string[]; corroboratingSourceCount: number; contradictionCount: number; confidence: number; band: ConfidenceBand; rationale: string; caveats: string[]; }
export interface Investigation { id: string; createdAt: string; updatedAt: string; question: string; status: "active" | "complete" | "blocked"; domain?: IntelligenceDomain; evidenceIds: string[]; assessmentIds: string[]; }
export interface IntelligenceQuery { question: string; domain?: IntelligenceDomain; entity?: string; limit?: number; }
export interface IntelligenceResult { investigation: Investigation; assessments: Assessment[]; evidence: Evidence[]; entities: Entity[]; generatedAt: string; }
export function confidenceBand(value: number): ConfidenceBand { if (value >= .85) return "very_high"; if (value >= .70) return "high"; if (value >= .50) return "moderate"; if (value >= .30) return "low"; return "very_low"; }
