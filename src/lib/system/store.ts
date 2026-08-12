import type { Signal } from "./types";

export type StoredSignal = Signal & {
  firstObservedAt: string;
  lastObservedAt: string;
  observationCount: number;
};

export type SignalStore = {
  upsert(signals: Signal[]): Promise<StoredSignal[]>;
  recent(limit?: number): Promise<StoredSignal[]>;
};

const memory = new Map<string, StoredSignal>();

function merge(existing: StoredSignal | undefined, signal: Signal): StoredSignal {
  if (!existing) {
    return {
      ...signal,
      firstObservedAt: signal.observedAt,
      lastObservedAt: signal.observedAt,
      observationCount: 1,
    };
  }

  return {
    ...existing,
    ...signal,
    firstObservedAt: existing.firstObservedAt,
    lastObservedAt: signal.observedAt,
    observationCount: existing.observationCount + 1,
    tags: [...new Set([...existing.tags, ...signal.tags])].slice(0, 24),
    entities: [...new Set([...(existing.entities ?? []), ...(signal.entities ?? [])])].slice(0, 24),
  };
}

export const memoryStore: SignalStore = {
  async upsert(signals) {
    return signals.map((signal) => {
      const value = merge(memory.get(signal.id), signal);
      memory.set(signal.id, value);
      return value;
    });
  },

  async recent(limit = 50) {
    return [...memory.values()]
      .sort((a, b) => Date.parse(b.lastObservedAt) - Date.parse(a.lastObservedAt))
      .slice(0, Math.max(1, Math.min(limit, 200)));
  },
};

export function mergeStoredSignal(existing: StoredSignal | undefined, signal: Signal) {
  return merge(existing, signal);
}
