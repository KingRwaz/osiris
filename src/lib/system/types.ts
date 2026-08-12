export type SignalDomain =
  | "geopolitics"
  | "markets"
  | "trade"
  | "agriculture"
  | "infrastructure"
  | "maritime"
  | "aviation"
  | "cyber"
  | "weather"
  | "documents"
  | "general";

export type Signal = {
  id: string;
  domain: SignalDomain;
  title: string;
  summary: string;
  source: string;
  url?: string;
  publishedAt?: string;
  observedAt: string;
  confidence: number;
  tags: string[];
  entities?: string[];
};

export type IntelligenceQuery = {
  query: string;
  domains?: SignalDomain[];
  limit?: number;
};

export type IntelligenceResponse = {
  query: string;
  generatedAt: string;
  sources: string[];
  signals: Signal[];
  status: "ok" | "partial" | "error";
  storage?: {
    backend: "supabase" | "memory";
    persisted: number;
  };
};

export type SystemComponent = {
  id: string;
  name: string;
  role: string;
  kind: "core" | "adapter" | "data" | "execution" | "observability";
  enabled: boolean;
};
