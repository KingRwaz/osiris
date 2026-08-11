import type { Assessment, Entity, Evidence, Investigation } from "./types";

class IntelligenceStore {
  private evidence = new Map<string, Evidence>();
  private entities = new Map<string, Entity>();
  private assessments = new Map<string, Assessment>();
  private investigations = new Map<string, Investigation>();
  addEvidence(x: Evidence) { this.evidence.set(x.id, x); return x; }
  addEntity(x: Entity) { this.entities.set(x.id, x); return x; }
  addAssessment(x: Assessment) { this.assessments.set(x.id, x); return x; }
  addInvestigation(x: Investigation) { this.investigations.set(x.id, x); return x; }
  listEvidence() { return [...this.evidence.values()]; }
  listEntities() { return [...this.entities.values()]; }
  listAssessments() { return [...this.assessments.values()]; }
  listInvestigations() { return [...this.investigations.values()]; }
  getInvestigation(id: string) { return this.investigations.get(id); }
  searchEvidence(q: string, domain?: Evidence["domain"], limit = 25) {
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    return this.listEvidence().filter(x => {
      if (domain && x.domain !== domain) return false;
      const text = [x.title, x.summary, ...x.tags, ...x.entityIds].join(" ").toLowerCase();
      return !terms.length || terms.some(t => text.includes(t));
    }).slice(0, limit);
  }
}
export const osirisStore = new IntelligenceStore();
