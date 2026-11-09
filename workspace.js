"use strict";

(() => {
  const data = window.GARRISON_DATA;
  const definitions = window.GARRISON_ALLIANCES;
  const equipment = window.GARRISON_EQUIPMENT;
  const knownIds = new Set(data.operators.filter(operator => operator.rosterEligible !== false).map(operator => operator.id));
  const knownAlliances = new Set([...data.coreAlliances, ...data.addonAlliances]);
  const knownCategories = new Set(window.GARRISON_RESEARCH.categories);
  const knownTerms = new Set(Object.keys(window.GARRISON_RESEARCH.terms));
  const strings = value => Array.isArray(value) ? value.filter(item => typeof item === "string") : [];

  function pane(id, alliance) {
    return { id, filters: window.GARRISON_FILTERS.normalize({ alliances: alliance ? [alliance] : [] }),
      elites: [], scrollTop: 0, filtersOpen: id === "primary", effectsExpanded: alliance ? [alliance] : [] };
  }
  const sections = ["operators", "alliances", "strategies", "enemies", "equipment", "presets"];
  function create() {
    return {
      version: 1, panes: [pane("primary")], members: [], rosterOpen: false,
      bannedAlliances: [], personnelDocument: false,
      section: "operators", sidebarCollapsed: false, catalogQueries: { alliances: "", strategies: "", equipment: "" }
    };
  }
  function restore(raw) {
    try {
      const value = typeof raw === "string" ? JSON.parse(raw) : raw;
      if (!value || value.version !== 1 || !Array.isArray(value.panes)) return create();
      const state = create();
      state.panes = value.panes.slice(0, 2).map((entry, index) => {
        entry = entry && typeof entry === "object" ? entry : {};
        const result = pane(index ? "compare" : "primary");
        const f = entry.filters && typeof entry.filters === "object" ? entry.filters : {};
        result.filters = window.GARRISON_FILTERS.normalize({ ...f,
          alliances: strings(f.alliances).filter(name => knownAlliances.has(name)),
          tiers: Array.isArray(f.tiers) ? f.tiers.filter(tier => data.tiers.includes(tier)) : [],
          categories: strings(f.categories).filter(category => knownCategories.has(category)),
          keywords: strings(f.keywords).filter(term => knownTerms.has(term))
        });
        result.elites = [...new Set(strings(entry.elites).filter(id => knownIds.has(id)))];
        result.scrollTop = Number.isFinite(entry.scrollTop) ? Math.max(0, entry.scrollTop) : 0;
        result.filtersOpen = typeof entry.filtersOpen === "boolean" ? entry.filtersOpen : result.filtersOpen;
        result.effectsExpanded = strings(entry.effectsExpanded).filter(name => knownAlliances.has(name));
        return result;
      });
      if (!state.panes.length) state.panes = [pane("primary")];
      for (const member of Array.isArray(value.members) ? value.members : []) {
        if (member && addMember(state, member.id, member.elite === true)) {
          setTransfer(state, member.id, member.transferEquipment);
        }
      }
      state.rosterOpen = value.rosterOpen === true;
      state.bannedAlliances = [...new Set(strings(value.bannedAlliances).filter(name => knownAlliances.has(name)))];
      state.personnelDocument = value.personnelDocument === true;
      if (sections.includes(value.section)) state.section = value.section;
      state.sidebarCollapsed = value.sidebarCollapsed === true;
      for (const section of Object.keys(state.catalogQueries)) {
        if (typeof value.catalogQueries?.[section] === "string") state.catalogQueries[section] = value.catalogQueries[section];
      }
      return state;
    } catch { return create(); }
  }
  function openCompare(state, alliance) {
    const name = knownAlliances.has(alliance) ? alliance : undefined;
    const compare = state.panes[1];
    if (name && compare?.filters.alliances.length === 1 && compare.filters.alliances[0] === name) {
      compare.effectsExpanded = [name];
      compare.scrollTop = 0;
      return;
    }
    state.panes[1] = pane("compare", name);
  }
  function closeCompare(state) { state.panes.splice(1); }
  function isBanned(operator, bannedAlliances) {
    return operator.tier !== "special" && operator.alliances.length > 0 &&
      operator.alliances.every(name => bannedAlliances.includes(name));
  }
  function addMember(state, id, elite = false) {
    if (!knownIds.has(id) || state.members.some(member => member.id === id)) return false;
    state.members.push({ id, elite: !!elite }); return true;
  }
  function removeMember(state, id) {
    const index = state.members.findIndex(member => member.id === id);
    if (index < 0) return false;
    state.members.splice(index, 1); return true;
  }
  function setTransfer(state, id, gearName) {
    const member = state.members.find(entry => entry.id === id);
    if (!member) return false;
    if (gearName == null || gearName === "") {
      delete member.transferEquipment;
      return true;
    }
    if (!equipment.byName.get(gearName)?.grantAlliance) return false;
    member.transferEquipment = gearName;
    return true;
  }
  function counts(members) {
    const result = {};
    const seen = new Set();
    for (const member of members) {
      if (seen.has(member.id)) continue;
      const operator = data.operators.find(operator => operator.id === member.id);
      if (!operator) continue;
      seen.add(member.id);
      const alliances = new Set(operator.alliances);
      const granted = equipment.byName.get(member.transferEquipment)?.grantAlliance;
      if (granted) alliances.add(granted);
      for (const name of alliances) result[name] = (result[name] || 0) + 1;
      if (member.elite) result.绝技 = (result.绝技 || 0) + 1;
    }
    if (result.调和) {
      // 调和激活后，场上已有的各核心盟约的激活人数各加一。
      for (const name of data.coreAlliances) if (result[name]) result[name]++;
    }
    return result;
  }
  function allianceProgress(name, members) {
    const definition = definitions[name];
    const count = counts(members)[name] || 0;
    const thresholds = definition?.thresholds || [];
    const activeThreshold = definition?.exclusiveMax && count > definition.exclusiveMax ? 0 :
      thresholds.filter(threshold => count >= threshold).at(-1) || 0;
    const nextThreshold = thresholds.find(threshold => threshold > count) || thresholds.at(-1) || 0;
    return { name, count, activeThreshold, nextThreshold, maxThreshold: thresholds.at(-1) || 0,
      needed: Math.max(0, nextThreshold - count) };
  }
  function progress(members) {
    const totals = counts(members);
    return [...data.coreAlliances, ...data.addonAlliances].filter(name => totals[name])
      .map(name => allianceProgress(name, members));
  }
  window.GARRISON_WORKSPACE = { create, restore, openCompare, closeCompare, isBanned, addMember, removeMember, setTransfer, progress, allianceProgress };
})();
