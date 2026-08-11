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
  const signals = batches.flat().slice(0, Math.max(1, Math.min(query.limit ?? 50, 200)));
  const sources = [...new Set(signals.map((signal) => signal.source))];

  return {
    query: query.query.trim(),
    generatedAt: new Date().toISOString(),
    sources,
    signals,
    status: signals.length ? "ok" : "partial",
  };
}
