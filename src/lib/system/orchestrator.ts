import type { IntelligenceQuery, IntelligenceResponse, Signal, SignalDomain } from "./types";

const DOMAIN_ENDPOINTS: Partial<Record<SignalDomain, string>> = {
  geopolitics: "/api/news",
  markets: "/api/markets",
  infrastructure: "/api/infrastructure",
  maritime: "/api/maritime",
  aviation: "/api/flights",
  cyber: "/api/cyber-threats",
  weather: "/api/air-quality",
  trade: "/api/gdelt",
  general: "/api/live-news",
};

export function planQuery(query: IntelligenceQuery) {
  const domains = query.domains?.length
    ? query.domains
    : (["general", "geopolitics", "markets"] as SignalDomain[]);

  return domains.map((domain) => ({
    domain,
    endpoint: DOMAIN_ENDPOINTS[domain] ?? null,
    query: query.query.trim(),
  }));
}

function text(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (["string", "number", "boolean"].includes(typeof value)) return String(value);
  try { return JSON.stringify(value); } catch { return ""; }
}

function normalizeItem(domain: SignalDomain, item: Record<string, unknown>, index: number): Signal {
  const title = text(item.title ?? item.name ?? item.symbol ?? item.id ?? `${domain} observation`);
  const summary = text(item.summary ?? item.description ?? item.headline ?? item.status ?? item.value ?? item.price ?? "");
  const source = text(item.source ?? item.provider ?? item.owner ?? "OSIRIS endpoint");
  const url = text(item.url ?? item.link ?? item.href);
  const publishedAt = text(item.publishedAt ?? item.published ?? item.pubDate ?? item.timestamp);
  const risk = typeof item.risk_score === "number" ? item.risk_score : undefined;
  const confidence = typeof item.confidence === "number"
    ? Math.max(0, Math.min(1, item.confidence))
    : risk !== undefined ? Math.max(0.1, Math.min(1, risk / 10)) : 0.75;
  const tags = [domain, ...["country", "region", "category", "type", "status", "symbol"].map((key) => text(item[key])).filter(Boolean)];
  const entities = [item.name, item.country, item.city, item.symbol].map(text).filter(Boolean).slice(0, 8);
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);

  return {
    id: `osiris:${domain}:${index}:${slug}`,
    domain,
    title,
    summary: summary.slice(0, 1200),
    source,
    ...(url ? { url } : {}),
    ...(publishedAt ? { publishedAt } : {}),
    observedAt: new Date().toISOString(),
    confidence,
    tags: [...new Set(tags)].slice(0, 12),
    ...(entities.length ? { entities } : {}),
  };
}

function normalizePayload(domain: SignalDomain, payload: unknown): Signal[] {
  if (!payload || typeof payload !== "object") return [];
  const records: Record<string, unknown>[] = [];

  if (Array.isArray(payload)) {
    records.push(...payload.filter((v): v is Record<string, unknown> => !!v && typeof v === "object"));
  } else {
    const root = payload as Record<string, unknown>;
    for (const [key, value] of Object.entries(root)) {
      if (Array.isArray(value)) {
        for (const entry of value) {
          if (entry && typeof entry === "object") {
            const obj = entry as Record<string, unknown>;
            records.push({ ...obj, source: obj.source ?? key });
          }
        }
      } else if (value && typeof value === "object") {
        const obj = value as Record<string, unknown>;
        const scalarKeys = Object.keys(obj).filter((k) => ["price", "change_percent", "up", "status", "value"].includes(k));
        if (scalarKeys.length) records.push({ ...obj, name: obj.name ?? key, source: obj.source ?? key });
      }
    }
    if (!records.length && ["title", "name", "status", "value", "price"].some((k) => k in root)) records.push(root);
  }

  return records.slice(0, 200).map((item, index) => normalizeItem(domain, item, index));
}

async function fetchDomain(origin: string, domain: SignalDomain, endpoint: string, query: string): Promise<Signal[]> {
  try {
    const url = new URL(endpoint, origin);
    url.searchParams.set("q", query);
    const response = await fetch(url, {
      signal: AbortSignal.timeout(12000),
      headers: { accept: "application/json" },
      cache: "no-store",
    });
    if (!response.ok) return [];
    return normalizePayload(domain, await response.json());
  } catch {
    return [];
  }
}

export async function executeQuery(query: IntelligenceQuery, origin: string): Promise<IntelligenceResponse> {
  const plan = planQuery(query).filter((item) => item.endpoint);
  const batches = await Promise.all(plan.map((item) => fetchDomain(origin, item.domain, item.endpoint as string, item.query)));
  return mergeSignals(query, batches);
}

export function mergeSignals(query: IntelligenceQuery, batches: Signal[][]): IntelligenceResponse {
  const limit = Math.max(1, Math.min(query.limit ?? 50, 200));
  const signals = batches.flat().slice(0, limit);
  const sources = [...new Set(signals.map((signal) => signal.source))];
  const requested = query.domains?.length ? query.domains : [];
  const successful = new Set(signals.map((signal) => signal.domain));
  const status: IntelligenceResponse["status"] = !signals.length
    ? "partial"
    : requested.length && successful.size < requested.length ? "partial" : "ok";

  return { query: query.query.trim(), generatedAt: new Date().toISOString(), sources, signals, status };
}
