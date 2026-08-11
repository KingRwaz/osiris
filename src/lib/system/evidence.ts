import type { Signal } from './types';

export type EvidenceRecord = {
  signalId: string;
  source: string;
  observedAt: string;
  confidence: number;
  provenance: 'runtime-adapter';
};

export function buildEvidence(signals: Signal[]): EvidenceRecord[] {
  return signals.map((signal) => ({
    signalId: signal.id,
    source: signal.source,
    observedAt: signal.observedAt,
    confidence: signal.confidence,
    provenance: 'runtime-adapter',
  }));
}
