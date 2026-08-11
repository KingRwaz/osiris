import type { Signal } from './types';
import { getRuntimeSources } from './source-registry';

export type EvidenceAssessment = {
  signal: Signal;
  score: number;
  freshness: number;
  corroboration: number;
  sourceWeight: number;
};

function freshnessScore(observedAt: string, now = Date.now()): number {
  const time = Date.parse(observedAt);
  if (!Number.isFinite(time)) return 0.25;
  const ageHours = Math.max(0, (now - time) / 3_600_000);
  if (ageHours <= 1) return 1;
  if (ageHours <= 6) return 0.9;
  if (ageHours <= 24) return 0.75;
  if (ageHours <= 72) return 0.5;
  return 0.25;
}

function sourceWeight(sourceId: string): number {
  const source = getRuntimeSources().find((item) => item.id === sourceId);
  if (!source) return 0.5;
  return Math.min(1, Math.max(0.1, source.priority / 100));
}

function semanticKey(signal: Signal): string {
  return signal.title.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim().split(' ').filter((word) => word.length > 3).slice(0, 10).join(' ');
}

/** Independent corroboration is evidence; repository popularity is not. */
export function assessEvidence(signals: Signal[], now = Date.now()): EvidenceAssessment[] {
  const groups = new Map<string, Signal[]>();
  for (const signal of signals) {
    const key = semanticKey(signal) || signal.id;
    groups.set(key, [...(groups.get(key) ?? []), signal]);
  }

  return signals.map((signal) => {
    const group = groups.get(semanticKey(signal) || signal.id) ?? [signal];
    const independentSources = new Set(group.map((item) => item.source)).size;
    const corroboration = Math.min(1, 0.55 + Math.max(0, independentSources - 1) * 0.2);
    const freshness = freshnessScore(signal.observedAt, now);
    const weight = sourceWeight(signal.source);
    const score = Math.min(1, Math.max(0, signal.confidence * 0.45 + freshness * 0.2 + corroboration * 0.2 + weight * 0.15));
    return { signal, score, freshness, corroboration, sourceWeight: weight };
  }).sort((a, b) => b.score - a.score);
}
