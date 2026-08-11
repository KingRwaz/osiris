import { normalizeSignals } from "./normalize";
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
  const domains = query.domains?.length ? query.domains : ["general", "geopolitics", "markets"] as SignalDomain[];
  return domains.map((domain) => ({
    domain,
    endpoint: DOMAIN_ENDPOINTS[domain] ?? null,
    query: query.query.trim(),
  }));
}

export function mergeSignals(query: IntelligenceQuery, batches: Signal[][]): IntelligenceResponse {
  const limit = Math.max(1, Math.min(query.limit ?? 50, 200));
  const signals = batches.flat().sort((a, b) => {
    const aTime = Date.parse(a.publishedAt ?? a.observedAt);
    const bTime = Date.parse(b.publishedAt ?? b.observedAt);
    return bTime - aTime;
  }).slice(0, limit);
  const sources = [...new Set(signals.map((signal) => signal.source))];

  return {
    query: query.query.trim(),
    generatedAt: new Date().toISOString(),
    sources,
    signals,
    status: signals.length ? "ok" : "partial",
  };
}

export async function executeQuery(query: IntelligenceQuery, origin: string): Promise<IntelligenceResponse> {
  const plans = planQuery(query);
  const limit = Math.max(1, Math.min(query.limit ?? 50, 200));
  const batches = await Promise.all(plans.map(async ({ domain, endpoint, query: search }) => {
    if (!endpoint) return [];
    try {
      const url = new URL(endpoint, origin);
      url.searchParams.set("q", search);
      url.searchParams.set("query", search);
      const response = await fetch(url, { cache: "no-store", headers: { accept: "application/json" } });
      if (!response.ok) return [];
      const payload: unknown = await response.json();
      return normalizeSignals(payload, domain, endpoint.slice(5), limit);
    } catch {
      return [];
    }
  }));

  return mergeSignals(query, batches);
}
