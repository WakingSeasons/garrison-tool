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
  const defaultMarkedNames = ['砾','云迹','承曦格雷伊','罗比菈塔','青枳','霍尔海雅','空弦'];
  function markedItemKey(item) { return item?.kind==='operator'?'operator:'+item.id:item?.kind==='alliance'?'alliance:'+item.name:''; }
  function defaultMarkedItems() { return defaultMarkedNames.map(name=>data.operators.find(o=>o.name===name)).filter(Boolean).map(o=>({kind:'operator',id:o.id})); }
  function normalizeMarkedItems(raw) {
    if(!Array.isArray(raw))return defaultMarkedItems();
    const seen=new Set(),items=[];
    for(const item of raw){
      if(!item||!(item.kind==='operator'&&knownIds.has(item.id)||item.kind==='alliance'&&knownAlliances.has(item.name)))continue;
      const key=markedItemKey(item);if(seen.has(key))continue;seen.add(key);
      items.push(item.kind==='operator'?{kind:'operator',id:item.id}:{kind:'alliance',name:item.name});
    }
    return items;
  }
  function searchMarkedItems(query,selected=[]) {
    const needle=String(query||'').trim().toLowerCase();if(!needle)return[];
    const added=new Set(normalizeMarkedItems(selected).map(markedItemKey));
    const options=[...data.operators.filter(o=>knownIds.has(o.id)).map(o=>({kind:'operator',id:o.id,name:o.name,englishName:o.englishName||'',detail:o.alliances.join(' · ')})),...[...knownAlliances].map(name=>({kind:'alliance',name,detail:data.coreAlliances.includes(name)?'核心盟约':'独立盟约'}))];
    const score=o=>o.name.toLowerCase()===needle?0:o.name.toLowerCase().startsWith(needle)?1:2;
    return options.filter(o=>!added.has(markedItemKey(o))&&(o.name.toLowerCase().includes(needle)||String(o.englishName||'').toLowerCase().includes(needle)))
      .sort((a,b)=>score(a)-score(b)||a.name.localeCompare(b.name,'zh-CN')).slice(0,8);
  }
  function markedItemStatus(item,result) {
    if(!result||result.conflicts?.length||!Array.isArray(result.alliances))return 'unknown';
    const states=new Map();
    for(const row of result.alliances){if(!knownAlliances.has(row.name))continue;const status=['active','inactive'].includes(row.state)?row.state:'unknown';states.set(row.name,states.has(row.name)&&states.get(row.name)!==status?'unknown':status);}
    if(item.kind==='alliance')return states.get(item.name)==='active'?'available':states.get(item.name)==='inactive'?'banned':'unknown';
    const operator=data.operators.find(o=>o.id===item.id);if(!operator)return 'unknown';
    const inactive=[...states].filter(([,s])=>s==='inactive').map(([n])=>n);
    if(isBanned(operator,inactive))return 'banned';
    const unknown=operator.alliances.filter(n=>!['active','inactive'].includes(states.get(n)));
    return isBanned(operator,[...inactive,...unknown])?'unknown':'available';
  }

  function pane(id, alliance) {
    return { id, filters: window.GARRISON_FILTERS.normalize({ alliances: alliance ? [alliance] : [] }),
      elites: [], scrollTop: 0, filtersOpen: id === "primary", effectsExpanded: alliance ? [alliance] : [] };
  }
  const sections = ["capture", "operators", "alliances", "strategies", "enemies", "equipment", "presets", "friends"];
  function create() {
    return {
      version: 1, panes: [pane("primary")], members: [], rosterOpen: false,
      bannedAlliances: [], hideBannedOperators: false, personnelDocument: false, sessionContext: null, markedItems: defaultMarkedItems(),
      section: "operators", sidebarCollapsed: false, catalogQueries: { alliances: "", strategies: "", equipment: "", enemies: "" }
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
      state.hideBannedOperators = value.hideBannedOperators === true;
      state.personnelDocument = value.personnelDocument === true;
      state.sessionContext = normalizeSession(value.sessionContext);
      state.markedItems = normalizeMarkedItems(value.markedItems);
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
  function normalizeSession(value) {
    if(!value||!['独立模拟','同盟模拟'].includes(value.mode))return null;
    const catalog=window.GARRISON_ENEMIES;
    if(!catalog||!Object.hasOwn(catalog.bosses,value.boss)||!Array.isArray(value.types))return null;
    const types=[...new Set(value.types)];const expected=value.mode==='独立模拟'?2:3;
    if(types.length!==expected||types.some(t=>!Object.hasOwn(catalog.groups,t)))return null;
    if(typeof value.difficulty!=='string'||!(/^(规程等级(?:[1-9]|1\d|20)|标准模拟|险境模拟|绝境模拟|终极模拟|极速模拟)$/.test(value.difficulty)))return null;
    return {mode:value.mode,difficulty:value.difficulty,level:Number.isInteger(value.level)&&value.level>=1&&value.level<=20?value.level:null,boss:value.boss,types};
  }
  function applyRecognition(state,result) {
    const error='识别信息不完整或有冲突，请补充截图并核对后再套用。';
    if(!result||result.complete!==true||result.conflicts?.length)return{ok:false,error};
    const session=normalizeSession(result),rows=result.alliances;
    if(!session||!Array.isArray(rows)||rows.length!==knownAlliances.size)return{ok:false,error};
    if(new Set(rows.map(a=>a?.name)).size!==knownAlliances.size||rows.some(a=>!a||!knownAlliances.has(a.name)||!['active','inactive'].includes(a.state)))return{ok:false,error};
    state.bannedAlliances=rows.filter(a=>a.state==='inactive').map(a=>a.name);
    state.sessionContext=session;
    state.catalogQueries.enemies='';
    return{ok:true};
  }
  window.GARRISON_WORKSPACE = { create, restore, openCompare, closeCompare, isBanned, addMember, removeMember, setTransfer, progress, allianceProgress, applyRecognition, markedItemKey, normalizeMarkedItems, searchMarkedItems, markedItemStatus };
})();
