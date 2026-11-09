"use strict";

window.GARRISON_RESEARCH_QUERY = {
  entries(term, { kind = "all", query = "" } = {}) {
    const data = window.GARRISON_RESEARCH;
    const search = query.trim().toLocaleLowerCase();
    return data.relations.filter(relation => relation.term === term).map(relation => ({
      ...relation, ...data.entities[relation.entity], id: relation.entity
    })).filter(entry => {
      const kindMatches = kind === "all" || (kind === "other" ? ["alliance", "equipment"].includes(entry.kind) : entry.kind === kind);
      const text = `${entry.name} ${entry.identity} ${entry.body} ${entry.reason} ${entry.conditions}`.toLocaleLowerCase();
      return kindMatches && (!search || text.includes(search));
    });
  },
  relatedTerms(entity, except) {
    return [...new Set(window.GARRISON_RESEARCH.relations.filter(relation => relation.entity === entity && relation.term !== except).map(relation => relation.term))];
  }
};
