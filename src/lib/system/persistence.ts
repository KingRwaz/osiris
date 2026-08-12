import type { Signal } from "./types";
import { memoryStore, type SignalStore, type StoredSignal } from "./store";

const TABLE = "osiris_signals";

function supabaseStore(): SignalStore | null {
  const baseUrl = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!baseUrl || !serviceKey) return null;

  const headers = {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    "Content-Type": "application/json",
  };

  return {
    async upsert(signals: Signal[]) {
      if (!signals.length) return [];
      const rows = signals.map((signal) => ({
        id: signal.id,
        domain: signal.domain,
        title: signal.title,
        summary: signal.summary,
        source: signal.source,
        url: signal.url ?? null,
        published_at: signal.publishedAt ?? null,
        observed_at: signal.observedAt,
        confidence: signal.confidence,
        tags: signal.tags,
        entities: signal.entities ?? [],
      }));

      const response = await fetch(`${baseUrl}/rest/v1/${TABLE}?on_conflict=id`, {
        method: "POST",
        headers: { ...headers, Prefer: "resolution=merge-duplicates,return=representation" },
        body: JSON.stringify(rows),
        signal: AbortSignal.timeout(8000),
        cache: "no-store",
      });
      if (!response.ok) throw new Error(`Supabase upsert failed: ${response.status}`);

      const data = (await response.json()) as Array<Record<string, unknown>>;
      return data.map(toStoredSignal);
    },

    async recent(limit = 50) {
      const bounded = Math.max(1, Math.min(limit, 200));
      const response = await fetch(
        `${baseUrl}/rest/v1/${TABLE}?select=*&order=last_observed_at.desc&limit=${bounded}`,
        { headers, signal: AbortSignal.timeout(8000), cache: "no-store" },
      );
      if (!response.ok) throw new Error(`Supabase read failed: ${response.status}`);
      return ((await response.json()) as Array<Record<string, unknown>>).map(toStoredSignal);
    },
  };
}

function toStoredSignal(row: Record<string, unknown>): StoredSignal {
  return {
    id: String(row.id),
    domain: row.domain as StoredSignal["domain"],
    title: String(row.title ?? ""),
    summary: String(row.summary ?? ""),
    source: String(row.source ?? ""),
    ...(row.url ? { url: String(row.url) } : {}),
    ...(row.published_at ? { publishedAt: String(row.published_at) } : {}),
    observedAt: String(row.observed_at),
    confidence: Number(row.confidence ?? 0),
    tags: Array.isArray(row.tags) ? row.tags.map(String) : [],
    entities: Array.isArray(row.entities) ? row.entities.map(String) : [],
    firstObservedAt: String(row.first_observed_at ?? row.observed_at),
    lastObservedAt: String(row.last_observed_at ?? row.observed_at),
    observationCount: Number(row.observation_count ?? 1),
  };
}

let cachedStore: SignalStore | null | undefined;

export function getSignalStore(): SignalStore {
  if (cachedStore !== undefined) return cachedStore ?? memoryStore;
  cachedStore = supabaseStore();
  return cachedStore ?? memoryStore;
}

export async function persistSignals(signals: Signal[]): Promise<{ stored: StoredSignal[]; backend: "supabase" | "memory" }> {
  const configured = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
  try {
    const store = getSignalStore();
    return { stored: await store.upsert(signals), backend: configured ? "supabase" : "memory" };
  } catch {
    const stored = await memoryStore.upsert(signals);
    return { stored, backend: "memory" };
  }
}

export async function recentSignals(limit = 50) {
  try {
    return await getSignalStore().recent(limit);
  } catch {
    return memoryStore.recent(limit);
  }
}
