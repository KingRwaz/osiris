import type { EvidenceKind, IntelligenceDomain } from "./intelligence";

export interface SourceDefinition {
  id: string;
  name: string;
  domain: IntelligenceDomain;
  kind: EvidenceKind;
  refreshSeconds: number;
  enabled: boolean;
  description: string;
}

/**
 * Canonical OSIRIS source registry.
 * Adapters should consume this registry rather than hard-coding source policy.
 */
export const SOURCE_REGISTRY: SourceDefinition[] = [
  {
    id: "usgs-earthquakes",
    name: "USGS Earthquake Hazards Program",
    domain: "seismic",
    kind: "official",
    refreshSeconds: 300,
    enabled: true,
    description: "Earthquake and seismic event observations.",
  },
  {
    id: "nasa-firms",
    name: "NASA FIRMS",
    domain: "weather",
    kind: "official",
    refreshSeconds: 900,
    enabled: true,
    description: "Satellite-derived active fire observations.",
  },
  {
    id: "noaa-swpc",
    name: "NOAA Space Weather Prediction Center",
    domain: "space",
    kind: "official",
    refreshSeconds: 900,
    enabled: true,
    description: "Solar and space-weather observations and alerts.",
  },
  {
    id: "opensky",
    name: "OpenSky Network",
    domain: "aviation",
    kind: "open-dataset",
    refreshSeconds: 30,
    enabled: true,
    description: "Open aircraft state-vector data.",
  },
  {
    id: "nvd",
    name: "National Vulnerability Database",
    domain: "cyber",
    kind: "official",
    refreshSeconds: 3600,
    enabled: true,
    description: "Public CVE and vulnerability intelligence.",
  },
  {
    id: "gdelt",
    name: "GDELT",
    domain: "news",
    kind: "open-dataset",
    refreshSeconds: 300,
    enabled: true,
    description: "Global news and event discovery signals.",
  },
  {
    id: "faostat",
    name: "FAOSTAT",
    domain: "agriculture",
    kind: "open-dataset",
    refreshSeconds: 86400,
    enabled: true,
    description: "Agriculture, food and commodity statistics.",
  },
  {
    id: "world-bank",
    name: "World Bank Open Data",
    domain: "trade",
    kind: "open-dataset",
    refreshSeconds: 86400,
    enabled: true,
    description: "Development, macroeconomic and trade indicators.",
  },
];

export function getEnabledSources(domain?: IntelligenceDomain): SourceDefinition[] {
  return SOURCE_REGISTRY.filter((source) => source.enabled && (!domain || source.domain === domain));
}
