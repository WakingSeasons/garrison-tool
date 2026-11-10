"use strict";

window.GARRISON_FILTERS = {
  normalize(filters = {}) {
    const selectionMode = ["all", "any"].includes(filters.selectionMode) ? filters.selectionMode : "single";
    const selected = values => {
      const unique = [...new Set(Array.isArray(values) ? values : [])];
      return selectionMode === "single" ? unique.slice(-1) : unique;
    };
    return {
      selectionMode, alliances: selected(filters.alliances), tiers: selected(filters.tiers),
      categories: selected(filters.categories), keywords: selected(filters.keywords),
      query: typeof filters.query === "string" ? filters.query : "",
      nameQuery: typeof filters.nameQuery === "string" ? filters.nameQuery : ""
    };
  },
  toggleSelection(values, value, mode) {
    if (mode === "single") return values.length === 1 && values[0] === value ? [] : [value];
    return values.includes(value) ? values.filter(selected => selected !== value) : [...values, value];
  },
  searchFields(operator) {
    const analysis = window.GARRISON_RESEARCH?.operators[operator.id];
    const effects = analysis?.effects || [];
    const fields = [operator.name, operator.englishName, operator.profession, operator.branch,
      operator.position, operator.abilityType, operator.trigger, operator.sourceNote, operator.ordinary.text, operator.elite?.text,
      ...operator.alliances, ...(operator.facts?.flat() || []),
      ...effects.flatMap(effect => [effect.role, effect.category, effect.timing, effect.basis, ...effect.targets,
        ...effect.termIds.map(id => window.GARRISON_RESEARCH.terms[id]?.label)])];
    // 仅纳入本干员明确对应的战斗技能，避免把整张关系图的所有辅助当成本人的描述。
    if (operator.id === "char_1040_blaze2") {
      const skill = window.GARRISON_RESEARCH?.entities.blazeSkill;
      if (skill) fields.push(skill.name, skill.body);
    }
    return fields.filter(value => typeof value === "string");
  },
  matches(operator, filters) {
    const selection = this.normalize(filters);
    const group = (values, predicate) => !values.length ||
      (selection.selectionMode === "any" ? values.some(predicate) : values.every(predicate));
    const effectMatches = (!selection.categories.length && !selection.keywords.length) ||
      window.GARRISON_RESEARCH?.operators[operator.id]?.effects.some(effect =>
        group(selection.categories, category => effect.category === category) &&
        group(selection.keywords, term => effect.termIds.includes(term)));
    const nameNeedle = selection.nameQuery.trim().toLowerCase();
    const needle = selection.query.trim().toLowerCase();
    return group(selection.alliances, name => operator.alliances.includes(name)) &&
      (!selection.tiers.length || selection.tiers.includes(operator.tier)) &&
      !!effectMatches &&
      (!nameNeedle || [operator.name, operator.englishName].some(name =>
        typeof name === "string" && name.toLowerCase().includes(nameNeedle))) &&
      (!needle || this.searchFields(operator).some(text => text.toLowerCase().includes(needle)));
  }
};
