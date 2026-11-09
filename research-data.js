"use strict";

(() => {
  const modeSource = window.GARRISON_DATA.modeSource;
  const terms = {
    gain: { label: "获得时", kind: "特质时机", description: "查看获得时特质能产生什么收益，以及谁能再触发或增加它的触发次数。", tip: "再触发获得时特质，不等于重新获得一名干员；是否计入获得人数需要另外核对。" },
    restEnd: { label: "休整期结束时", kind: "特质时机", description: "查看在休整期结束时结算的效果，以及能够复制、额外触发这些特质的辅助。", tip: "复制和额外触发各有对象与位置条件；战斗中的额外增层不会自动作用于休整期结算。" },
    obtain: { label: "获得干员", kind: "事件", description: "查看谁直接提供干员、谁按本回合获得人数叠层，以及哪些资源只是间接支持获取。", tip: "先区分获得干员与仅触发其获得时特质；不同获取方式的计数边界仍需按实际规则核对。" },
    burst: { label: "元素损伤爆发", kind: "事件", description: "查看利用元素爆发叠层的干员，并寻找为爆发积累元素损伤的来源。", tip: "造成元素损伤后，需要实际触发爆发；叠层者的观察范围、盟约激活状态和上限也要满足。" },
    fear: { label: "恐惧", kind: "异常状态", description: "查看谁能施加恐惧、谁能利用敌人进入恐惧这一事件。", tip: "技能的常规资料与规程实际技能版本分开记录；标为待核的条目只作为技能线索。" },
    cap: { label: "叠层上限", kind: "机制", description: "查看提高基础上限的辅助，以及额外增层不受上限影响的效果。", tip: "提高上限、增加一次触发的产出、上限外额外增层，是三种不同作用；原有时机限制仍然生效。" }
  };
  const operators = {
    char_2015_dusk: {
      effects: [{ role: "直接叠层", timing: "休整期结束时", basis: "按获得人数叠层", termIds: ["restEnd", "obtain", "cap"], targets: ["炎", "奥术"], normal: { gain: "+2／名", cap: "24 层／回合" }, elite: { gain: "+4／名", cap: "48 层／回合" } }]
    },
    char_4222_taraxa: {
      effects: [{ role: "直接叠层", timing: "休整期结束时", basis: "按获得人数叠层", termIds: ["restEnd", "obtain", "cap"], targets: ["炎", "聚合"], normal: { gain: "+2／名", cap: "16 层／回合" }, elite: { gain: "+4／名", cap: "32 层／回合" } }]
    },
    char_2025_shu: {
      effects: [{ role: "直接叠层", timing: "获得时", basis: "获得本干员时叠层", termIds: ["gain"], targets: ["炎", "远见"], normal: { gain: "炎 +8 · 远见 +4", cap: "原文未注明" }, elite: { gain: "炎 +16 · 远见 +8", cap: "原文未注明" } }]
    },
    char_1040_blaze2: {
      effects: [{ role: "直接叠层", timing: "战斗中", basis: "元素爆发叠层", termIds: ["burst", "cap"], targets: ["炎", "维多利亚"], normal: { gain: "+1／次爆发", cap: "12 层／回合" }, elite: { gain: "+2／次爆发", cap: "24 层／回合" } }]
    },
    char_4133_logos: {
      effects: [
        { role: "直接叠层", timing: "获得时", basis: "获得本干员时叠层", termIds: ["gain"], targets: ["奥术", "远见"], normal: { gain: "奥术 +10 · 远见 +5", cap: "原文未注明" }, elite: { gain: "奥术 +20 · 远见 +10", cap: "原文未注明" } },
        { role: "层数收益", timing: "战斗中", basis: "已有盟约层数提高攻速", termIds: [], targets: ["自身"], normal: { gain: "每 3 层 → 攻速 +1" }, elite: { gain: "每 3 层 → 攻速 +2" } }
      ]
    }
  };

  operators.char_332_archet = {
    effects: [{ role: "直接叠层", category: "定额叠层", timing: "进入休整期时", basis: "指定时点固定增层", termIds: [], targets: ["自身及身前一格干员已激活的盟约"], normal: { gain: "+3／次触发", cap: "原文未注明每回合上限" }, elite: { gain: "+6／次触发", cap: "原文未注明每回合上限" } }]
  };

  function splitTraits(text) {
    let timings = [];
    return text.split(/\n(?=<)|；\n/).map(segment => {
      // 开头的多个时点可以共用一段效果。分号后的续句沿用前一个时点。
      const prefix = segment.match(/^(?:<[^>]+>\s*)+/)?.[0];
      if (prefix) timings = [...prefix.matchAll(/<([^>]+)>/g)].map(match => match[1]);
      return { timings, text: segment.slice(prefix?.length || 0).trim() };
    });
  }

  function traitCategory(type, timings, text) {
    if (type === "特异化" || text.includes("获得特质")) return "特质操作";
    if (/转化.*临时层数.*固定层数/.test(text)) return "层数转化";
    if (/叠层上限\+|层数额外\+|盟约获得强化/.test(text)) return "叠层增幅";
    if (type === "单次叠加" || (type === "持续叠加" && timings.includes("获得时"))) return "获得叠层";
    if (type === "整备能力" || text.includes("合成精锐")) return "资源运营";
    if (type === "作战能力" && /每叠加\d+层/.test(text)) return "层数收益";
    if (type === "作战能力" || text.startsWith("造成的伤害变为弱点伤害")) return "战斗功能";
    return /每|至多|等同|若|同一行/.test(text) ? "条件叠层" : "定额叠层";
  }

  function traitValues(text) {
    const caps = text.match(/(?:每名干员)?(?:每回合|每场战斗)?至多叠加\d+层/g);
    return { text, cap: caps?.join("、") };
  }

  function analyzeTraits(operator) {
    const eliteText = operator.elite?.text;
    const eliteParts = eliteText ? splitTraits(eliteText) : [];
    return splitTraits(operator.ordinary.text).map(({ timings, text }, index) => {
      const termIds = [];
      if (timings.includes("获得时")) termIds.push("gain");
      if (timings.includes("休整期结束时")) termIds.push("restEnd");
      if (/每获得过一名干员|获得一名[^。；\n]*干员|免费特殊招募/.test(text)) termIds.push("obtain");
      if (text.includes("元素损伤爆发")) termIds.push("burst");
      if (text.includes("恐惧")) termIds.push("fear");
      if (/叠层上限|至多叠加/.test(text)) termIds.push("cap");
      const category = traitCategory(operator.abilityType, timings, text);
      return {
        role: category, category, timing: timings.join("／") || "常驻", basis: text, termIds, targets: [],
        normal: traitValues(text), elite: eliteText ? traitValues(eliteParts[index]?.text || eliteText) : null
      };
    });
  }

  for (const operator of window.GARRISON_DATA.operators) {
    operators[operator.id] ||= { effects: analyzeTraits(operator) };
  }
  for (const operator of Object.values(operators)) {
    for (const effect of operator.effects) {
      effect.category ||= effect.role === "直接叠层" ? (effect.timing === "获得时" ? "获得叠层" : "条件叠层") : effect.role;
    }
  }
  const categories = ["获得叠层", "定额叠层", "条件叠层", "叠层增幅", "特质操作", "层数转化", "层数收益", "资源运营", "战斗功能"];
  const entities = {};
  for (const operator of window.GARRISON_DATA.operators) {
    const identity = operator.tier === "special" ? "特殊干员或单位" : `${operator.tier} 阶干员 · 卫戍特质`;
    const body = operator.elite ? `普通：${operator.ordinary.text}\n精锐：${operator.elite.text}` : operator.ordinary.text;
    entities[operator.id] = { name: operator.name, kind: "trait", identity, body, source: modeSource, checked: true };
  }
  Object.assign(entities, {
    saria: { name: "塞雷娅", kind: "trait", identity: "5 阶干员 · 特质复制", body: "身前一格干员若为“休整期结束时”特质，本干员的特质与其相同。", source: modeSource, checked: true },
    suzuran: { name: "铃兰（干员）", kind: "trait", identity: "5 阶干员 · 特质再触发", body: "<进入休整期时>触发身前1／2格的其他干员的“获得时”类效果。", source: modeSource, checked: true },
    jaye: { name: "乌有", kind: "trait", identity: "3 阶干员 · 经济资源", body: "<获得时>获得1／2枚“盟约之币”。盟约之币装备时销毁并获得资金。", source: modeSource, checked: true },
    greyy: { name: "承曦格雷伊", kind: "trait", identity: "2 阶干员 · 获取装备", body: "<获得时>获得1／2件精准狙击镜。", source: modeSource, checked: true },
    closure: { name: "可露希尔", kind: "trait", identity: "5 阶干员 · 获得人数叠层", body: "<休整期结束时>本回合每获得过一名干员，使已激活的投资人层数+2／4（每回合至多叠加16／32层）。", source: modeSource, checked: true },
    highmore: { name: "海沫", kind: "trait", identity: "3 阶干员 · 提高售出价格", body: "<休整期结束时>自身售出价格+1／2（自身售出价格至多为4／8）。", source: modeSource, checked: true },
    yu: { name: "余", kind: "trait", identity: "4 阶干员 · 元素爆发叠层", body: "<战斗中>周围八格每有一名敌人触发元素损伤爆发，使自身已激活的盟约层数+1／2（每回合至多叠加8／16层）。", source: modeSource, checked: true },
    nymph: { name: "妮芙", kind: "trait", identity: "6 阶干员 · 恐惧叠层", body: "<战斗中>攻击范围内每有一名敌人陷入恐惧，使已激活的迅捷层数+4／8（每回合至多叠加20／40层）。", source: modeSource, checked: true },
    gladiia: { name: "歌蕾蒂娅", kind: "trait", identity: "5 阶干员 · 获取干员", body: "普通：<进入休整期时>若同一行有3名干员，获得1个幽灵鲨、安哲拉、深巡或斯卡蒂。精锐：进入休整期时直接获得其中1名。", source: modeSource, checked: true },
    mechanist: { name: "机械师", kind: "trait", identity: "6 阶干员 · 获取干员", body: "普通：<进入休整期时>若同一行至少有三名干员，获得一名当前人数最多盟约的干员。精锐：移除同一行人数条件。", source: modeSource, checked: true },
    mon3tr: { name: "Mon3tr", kind: "trait", identity: "5 阶干员 · 提高叠层上限", body: "<战斗中>周围八格干员每场战斗的叠层上限+30／60%。", source: modeSource, checked: true },
    amiya: { name: "阿米娅（医疗）", kind: "trait", identity: "5 阶干员 · 额外增层", body: "<战斗中>身前一格干员提升盟约层数时，每次提升的层数额外+1／2（不受叠层上限影响）。", source: modeSource, checked: true },
    commandGain: { name: "御守之力", kind: "strategy", identity: "铃兰（开局角色）· 策略／指令", body: "拖拽使用（消耗0）：选择一名我方干员，触发该干员的<获得时>类特质。", source: modeSource, checked: true },
    commandRest: { name: "强制休整", kind: "strategy", identity: "苏苏洛（开局角色）· 策略／指令", body: "拖拽使用（消耗0）：选择一名我方干员，使该干员的<休整期结束时>类特质本回合可以额外触发一次。", source: modeSource, checked: true },
    commandCap: { name: "正直教官", kind: "strategy", identity: "坚雷（开局角色）· 策略／指令", body: "拖拽使用（消耗0）：选择一名我方干员，使其在下场战斗中卫戍能力的叠层上限提升，数量等同于当前回合数。", source: modeSource, checked: true },
    fearCommand: { name: "溃心领域", kind: "strategy", identity: "妮芙（开局角色）· 策略／指令", body: "拖拽使用（消耗0）：选择一个可用地块，战斗开始后首次经过该地块的敌人获得恐惧，持续3秒。每回合有使用次数限制，后续回合升级。", source: modeSource, checked: true },
    investor: { name: "投资人盟约", kind: "alliance", identity: "次要盟约 · 增加触发次数", body: "3投资人：干员的“获得时”类特质每次触发2次。达到100层后每次触发3次。整备区的投资人干员也可用于激活。", source: modeSource, checked: true },
    yan: { name: "炎盟约 · 6 人效果", kind: "alliance", identity: "核心盟约 · 提供元素损伤", body: "战斗开始时，炎干员每次攻击造成攻击力6%的随机元素损伤；全场敌人元素损伤恢复速度增加40%+0.3×层数。", source: modeSource, checked: true },
    blazeSkill: { name: "烛煌 · 沸血燎原", kind: "skill", identity: "干员战斗技能 · 常规技能资料", body: "技能在攻击目标处留下灼烧地段，持续造成法术伤害，并附加灼燃损伤。这里仅收录与元素爆发有关的效果摘要。", source: "https://closure.wiki/zh-cn/operators/blaze-the-igniting-spark", checked: false },
    nymphSkill: { name: "妮芙 · 怵然震爆", kind: "skill", identity: "干员战斗技能 · 常规技能资料", body: "技能命中时施加恐惧，并造成法术伤害与凋亡损伤。这里仅收录与恐惧有关的效果摘要。", source: "https://closure.wiki/zh-cn/operators/nymph", checked: false }
  });
  const relations = [];
  const add = (term, entity, group, reason, conditions) => relations.push({ term, entity, group, reason, conditions });
  for (const id of ["char_2025_shu", "char_4133_logos"]) add("gain", id, "uses", "获得时直接增加对应盟约层数，可以作为获得时再触发的作用对象。", "这里只关联获得时增层效果；逻各斯的战斗中攻速收益是另一段效果。");
  add("gain", "jaye", "uses", "获得时提供盟约之币；再触发该类特质可以继续获得资源。", "需要使用盟约之币才能获得资金；这一步本身不会直接增加盟约层数。");
  add("gain", "greyy", "uses", "获得时提供精准狙击镜，属于装备收益。", "应与叠层收益分开理解。");
  add("gain", "suzuran", "modifies", "在进入休整期时，再触发前方干员的获得时特质。", "作用于身前1／2格的其他干员，需满足站位。");
  add("gain", "commandGain", "modifies", "选择一名干员，触发其获得时特质。", "这是开局角色铃兰的策略，不是干员铃兰的特质。");
  add("gain", "investor", "modifies", "使获得时类特质每次触发2次，达到100层后为3次。", "先满足盟约激活及层数要求；与其他再触发效果的具体结算另按实际规则核对。");
  for (const id of ["char_2015_dusk", "char_4222_taraxa", "closure"]) add("restEnd", id, "uses", "在休整期结束时，按本回合获得的干员人数结算叠层。", "对应盟约需要激活，并受各自基础上限限制。");
  add("restEnd", "highmore", "uses", "在同一时点提高自身售出价格，体现非叠层类收益。", "自身售出价格仍有上限。");
  add("restEnd", "saria", "modifies", "复制身前干员的休整期结束时特质。", "身前一格的特质需符合时机要求；复制后上限是否独立等细节仍需实测。");
  add("restEnd", "commandRest", "modifies", "使选中的休整期结束时特质，本回合额外触发一次。", "选中合适的干员，效果在本回合相应结算时机生效。");
  for (const id of ["char_2015_dusk", "char_4222_taraxa", "closure"]) add("obtain", id, "uses", "本回合获得干员的人数，决定休整期结束时的增层量。", "获得干员与仅再触发获得时特质应分开；不同获取方式的计数边界需要核对。");
  add("obtain", "gladiia", "provides", "在进入休整期时直接获得干员，为获得人数提供来源。", "普通状态要求同一行3名干员；精锐移除这一条件。");
  add("obtain", "mechanist", "provides", "在进入休整期时获得当前人数最多盟约的一名干员。", "普通状态要求同一行至少3名干员；精锐移除这一条件。");
  add("obtain", "jaye", "indirect", "提供盟约之币与资金资源，资金可用于后续购买干员。", "还需使用道具和购买干员等步骤，属于间接支持。");
  add("burst", "char_1040_blaze2", "uses", "观察攻击范围内敌人的元素爆发，给炎、维多利亚叠层。", "爆发发生在攻击范围内、对应盟约已激活；迅捷不在这段特质的增层对象中。");
  add("burst", "yu", "uses", "观察周围八格敌人的元素爆发，为自身已激活盟约叠层。", "需要满足周围八格的范围条件，并遵守每回合上限。");
  add("burst", "yan", "provides", "使炎干员攻击附加随机元素损伤，为爆发积累损伤。", "需要6人效果；造成损伤后仍需实际触发爆发。");
  add("burst", "blazeSkill", "provides", "常规技能能持续提供灼燃损伤，是元素爆发来源的技能线索。", "常规技能效果已核对；规程是否采用该技能及具体参数尚待核对，不作为已确认模式组合。");
  add("fear", "nymph", "uses", "范围内敌人进入恐惧时，为迅捷叠层。", "需要处于攻击范围内，迅捷已激活，并遵守每回合上限。");
  add("fear", "fearCommand", "provides", "在选定地块，使首次经过的敌人受到恐惧。", "地块需可用；只有首次经过触发，且有回合使用次数限制。");
  add("fear", "nymphSkill", "provides", "常规技能直接施加恐惧，可作为提供状态的技能线索。", "规程实际采用的技能与参数尚待核对，不作为已确认模式组合。");
  for (const id of ["char_2015_dusk", "char_4222_taraxa", "char_1040_blaze2"]) add("cap", id, "uses", "这段增层效果明确写有每回合基础上限。", id === "char_1040_blaze2" ? "这是战斗内产层；上限辅助还需满足各自范围与时机。" : "这是休整期结束时结算，不能自动套用只在战斗中生效的上限辅助。");
  add("cap", "mon3tr", "modifies", "按百分比提高周围干员每场战斗的叠层上限。", "战斗中、周围八格；不据此认为能提高夕或风絮的休整期上限。");
  add("cap", "commandCap", "modifies", "为选中干员下一场战斗的卫戍能力提高叠层上限。", "增加量等于当前回合数；作用于下场战斗。");
  add("cap", "amiya", "modifies", "给身前干员每次增层追加层数，追加部分不受叠层上限影响。", "只在战斗中，需位于身前一格；属于上限外增层，不是提高基础上限。");
  // 保留已写明具体联动条件的条目。名单扩充后，同一干员在各词条仍共用一个联动条目。
  const curatedEntities = {
    "塞雷娅": "saria", "铃兰": "suzuran", "乌有": "jaye", "承曦格雷伊": "greyy",
    "可露希尔": "closure", "海沫": "highmore", "余": "yu", "妮芙": "nymph",
    "歌蕾蒂娅": "gladiia", "机械师": "mechanist", "Mon3tr": "mon3tr", "阿米娅": "amiya"
  };
  for (const operator of window.GARRISON_DATA.operators) {
    const entity = curatedEntities[operator.name] || operator.id;
    const effects = operators[operator.id].effects;
    const linked = new Set(relations.filter(relation => relation.entity === entity).map(relation => relation.term));
    for (const effect of effects) {
      if (!effect.normal.text) continue;
      if (effects.length === 1) effect.termIds = [...new Set([...effect.termIds, ...linked])];
      for (const term of effect.termIds) {
        if (linked.has(term)) continue;
        let group = "uses";
        if (term === "cap" && effect.category === "叠层增幅") group = "modifies";
        if (term === "obtain" && effect.normal.text.includes("免费特殊招募")) group = "indirect";
        else if (term === "obtain" && /获得一名[^。；\n]*干员/.test(effect.normal.text)) group = "provides";
        add(term, entity, group, effect.normal.text, "触发时点为" + effect.timing + "。精锐效果见完整特质。");
        linked.add(term);
      }
    }
  }
  window.GARRISON_RESEARCH = { terms, operators, entities, relations, categories };
})();
