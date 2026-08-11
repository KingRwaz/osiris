import type { SystemComponent } from "./types";

export const SYSTEM_COMPONENTS: SystemComponent[] = [
  { id: "osiris-ui", name: "OSIRIS Command Surface", role: "Unified intelligence interface", kind: "core", enabled: true },
  { id: "worldmonitor", name: "WorldMonitor", role: "Global situational-awareness feed", kind: "data", enabled: true },
  { id: "openbb", name: "OpenBB", role: "Financial research and market-data adapter", kind: "data", enabled: true },
  { id: "mineru", name: "MinerU", role: "Document extraction adapter", kind: "data", enabled: true },
  { id: "openviking", name: "OpenViking", role: "Agent context and resource layer", kind: "core", enabled: true },
  { id: "memori", name: "Memori", role: "Persistent agent-state adapter", kind: "core", enabled: true },
  { id: "qdrant", name: "Qdrant", role: "Vector retrieval adapter", kind: "data", enabled: true },
  { id: "n8n", name: "n8n", role: "Workflow execution adapter", kind: "execution", enabled: true },
  { id: "erpnext", name: "ERPNext", role: "Enterprise operations adapter", kind: "execution", enabled: true },
  { id: "grafana", name: "Grafana", role: "Observability adapter", kind: "observability", enabled: true },
];

export const SYSTEM_VERSION = "0.1.0";

export function getEnabledComponents() {
  return SYSTEM_COMPONENTS.filter((component) => component.enabled);
}
