import type { Assessment, Entity, Evidence, IntelligenceDomain, Investigation } from "./types";

class OsirisStore {
  private readonly evidence = new Map<string, Evidence>();
  private readonly entities = new Map<string, Entity>();
  private readonly assessments = new Map<string, Assessment>();
  private readonly investigations = new Map<string, Investigation>();

  addEvidence(item: Evidence): Evidence {
    this.evidence.set(item.id, item);
    return item;
  }

  addEntity(item: Entity): Entity {
    this.entities.set(item.id, item);
    return item;
  }

  addAssessment(item: Assessment): Assessment {
    this.assessments.set(item.id, item);
    return item;
  }

  addInvestigation(item: Investigation): Investigation {
    this.investigations.set(item.id, item);
    return item;
  }

  listEntities(): Entity[] {
    return [...this.entities.values()];
  }

  searchEvidence(question: string, domain: IntelligenceDomain | undefined, limit: number): Evidence[] {
    const terms = question.toLowerCase().split(/\s+/).filter(Boolean);
    return [...this.evidence.values()]
      .filter((item) => !domain || item.tags.includes(domain))
      .filter((item) => {
        const haystack = `${item.title} ${item.summary} ${item.tags.join(" ")}`.toLowerCase();
        return terms.length === 0 || terms.some((term) => haystack.includes(term));
      })
      .slice(0, Math.max(1, Math.min(limit, 200)));
  }
}

export const osirisStore = new OsirisStore();
