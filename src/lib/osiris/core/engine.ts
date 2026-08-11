import { createHash } from "node:crypto";
import { confidenceBand, type Assessment, type Entity, type Evidence, type IntelligenceQuery, type IntelligenceResult, type IntelligenceDomain } from "./types";
import { osirisStore } from "./store";
import { collectRuntimeSources } from "@/lib/system/adapter";
import type { Signal } from "@/lib/system/types";

const makeId = (prefix: string, value: string) => `${prefix}_${createHash("sha256").update(value).digest("hex").slice(0, 16)}`;

function freshness(e: Evidence, now: number) {
  const observed = Date.parse(e.observedAt);
  if (!Number.isFinite(observed)) return 0;
  return Math.pow(0.5, Math.max(0, now - observed) / 36e5 / Math.max(1, e.freshnessHalfLifeHours));
}

function score(e: Evidence, q: IntelligenceQuery, now: number) {
  const text = `${e.title} ${e.summary} ${e.tags.join(" ")} ${e.entityIds.join(" ")}`.toLowerCase();
  const terms = q.question.toLowerCase().split(/\s+/).filter(t => t.length > 2);
  const relevance = terms.length ? terms.filter(t => text.includes(t)).length / terms.length : 0;
  return Math.min(1, e.source.authority * .35 + e.confidence * .30 + freshness(e, now) * .20 + relevance * .15);
}

function mapDomain(domain: Signal["domain"]): IntelligenceDomain {
  if (domain === "geopolitics") return "geopolitical";
  if (domain === "markets") return "financial";
  if (domain === "weather") return "environment";
  if (domain === "documents") return "general";
  return domain as IntelligenceDomain;
}

function signalToEvidence(signal: Signal): Evidence {
  return {
    id: makeId("ev", `${signal.source}:${signal.id}`),
    observedAt: signal.observedAt,
    ingestedAt: new Date().toISOString(),
    source: { id: signal.source, name: signal.source, uri: signal.url, authority: Math.max(.1, Math.min(1, signal.confidence)), independenceGroup: signal.source },
    kind: "signal",
    domain: mapDomain(signal.domain),
    title: signal.title,
    summary: signal.summary,
    entityIds: signal.entities ?? [],
    tags: signal.tags,
    confidence: Math.max(0, Math.min(1, signal.confidence)),
    freshnessHalfLifeHours: 24,
    contentHash: createHash("sha256").update(JSON.stringify(signal)).digest("hex"),
    metadata: { publishedAt: signal.publishedAt },
  };
}

async function refreshRuntimeEvidence(q: IntelligenceQuery) {
  const systemDomain = q.domain === "geopolitical" ? "geopolitics" : q.domain === "financial" ? "markets" : q.domain;
  const results = await collectRuntimeSources(
    { query: q.question, domains: systemDomain ? [systemDomain as import("@/lib/system/types").SignalDomain] : undefined, limit: q.limit },
    fetch,
  );
  for (const result of results) {
    for (const signal of result.signals) osirisStore.addEvidence(signalToEvidence(signal));
  }
  return results.filter(r => r.error).map(r => ({ source: r.source, error: r.error }));
}

export async function investigate(q: IntelligenceQuery): Promise<IntelligenceResult & { adapterErrors: Array<{ source: string; error?: string }> }> {
  const adapterErrors = await refreshRuntimeEvidence(q);
  const now = new Date();
  const evidence = osirisStore.searchEvidence(q.question, q.domain, q.limit ?? 25).sort((a, b) => score(b, q, now.getTime()) - score(a, q, now.getTime()));
  const sources = new Set(evidence.map(e => e.source.independenceGroup ?? e.source.id));
  const mean = evidence.length ? evidence.reduce((sum, e) => sum + score(e, q, now.getTime()), 0) / evidence.length : 0;
  const confidence = Math.min(.99, mean * .65 + Math.min(1, sources.size / 3) * .35);
  const assessment: Assessment = {
    id: makeId("asm", q.question + now.toISOString()),
    createdAt: now.toISOString(),
    query: q.question,
    domain: q.domain,
    claim: evidence.length ? `OSIRIS found ${evidence.length} relevant evidence item(s) and assesses the current evidence at ${confidenceBand(confidence)} confidence.` : "OSIRIS found no matching evidence in its current evidence store.",
    evidenceIds: evidence.map(e => e.id),
    corroboratingSourceCount: sources.size,
    contradictionCount: 0,
    confidence,
    band: confidenceBand(confidence),
    rationale: evidence.length ? "Assessment combines source authority, observation confidence, freshness and independent-source corroboration." : "OSIRIS does not infer a positive finding from absence of evidence.",
    caveats: evidence.length ? ["Source independence matters more than raw source count.", "Assessment is limited to evidence currently available to OSIRIS."] : ["No evidence is not evidence of absence."],
  };
  osirisStore.addAssessment(assessment);
  const investigation = osirisStore.addInvestigation({
    id: makeId("inv", q.question + now.toISOString()),
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    question: q.question,
    status: "complete",
    domain: q.domain,
    evidenceIds: evidence.map(e => e.id),
    assessmentIds: [assessment.id],
  });
  const ids = new Set(evidence.flatMap(e => e.entityIds));
  const entities = osirisStore.listEntities().filter(e => ids.has(e.id) || !!(q.entity && [e.canonicalName, ...e.aliases].some(n => n.toLowerCase().includes(q.entity!.toLowerCase()))));
  return { investigation, assessments: [assessment], evidence, entities, generatedAt: now.toISOString(), adapterErrors };
}

export function ingestEvidence(input: Omit<Evidence, "id" | "ingestedAt" | "contentHash">) {
  const ingestedAt = new Date().toISOString();
  const contentHash = createHash("sha256").update(JSON.stringify(input)).digest("hex");
  return osirisStore.addEvidence({ ...input, id: `ev_${contentHash.slice(0, 16)}`, ingestedAt, contentHash });
}

export function upsertEntity(input: Omit<Entity, "firstSeenAt" | "lastSeenAt">) {
  const now = new Date().toISOString();
  const old = osirisStore.listEntities().find(e => e.id === input.id);
  return osirisStore.addEntity({ ...input, firstSeenAt: old?.firstSeenAt ?? now, lastSeenAt: now });
}
