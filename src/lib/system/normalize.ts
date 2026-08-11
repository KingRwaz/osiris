import type { Signal, SignalDomain } from "./types";

function text(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value.trim() : fallback;
}

function number(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : fallback;
}

function array(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function date(value: unknown, fallback: string): string {
  const candidate = text(value);
  return candidate && !Number.isNaN(Date.parse(candidate)) ? new Date(candidate).toISOString() : fallback;
}

function unwrap(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];
  const record = payload as Record<string, unknown>;
  for (const key of ["signals", "articles", "items", "results", "data", "events", "flights", "threats", "stories"]) {
    if (Array.isArray(record[key])) return record[key] as unknown[];
  }
  return [payload];
}

export function normalizeSignals(payload: unknown, domain: SignalDomain, source: string, limit: number): Signal[] {
  const observedAt = new Date().toISOString();
  return unwrap(payload).slice(0, limit).map((item, index) => {
    const record = item && typeof item === "object" ? item as Record<string, unknown> : {};
    const title = text(record.title ?? record.name ?? record.headline ?? record.event, `${domain} signal ${index + 1}`);
    const summary = text(record.summary ?? record.description ?? record.text ?? record.content ?? record.snippet);
    const url = text(record.url ?? record.link ?? record.sourceUrl);
    const publishedAt = date(record.publishedAt ?? record.published_at ?? record.pubDate ?? record.date ?? record.timestamp, observedAt);
    const tags = array(record.tags ?? record.categories ?? record.keywords).filter((v): v is string => typeof v === "string").map((v) => v.trim()).filter(Boolean).slice(0, 20);
    const entities = array(record.entities ?? record.entityNames).filter((v): v is string => typeof v === "string").map((v) => v.trim()).filter(Boolean).slice(0, 20);
    const confidence = number(record.confidence ?? record.score, 0.55);
    const rawId = text(record.id ?? record.guid ?? record.uuid, `${source}:${domain}:${title}:${publishedAt}`);

    return {
      id: `sig_${Buffer.from(rawId).toString("base64url").slice(0, 48)}`,
      domain,
      title,
      summary,
      source,
      ...(url ? { url } : {}),
      publishedAt,
      observedAt,
      confidence,
      tags,
      ...(entities.length ? { entities } : {}),
    };
  });
}
