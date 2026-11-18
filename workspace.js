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
    if(!result||result.conflicts?.length&&!Object.keys(result.conflictFields||{}).length||!Array.isArray(result.alliances))return 'unknown';
    const states=new Map();
    for(const row of result.alliances){if(!knownAlliances.has(row.name))continue;const status=!result.conflictFields?.alliances?.includes(row.name)&&['active','inactive'].includes(row.state)?row.state:'unknown';states.set(row.name,states.has(row.name)&&states.get(row.name)!==status?'unknown':status);}
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
      bannedAlliances: [], unconfirmedAlliances: [], hideBannedOperators: false, personnelDocument: false, sessionContext: null, markedItems: defaultMarkedItems(),
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
      state.unconfirmedAlliances = [...new Set(strings(value.unconfirmedAlliances).filter(name => knownAlliances.has(name)))];
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
  function operatorStatus(operator,state) {
    const pending=state.unconfirmedAlliances||[];
    const confirmed=state.bannedAlliances.filter(name=>!pending.includes(name));
    if(isBanned(operator,confirmed))return 'banned';
    return isBanned(operator,[...confirmed,...pending])?'unknown':'available';
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
    if(!value||typeof value!=='object')return null;
    const catalog=window.GARRISON_ENEMIES;
    if(!catalog)return null;
    const mode=['独立模拟','同盟模拟'].includes(value.mode)?value.mode:null;
    const difficulty=validDifficulty(value.difficulty)?value.difficulty:null;
    const boss=Object.hasOwn(catalog.bosses,value.boss)?value.boss:null;
    const types=[...new Set(strings(value.types).filter(t=>Object.hasOwn(catalog.groups,t)))].slice(0,3);
    if(!boss&&!types.length&&!mode&&!difficulty)return null;
    const expected=mode==='独立模拟'?2:mode==='同盟模拟'?3:0;
    return {mode,difficulty,level:Number.isInteger(value.level)&&value.level>=1&&value.level<=20?value.level:null,boss,types,
      typesComplete:value.typesComplete!==false&&!value.retainedMode&&Boolean(expected&&types.length===expected),retainedBoss:value.retainedBoss===true,retainedTypes:value.retainedTypes===true,
      retainedMode:value.retainedMode===true,retainedDifficulty:value.retainedDifficulty===true,retainedLevel:value.retainedLevel===true};
  }
  function validDifficulty(value){return typeof value==='string'&&/^(规程等级(?:[1-9]|1\d|20)|标准模拟|险境模拟|绝境模拟|终极模拟|极速模拟)$/.test(value);}
  function recognitionPlan(raw){
    const error='没有可套用的确认内容，请先修正／补全或补充截图。';
    const invalid=()=>({ok:false,error:'识别结果包含无效字段，请重新核对。'});
    if(!raw||typeof raw!=='object'||Array.isArray(raw))return{ok:false,error};
    const catalog=window.GARRISON_ENEMIES;if(!catalog)return{ok:false,error};
    const cf=raw.conflictFields||{};
    if(typeof cf!=='object'||Array.isArray(cf)||raw.conflicts?.length&&!Object.keys(cf).length)return{ok:false,error:'图片信息冲突，请先修正／补全对应项目。'};
    if(cf.alliances!==undefined&&!Array.isArray(cf.alliances))return invalid();
    if(['mode','difficulty','level','boss','types'].some(key=>cf[key]!==undefined&&typeof cf[key]!=='boolean'))return invalid();
    if(raw.mode!=null&&raw.mode!==''&&!['独立模拟','同盟模拟'].includes(raw.mode))return invalid();
    if(raw.difficulty!=null&&raw.difficulty!==''&&!validDifficulty(raw.difficulty))return invalid();
    if(raw.boss!=null&&raw.boss!==''&&!Object.hasOwn(catalog.bosses,raw.boss))return invalid();
    if(raw.types!==undefined&&(!Array.isArray(raw.types)||raw.types.some(t=>!Object.hasOwn(catalog.groups,t))))return invalid();
    if(raw.alliances!==undefined&&!Array.isArray(raw.alliances))return invalid();
    const rows=raw.alliances||[],pending=strings(cf.alliances);
    if(rows.some(a=>!a||!knownAlliances.has(a.name)||!['active','inactive','uncertain'].includes(a.state))||new Set(rows.map(a=>a.name)).size!==rows.length||pending.some(n=>!knownAlliances.has(n)))return invalid();
    const alliances=rows.filter(a=>a.state!=='uncertain'&&!pending.includes(a.name)).map(a=>({name:a.name,state:a.state}));
    const unresolvedAlliances=[...knownAlliances].filter(n=>!alliances.some(a=>a.name===n));
    const mode=!cf.mode&&raw.mode||null,difficulty=!cf.difficulty&&raw.difficulty||null;
    const expected=mode==='独立模拟'?2:mode==='同盟模拟'?3:0;
    const candidates=[...new Set(raw.types||[])];
    const types=!cf.types&&candidates.length&&candidates.length<=3&&(!expected||candidates.length<=expected)?candidates:null;
    const boss=!cf.boss&&raw.boss||null;
    const ok=Boolean(alliances.length||boss||types||mode||difficulty);
    return{ok,error:ok?'':error,alliances,unresolvedAlliances,mode,difficulty,boss,types,expected,
      level:!cf.level&&Number.isInteger(raw.level)&&raw.level>=1&&raw.level<=20?raw.level:null,
      typesComplete:Boolean(types&&expected&&types.length===expected),partial:Boolean(unresolvedAlliances.length||!boss||!types||!expected||types.length!==expected)};
  }
  function applyRecognition(state,result) {
    const plan=recognitionPlan(result);if(!plan.ok)return plan;
    const resolved=new Set(plan.alliances.map(a=>a.name)),old=normalizeSession(state.sessionContext);
    state.bannedAlliances=[...state.bannedAlliances.filter(n=>!resolved.has(n)),...plan.alliances.filter(a=>a.state==='inactive').map(a=>a.name)];
    state.unconfirmedAlliances=plan.unresolvedAlliances;
    state.sessionContext=normalizeSession({mode:plan.mode||old?.mode||null,difficulty:plan.difficulty||old?.difficulty||null,level:plan.difficulty?plan.level:plan.level??old?.level??null,
      boss:plan.boss||old?.boss||null,types:plan.types||old?.types||[],typesComplete:plan.typesComplete,
      retainedBoss:!plan.boss&&Boolean(old?.boss),retainedTypes:!plan.types&&Boolean(old?.types.length),
      retainedMode:!plan.mode&&Boolean(old?.mode),retainedDifficulty:!plan.difficulty&&Boolean(old?.difficulty),retainedLevel:!plan.difficulty&&!plan.level&&Boolean(old?.level)});
    state.catalogQueries.enemies='';
    return{ok:true,plan,session:state.sessionContext};
  }
  window.GARRISON_WORKSPACE = { create, restore, openCompare, closeCompare, isBanned,operatorStatus, addMember, removeMember, setTransfer, progress, allianceProgress, applyRecognition,recognitionPlan, markedItemKey, normalizeMarkedItems, searchMarkedItems, markedItemStatus };
})();
