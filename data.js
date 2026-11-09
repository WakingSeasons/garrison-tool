/* 参战干员：可露希尔 Wiki《卫戍协议：规程》，与规程资料核对。
 * 基础档案链接来自 PRTS，职业与分支来自干员档案。资料日期：2026-11-09。
 */
window.GARRISON_DATA = {
  coreAlliances: ["炎", "萨尔贡", "维多利亚", "谢拉格", "阿戈尔", "叙拉古", "卡西米尔", "乌萨斯", "伊比利亚", "莱塔尼亚"],
  addonAlliances: ["精准", "迅捷", "灵巧", "坚守", "助力", "远见", "奇迹", "投资人", "突袭", "不屈", "调和", "协防干员", "独行", "绝技", "聚合", "奥术"],
  tiers: [1, 2, 3, 4, 5, 6, "special"],
  // PRTS《卫戍协议·规程》的等阶与养成状态表。
  trainingByTier: {
    1: { ordinary: "精一55级 · 技能4级", elite: "精二50级 · 技能7级 · 一级模组" },
    2: { ordinary: "精一60级 · 技能4级", elite: "精二55级 · 技能7级 · 一级模组" },
    3: { ordinary: "精二1级 · 技能4级", elite: "精二60级 · 技能7级 · 一级模组" },
    4: { ordinary: "精二1级 · 技能4级", elite: "精二60级 · 技能7级 · 一级模组" },
    5: { ordinary: "精二1级 · 技能4级", elite: "精二60级 · 技能7级 · 一级模组" },
    6: { ordinary: "精二1级 · 技能4级", elite: "精二60级 · 技能7级 · 三级模组" }
  },
  operators: [
    {
      id: "char_4207_branch", name: "折桠", englishName: "Веточки", tier: 1,
      alliances: ["乌萨斯", "不屈"], profession: "重装", branch: "不屈者", position: "近战位",
      avatar: "./assets/garrison/char_4207_branch.webp", abilityType: "持续叠加",
      ordinary: { text: "<进入休整期时>转化2层【乌萨斯】临时层数为固定层数" },
      elite: { text: "<进入休整期时>转化4层【乌萨斯】临时层数为固定层数" },
      profileSource: "https://prts.wiki/w/折桠"
    },
    {
      id: "char_127_estell", name: "艾丝黛尔", englishName: "Estelle", tier: 1,
      alliances: ["萨尔贡", "独行"], profession: "近卫", branch: "强攻手", position: "近战位",
      avatar: "./assets/garrison/char_127_estell.webp", abilityType: "持续叠加",
      ordinary: { text: "<战斗中>每次开启技能时使已激活的【萨尔贡】层数+1（每回合至多叠加2层）" },
      elite: { text: "<战斗中>每次开启技能时使已激活的【萨尔贡】层数+2（每回合至多叠加4层）" },
      profileSource: "https://prts.wiki/w/艾丝黛尔"
    },
    {
      id: "char_143_ghost", name: "幽灵鲨", englishName: "Specter", tier: 1,
      alliances: ["阿戈尔"], profession: "近卫", branch: "强攻手", position: "近战位",
      avatar: "./assets/garrison/char_143_ghost.webp", abilityType: "持续叠加",
      ordinary: { text: "<战斗中>部署时使已激活的【阿戈尔】层数+1（每回合至多叠加1层）" },
      elite: { text: "<战斗中>部署时使已激活的【阿戈尔】层数+2（每回合至多叠加2层）" },
      profileSource: "https://prts.wiki/w/幽灵鲨"
    },
    {
      id: "char_496_wildmn", name: "野鬃", englishName: "Wild Mane", tier: 1,
      alliances: ["卡西米尔", "助力"], profession: "先锋", branch: "冲锋手", position: "近战位",
      avatar: "./assets/garrison/char_496_wildmn.webp", abilityType: "持续叠加",
      ordinary: { text: "<战斗中>部署时使已激活的【卡西米尔】层数+1（每回合至多叠加2层）" },
      elite: { text: "<战斗中>部署时使已激活的【卡西米尔】层数+2（每回合至多叠加4层）" },
      profileSource: "https://prts.wiki/w/野鬃"
    },
    {
      id: "char_185_frncat", name: "慕斯", englishName: "Mousse", tier: 1,
      alliances: ["维多利亚"], profession: "近卫", branch: "术战者", position: "近战位",
      avatar: "./assets/garrison/char_185_frncat.webp", abilityType: "持续叠加",
      ordinary: { text: "<休整期结束时>使已激活的【维多利亚】层数+1" },
      elite: { text: "<休整期结束时>使已激活的【维多利亚】层数+2" },
      profileSource: "https://prts.wiki/w/慕斯"
    },
    {
      id: "char_199_yak", name: "角峰", englishName: "Matterhorn", tier: 1,
      alliances: ["谢拉格", "坚守"], profession: "重装", branch: "铁卫", position: "近战位",
      avatar: "./assets/garrison/char_199_yak.webp", abilityType: "作战能力",
      ordinary: { text: "<战斗中>对每名敌人首次造成伤害时使目标陷入2秒寒冷" },
      elite: { text: "<战斗中>对每名敌人首次造成伤害时使目标陷入4秒寒冷" },
      profileSource: "https://prts.wiki/w/角峰"
    },
    {
      id: "char_367_swllow", name: "灰喉", englishName: "GreyThroat", tier: 1,
      alliances: ["精准"], profession: "狙击", branch: "速射手", position: "远程位",
      avatar: "./assets/garrison/char_367_swllow.webp", abilityType: "单次叠加",
      ordinary: { text: "<获得时>【精准】层数+2" },
      elite: { text: "<获得时>【精准】层数+4" },
      profileSource: "https://prts.wiki/w/灰喉"
    },
    {
      id: "char_469_indigo", name: "深靛", englishName: "Indigo", tier: 1,
      alliances: ["伊比利亚"], profession: "术师", branch: "秘术师", position: "远程位",
      avatar: "./assets/garrison/char_469_indigo.webp", abilityType: "持续叠加",
      ordinary: { text: "<休整期结束时>使已激活的【伊比利亚】层数+2" },
      elite: { text: "<休整期结束时>使已激活的【伊比利亚】层数+4" },
      profileSource: "https://prts.wiki/w/深靛"
    },
    {
      id: "char_328_cammou", name: "卡达", englishName: "Click", tier: 1,
      alliances: ["奥术"], profession: "术师", branch: "驭械术师", position: "远程位",
      avatar: "./assets/garrison/char_328_cammou.webp", abilityType: "持续叠加",
      ordinary: { text: "<休整期结束时>使已激活的【奥术】层数+1" },
      elite: { text: "<休整期结束时>使已激活的【奥术】层数+2" },
      profileSource: "https://prts.wiki/w/卡达"
    },
    {
      id: "char_4166_varkis", name: "摆渡人", englishName: "Varkáris", tier: 1,
      alliances: ["坚守", "不屈"], profession: "近卫", branch: "强攻手", position: "近战位",
      avatar: "./assets/garrison/char_4166_varkis.webp", abilityType: "单次叠加",
      ordinary: { text: "<获得时>【坚守】【不屈】层数+1" },
      elite: { text: "<获得时>【坚守】【不屈】层数+2" },
      profileSource: "https://prts.wiki/w/摆渡人"
    },
    {
      id: "char_492_quercu", name: "夏栎", englishName: "Quercus", tier: 1,
      alliances: ["助力"], profession: "辅助", branch: "护佑者", position: "远程位",
      avatar: "./assets/garrison/char_492_quercu.webp", abilityType: "持续叠加",
      ordinary: { text: "<休整期结束时>使当前已激活且层数最多的盟约层数+1（此干员在整备区也生效）" },
      elite: { text: "<休整期结束时>使当前已激活且层数最多的盟约层数+2（此干员在整备区也生效）" },
      profileSource: "https://prts.wiki/w/夏栎"
    },
    {
      id: "char_347_jaksel", name: "杰克", englishName: "Jackie", tier: 1,
      alliances: ["突袭"], profession: "近卫", branch: "斗士", position: "近战位",
      avatar: "./assets/garrison/char_347_jaksel.webp", abilityType: "作战能力",
      ordinary: { text: "<战斗中>造成的伤害变为弱点伤害（根据敌人的防御力与法术抗性变换伤害类型）" },
      elite: { text: "<战斗中>造成的伤害变为弱点伤害（根据敌人的防御力与法术抗性变换伤害类型）" },
      profileSource: "https://prts.wiki/w/杰克"
    },
    {
      id: "char_193_frostl", name: "霜叶", englishName: "Frostleaf", tier: 1,
      alliances: ["灵巧"], profession: "近卫", branch: "领主", position: "近战位",
      avatar: "./assets/garrison/char_193_frostl.webp", abilityType: "单次叠加",
      ordinary: { text: "<获得时>【灵巧】层数+2" },
      elite: { text: "<获得时>【灵巧】层数+4" },
      profileSource: "https://prts.wiki/w/霜叶"
    },
    {
      id: "char_325_bison", name: "拜松", englishName: "Bison", tier: 1,
      alliances: ["炎"], profession: "重装", branch: "铁卫", position: "近战位",
      avatar: "./assets/garrison/char_325_bison.webp", abilityType: "单次叠加",
      ordinary: { text: "<获得时>【炎】层数+2" },
      elite: { text: "<获得时>【炎】层数+4" },
      profileSource: "https://prts.wiki/w/拜松"
    },
    {
      id: "char_4041_chnut", name: "褐果", englishName: "Chestnut", tier: 1,
      alliances: ["聚合"], profession: "医疗", branch: "行医", position: "远程位",
      avatar: "./assets/garrison/char_4041_chnut.webp", abilityType: "单次叠加",
      ordinary: { text: "<获得时>【聚合】层数+2" },
      elite: { text: "<获得时>【聚合】层数+4" },
      profileSource: "https://prts.wiki/w/褐果"
    },
    {
      id: "char_194_leto", name: "烈夏", englishName: "Лето", tier: 1,
      alliances: ["乌萨斯"], profession: "近卫", branch: "领主", position: "近战位",
      avatar: "./assets/garrison/char_194_leto.webp", abilityType: "持续叠加",
      ordinary: { text: "<战斗开始时>使已激活的【乌萨斯】临时层数+4" },
      elite: { text: "<战斗开始时>使已激活的【乌萨斯】临时层数+8" },
      profileSource: "https://prts.wiki/w/烈夏"
    },
    {
      id: "char_219_meteo", name: "陨星", englishName: "Meteorite", tier: 1,
      alliances: ["迅捷"], profession: "狙击", branch: "炮手", position: "远程位",
      avatar: "./assets/garrison/char_219_meteo.webp", abilityType: "持续叠加",
      ordinary: { text: "<战斗中>每次开启技能时使已激活的【迅捷】层数+1（每回合至多叠加2层）" },
      elite: { text: "<战斗中>每次开启技能时使已激活的【迅捷】层数+2（每回合至多叠加4层）" },
      profileSource: "https://prts.wiki/w/陨星"
    },
    {
      id: "char_140_whitew", name: "拉普兰德", englishName: "Lappland", tier: 1,
      alliances: ["叙拉古"], profession: "近卫", branch: "领主", position: "近战位",
      avatar: "./assets/garrison/char_140_whitew.webp", abilityType: "单次叠加",
      ordinary: { text: "<获得时>【叙拉古】层数+2" },
      elite: { text: "<获得时>【叙拉古】层数+4" },
      profileSource: "https://prts.wiki/w/拉普兰德"
    },
    {
      id: "char_183_skgoat", name: "地灵", englishName: "Earthspirit", tier: 1,
      alliances: ["莱塔尼亚", "独行"], profession: "辅助", branch: "凝滞师", position: "远程位",
      avatar: "./assets/garrison/char_183_skgoat.webp", abilityType: "持续叠加",
      ordinary: { text: "<战斗中>攻击范围内每有一名敌人被击倒使已激活的【莱塔尼亚】层数+1（每回合至多叠加1层）" },
      elite: { text: "<战斗中>攻击范围内每有一名敌人被击倒使已激活的【莱塔尼亚】层数+2（每回合至多叠加2层）" },
      profileSource: "https://prts.wiki/w/地灵"
    },
    {
      id: "char_499_kaitou", name: "折光", englishName: "Diamante", tier: 2,
      alliances: ["莱塔尼亚"], profession: "术师", branch: "本源术师", position: "远程位",
      avatar: "./assets/garrison/char_499_kaitou.webp", abilityType: "持续叠加",
      ordinary: { text: "<休整期结束时>使已激活的【莱塔尼亚】层数+4" },
      elite: { text: "<休整期结束时>使已激活的【莱塔尼亚】层数+8" },
      profileSource: "https://prts.wiki/w/折光"
    },
    {
      id: "char_129_bluep", name: "蓝毒", englishName: "Blue Poison", tier: 2,
      alliances: ["伊比利亚"], profession: "狙击", branch: "速射手", position: "远程位",
      avatar: "./assets/garrison/char_129_bluep.webp", abilityType: "作战能力",
      ordinary: { text: "<战斗中>【伊比利亚】每叠加2层，本干员攻击力+1%" },
      elite: { text: "<战斗中>【伊比利亚】每叠加1层，本干员攻击力+1%" },
      profileSource: "https://prts.wiki/w/蓝毒"
    },
    {
      id: "char_381_bubble", name: "泡泡", englishName: "Bubble", tier: 2,
      alliances: ["萨尔贡", "坚守"], profession: "重装", branch: "铁卫", position: "近战位",
      avatar: "./assets/garrison/char_381_bubble.webp", abilityType: "持续叠加",
      ordinary: { text: "<战斗中>每次开启技能时使已激活的【萨尔贡】【坚守】层数+2（每回合至多叠加4层）" },
      elite: { text: "<战斗中>每次开启技能时使已激活的【萨尔贡】【坚守】层数+4（每回合至多叠加8层）" },
      profileSource: "https://prts.wiki/w/泡泡"
    },
    {
      id: "char_4139_papyrs", name: "莎草", englishName: "Papyrus", tier: 2,
      alliances: ["萨尔贡", "聚合"], profession: "医疗", branch: "链愈师", position: "远程位",
      avatar: "./assets/garrison/char_4139_papyrs.webp", abilityType: "作战能力",
      ordinary: { text: "<战斗中>每次开启技能时使身前一格干员回复2点技力" },
      elite: { text: "<战斗中>每次开启技能时使身前一格干员回复4点技力" },
      profileSource: "https://prts.wiki/w/莎草"
    },
    {
      id: "char_4211_snhunt", name: "雪猎", englishName: "Snow Hunter", tier: 2,
      alliances: ["谢拉格", "精准"], profession: "狙击", branch: "猎手", position: "远程位",
      avatar: "./assets/garrison/char_4211_snhunt.webp", abilityType: "单次叠加",
      ordinary: { text: "<获得时>【谢拉格】【精准】层数+4" },
      elite: { text: "<获得时>【谢拉格】【精准】层数+8" },
      profileSource: "https://prts.wiki/w/雪猎"
    },
    {
      id: "char_237_gravel", name: "砾", englishName: "Gravel", tier: 2,
      alliances: ["卡西米尔", "不屈"], profession: "特种", branch: "处决者", position: "近战位",
      avatar: "./assets/garrison/char_237_gravel.webp", abilityType: "持续叠加",
      ordinary: { text: "<战斗中>部署时使已激活的【卡西米尔】【不屈】层数+2（每场战斗至多叠加12层）" },
      elite: { text: "<战斗中>部署时使已激活的【卡西米尔】【不屈】层数+4（每场战斗至多叠加24层）" },
      profileSource: "https://prts.wiki/w/砾"
    },
    {
      id: "char_4031_liesel", name: "复奏", englishName: "Ripresa", tier: 2,
      alliances: ["莱塔尼亚", "叙拉古", "奇迹"], profession: "术师", branch: "扩散术师", position: "远程位",
      avatar: "./assets/garrison/char_4031_liesel.webp", abilityType: "持续叠加",
      ordinary: { text: "<刷新时>若为本回合首次主动刷新，使已激活的【莱塔尼亚】【叙拉古】层数+2（此干员在整备区也生效）" },
      elite: { text: "<刷新时>若为本回合首次主动刷新，使已激活的【叙拉古】【莱塔尼亚】层数+4（此干员在整备区也生效）" },
      profileSource: "https://prts.wiki/w/复奏"
    },
    {
      id: "char_346_aosta", name: "奥斯塔", englishName: "Aosta", tier: 2,
      alliances: ["叙拉古"], profession: "狙击", branch: "散射手", position: "远程位",
      avatar: "./assets/garrison/char_346_aosta.webp", abilityType: "整备能力",
      ordinary: { text: "<获得时>获得一次免费刷新" },
      elite: { text: "<获得时>获得两次免费刷新" },
      profileSource: "https://prts.wiki/w/奥斯塔"
    },
    {
      id: "char_4198_christ", name: "Miss.Christine", englishName: "Miss.Christine", tier: 2,
      alliances: ["维多利亚", "奥术"], profession: "术师", branch: "本源术师", position: "远程位",
      avatar: "./assets/garrison/char_4198_christ.webp", abilityType: "持续叠加",
      ordinary: { text: "<休整期结束时>使已激活的【维多利亚】【奥术】层数+3" },
      elite: { text: "<休整期结束时>使已激活的【维多利亚】【奥术】层数+6" },
      profileSource: "https://prts.wiki/w/Miss.Christine"
    },
    {
      id: "char_4114_harold", name: "哈洛德", englishName: "Harold", tier: 2,
      alliances: ["维多利亚", "谢拉格"], profession: "医疗", branch: "行医", position: "远程位",
      avatar: "./assets/garrison/char_4114_harold.webp", abilityType: "作战能力",
      ordinary: { text: "<战斗中>【维多利亚】【谢拉格】每叠加5层，本干员攻击力+1%" },
      elite: { text: "<战斗中>【维多利亚】【谢拉格】每叠加5层，本干员攻击力+2%" },
      profileSource: "https://prts.wiki/w/哈洛德"
    },
    {
      id: "char_4165_ctrail", name: "云迹", englishName: "Contrail", tier: 2,
      alliances: ["灵巧", "奇迹"], profession: "特种", branch: "巡空者", position: "近战位",
      avatar: "./assets/garrison/char_4165_ctrail.webp", abilityType: "持续叠加",
      ordinary: { text: "<战斗中>每次开启技能时使自身已激活的盟约层数+3（每回合至多叠加6层）" },
      elite: { text: "<战斗中>每次开启技能时使自身已激活的盟约层数+6（每回合至多叠加12层）" },
      profileSource: "https://prts.wiki/w/云迹"
    },
    {
      id: "char_150_snakek", name: "蛇屠箱", englishName: "Cuora", tier: 2,
      alliances: ["坚守"], profession: "重装", branch: "铁卫", position: "近战位",
      avatar: "./assets/garrison/char_150_snakek.webp", abilityType: "持续叠加",
      ordinary: { text: "<休整期结束时>使已激活的【坚守】层数+4" },
      elite: { text: "<休整期结束时>使已激活的【坚守】层数+8" },
      profileSource: "https://prts.wiki/w/蛇屠箱"
    },
    {
      id: "char_258_podego", name: "波登可", englishName: "Podenco", tier: 2,
      alliances: ["聚合", "迅捷"], profession: "辅助", branch: "凝滞师", position: "远程位",
      avatar: "./assets/garrison/char_258_podego.webp", abilityType: "整备能力",
      ordinary: { text: "<售出时>下回合额外获得1资金" },
      elite: { text: "<售出时>下回合额外获得2资金" },
      profileSource: "https://prts.wiki/w/波登可"
    },
    {
      id: "char_1027_greyy2", name: "承曦格雷伊", englishName: "Greyy the Lightningbearer", tier: 2,
      alliances: ["精准", "灵巧"], profession: "狙击", branch: "投掷手", position: "远程位",
      avatar: "./assets/garrison/char_1027_greyy2.webp", abilityType: "整备能力",
      ordinary: { text: "<获得时>获得一件精准狙击镜" },
      elite: { text: "<获得时>获得两件精准狙击镜" },
      profileSource: "https://prts.wiki/w/承曦格雷伊"
    },
    {
      id: "char_4151_tinman", name: "锡人", englishName: "Tin Man", tier: 2,
      alliances: ["投资人"], profession: "特种", branch: "炼金师", position: "远程位",
      avatar: "./assets/garrison/char_4151_tinman.webp", abilityType: "单次叠加",
      ordinary: { text: "<获得时>【投资人】层数+4" },
      elite: { text: "<获得时>【投资人】层数+8" },
      profileSource: "https://prts.wiki/w/锡人"
    },
    {
      id: "char_337_utage", name: "宴", englishName: "Utage", tier: 2,
      alliances: ["不屈"], profession: "近卫", branch: "武者", position: "近战位",
      avatar: "./assets/garrison/char_337_utage.webp", abilityType: "单次叠加",
      ordinary: { text: "<获得时>【不屈】层数+4" },
      elite: { text: "<获得时>【不屈】层数+8" },
      profileSource: "https://prts.wiki/w/宴"
    },
    {
      id: "char_4147_mitm", name: "渡桥", englishName: "Mitm", tier: 2,
      alliances: ["远见"], profession: "先锋", branch: "战术家", position: "远程位",
      avatar: "./assets/garrison/char_4147_mitm.webp", abilityType: "持续叠加",
      ordinary: { text: "<休整期结束时>使自身及身前一格干员已激活的盟约层数+2" },
      elite: { text: "<休整期结束时>使自身及身前一格干员已激活的盟约层数+4" },
      profileSource: "https://prts.wiki/w/渡桥"
    },
    {
      id: "char_4221_ju", name: "矩", englishName: "Ju", tier: 2,
      alliances: ["炎"], profession: "狙击", branch: "攻城手", position: "远程位",
      avatar: "./assets/garrison/char_4221_ju.webp", abilityType: "单次叠加",
      ordinary: { text: "<获得时>获得等同于当前调度中心等级的【炎】层数" },
      elite: { text: "<获得时>获得等同于当前调度中心等级两倍的【炎】层数" },
      profileSource: "https://prts.wiki/w/矩"
    },
    {
      id: "char_274_astesi", name: "星极", englishName: "Astesia", tier: 2,
      alliances: ["奇迹"], profession: "近卫", branch: "术战者", position: "近战位",
      avatar: "./assets/garrison/char_274_astesi.webp", abilityType: "作战能力",
      ordinary: { text: "只需两名本干员即可合成精锐" },
      elite: { text: "只需两名本干员即可合成精锐" },
      profileSource: "https://prts.wiki/w/星极"
    },
    {
      id: "char_4163_rosesa", name: "瑰盐", englishName: "Rose Salt", tier: 2,
      alliances: ["伊比利亚", "聚合"], profession: "医疗", branch: "群愈师", position: "远程位",
      avatar: "./assets/garrison/char_4163_rosesa.webp", abilityType: "作战能力",
      ordinary: { text: "<战斗中>【伊比利亚】每叠加3层，本干员攻击力+1%" },
      elite: { text: "<战斗中>【伊比利亚】每叠加3层，本干员攻击力+2%" },
      profileSource: "https://prts.wiki/w/瑰盐"
    },
    {
      id: "char_195_glassb", name: "真理", englishName: "Истина", tier: 2,
      alliances: ["乌萨斯"], profession: "辅助", branch: "凝滞师", position: "远程位",
      avatar: "./assets/garrison/char_195_glassb.webp", abilityType: "整备能力",
      ordinary: { text: "购买价格为1" },
      elite: { text: "购买价格为1" },
      profileSource: "https://prts.wiki/w/真理"
    },
    {
      id: "char_333_sidero", name: "铸铁", englishName: "Sideroca", tier: 2,
      alliances: ["突袭"], profession: "近卫", branch: "术战者", position: "近战位",
      avatar: "./assets/garrison/char_333_sidero.webp", abilityType: "持续叠加",
      ordinary: { text: "<休整期结束时>使已激活的【突袭】层数+3" },
      elite: { text: "<休整期结束时>使已激活的【突袭】层数+6" },
      profileSource: "https://prts.wiki/w/铸铁"
    },
    {
      id: "char_135_halo", name: "星源", englishName: "Astgenne", tier: 2,
      alliances: ["助力"], profession: "术师", branch: "链术师", position: "远程位",
      avatar: "./assets/garrison/char_135_halo.webp", abilityType: "持续叠加",
      ordinary: { text: "<休整期结束时>使当前已激活且层数最多的盟约层数+2（此干员在整备区也生效）" },
      elite: { text: "<休整期结束时>使当前已激活且层数最多的盟约层数+4（此干员在整备区也生效）" },
      profileSource: "https://prts.wiki/w/星源"
    },
    {
      id: "char_218_cuttle", name: "安哲拉", englishName: "Andreana", tier: 2,
      alliances: ["阿戈尔", "助力"], profession: "狙击", branch: "神射手", position: "远程位",
      avatar: "./assets/garrison/char_218_cuttle.webp", abilityType: "持续叠加",
      ordinary: { text: "<战斗中>每击倒一名敌人或我方干员使已激活的【阿戈尔】【助力】层数+3（每回合至多叠加9层）" },
      elite: { text: "<战斗中>每击倒一名敌人或我方干员使已激活的【阿戈尔】【助力】层数+6（每回合至多叠加18层）" },
      profileSource: "https://prts.wiki/w/安哲拉"
    },
    {
      id: "char_4047_pianst", name: "车尔尼", englishName: "Czerny", tier: 3,
      alliances: ["莱塔尼亚", "坚守"], profession: "重装", branch: "驭法铁卫", position: "近战位",
      avatar: "./assets/garrison/char_4047_pianst.webp", abilityType: "整备能力",
      ordinary: { text: "<获得时>获得一件“莱塔尼亚小鼓”" },
      elite: { text: "<获得时>获得两件“莱塔尼亚小鼓”" },
      profileSource: "https://prts.wiki/w/车尔尼"
    },
    {
      id: "char_426_billro", name: "卡涅利安", englishName: "Carnelian", tier: 3,
      alliances: ["莱塔尼亚", "萨尔贡", "迅捷"], profession: "术师", branch: "阵法术师", position: "远程位",
      avatar: "./assets/garrison/char_426_billro.webp", abilityType: "整备能力",
      ordinary: { text: "<获得时>获得一件“迅捷作战粮”" },
      elite: { text: "<获得时>获得两件“迅捷作战粮”" },
      profileSource: "https://prts.wiki/w/卡涅利安"
    },
    {
      id: "char_4224_turdus", name: "乌啾", englishName: "Укусик", tier: 3,
      alliances: ["乌萨斯", "聚合"], profession: "医疗", branch: "链愈师", position: "远程位",
      avatar: "./assets/garrison/char_4224_turdus.webp", abilityType: "持续叠加",
      ordinary: { text: "<进入休整期时>场上每有一名【乌萨斯】干员，转化1层【乌萨斯】临时层数为固定层数" },
      elite: { text: "<进入休整期时>场上每有一名【乌萨斯】干员，转化2层【乌萨斯】临时层数为固定层数" },
      profileSource: "https://prts.wiki/w/乌啾"
    },
    {
      id: "char_4066_highmo", name: "海沫", englishName: "Highmore", tier: 3,
      alliances: ["伊比利亚", "不屈"], profession: "近卫", branch: "收割者", position: "近战位",
      avatar: "./assets/garrison/char_4066_highmo.webp", abilityType: "整备能力",
      ordinary: { text: "<休整期结束时>自身售出价格+1（自身售出价格至多为4）" },
      elite: { text: "<休整期结束时>自身售出价格+2（自身售出价格至多为8）" },
      profileSource: "https://prts.wiki/w/海沫"
    },
    {
      id: "char_4232_hbound", name: "旅骨", englishName: "Homebound", tier: 3,
      alliances: ["伊比利亚", "精准"], profession: "特种", branch: "炼金师", position: "远程位",
      avatar: "./assets/garrison/char_4232_hbound.webp", abilityType: "持续叠加",
      ordinary: { text: "<休整期结束时>使自身及身前一格干员已激活的盟约叠加等同于其售出价格的层数" },
      elite: { text: "<休整期结束时>使自身及身前一格干员已激活的盟约叠加等同于其售出价格2倍的层数" },
      profileSource: "https://prts.wiki/w/旅骨"
    },
    {
      id: "char_4222_taraxa", name: "风絮", englishName: "TARAXACUM", tier: 3,
      alliances: ["炎", "聚合"], profession: "医疗", branch: "守望者", position: "远程位",
      avatar: "./assets/taraxacum-avatar.webp", abilityType: "持续叠加",
      trigger: "休整期结束时", facts: [["触发依据", "本回合获得的干员人数"], ["生效条件", "对应盟约已激活"], ["叠层对象", "炎、聚合"]],
      ordinary: { text: "<休整期结束时> 本回合每获得过一名干员，使已激活的【炎】【聚合】层数+2（每回合至多叠加16层）" },
      elite: { text: "<休整期结束时> 本回合每获得过一名干员，使已激活的【炎】【聚合】层数+4（每回合至多叠加32层）" },
      profileSource: "https://prts.wiki/w/风絮"
    },
    {
      id: "char_422_aurora", name: "极光", englishName: "Aurora", tier: 3,
      alliances: ["谢拉格"], profession: "重装", branch: "决战者", position: "近战位",
      avatar: "./assets/garrison/char_422_aurora.webp", abilityType: "单次叠加",
      ordinary: { text: "<获得时> 【谢拉格】层数+1（每次触发后升级，至多叠加12层）" },
      elite: { text: "<获得时> 【谢拉格】层数+1（每次触发后升级，至多叠加12层）" },
      profileSource: "https://prts.wiki/w/极光"
    },
    {
      id: "char_4013_kjera", name: "耶拉", englishName: "Kjera", tier: 3,
      alliances: ["谢拉格", "奇迹"], profession: "术师", branch: "驭械术师", position: "远程位",
      avatar: "./assets/garrison/char_4013_kjera.webp", abilityType: "整备能力",
      ordinary: { text: "<获得时>获得一件“谢拉格不融冰”" },
      elite: { text: "<获得时>获得两件“谢拉格不融冰”" },
      profileSource: "https://prts.wiki/w/耶拉"
    },
    {
      id: "char_174_slbell", name: "初雪", englishName: "Pramanix", tier: 3,
      alliances: ["谢拉格", "协防干员"], profession: "辅助", branch: "削弱者", position: "远程位",
      avatar: "./assets/garrison/char_174_slbell.webp", abilityType: "持续叠加",
      ordinary: { text: "<战斗中>攻击范围内每有一名敌人进入冻结使已激活的【谢拉格】层数+1（每回合至多叠加16层）" },
      elite: { text: "<战斗中>攻击范围内每有一名敌人进入冻结使已激活的【谢拉格】层数+2（每回合至多叠加32层）" },
      profileSource: "https://prts.wiki/w/初雪"
    },
    {
      id: "char_4137_udflow", name: "深巡", englishName: "Underflow", tier: 3,
      alliances: ["阿戈尔", "坚守"], profession: "重装", branch: "哨戒铁卫", position: "近战位",
      avatar: "./assets/garrison/char_4137_udflow.webp", abilityType: "作战能力",
      ordinary: { text: "<战斗中>部署时【阿戈尔】盟约每叠加20层，使自身及周围四格的干员攻击速度+1，持续30秒" },
      elite: { text: "<战斗中>部署时【阿戈尔】盟约每叠加10层，使自身及周围四格的干员攻击速度+1，持续30秒" },
      profileSource: "https://prts.wiki/w/深巡"
    },
    {
      id: "char_263_skadi", name: "斯卡蒂", englishName: "Skadi", tier: 3,
      alliances: ["阿戈尔", "突袭"], profession: "近卫", branch: "无畏者", position: "近战位",
      avatar: "./assets/garrison/char_263_skadi.webp", abilityType: "持续叠加",
      ordinary: { text: "<战斗中>部署时使已激活的【阿戈尔】层数+4（每场战斗至多叠加8层）" },
      elite: { text: "<战斗中>部署时使已激活的【阿戈尔】层数+8（每场战斗至多叠加16层）" },
      profileSource: "https://prts.wiki/w/斯卡蒂"
    },
    {
      id: "char_423_blemsh", name: "瑕光", englishName: "Blemishine", tier: 3,
      alliances: ["卡西米尔", "突袭"], profession: "重装", branch: "守护者", position: "近战位",
      avatar: "./assets/garrison/char_423_blemsh.webp", abilityType: "持续叠加",
      ordinary: { text: "<战斗中>部署时使自身已激活的盟约层数+3（每场战斗至多叠加9层）" },
      elite: { text: "<战斗中>部署时使自身已激活的盟约层数+6（每场战斗至多叠加18层）" },
      profileSource: "https://prts.wiki/w/瑕光"
    },
    {
      id: "char_4026_vulpis", name: "忍冬", englishName: "Vulpisfoglia", tier: 3,
      alliances: ["叙拉古", "迅捷"], profession: "先锋", branch: "尖兵", position: "近战位",
      avatar: "./assets/garrison/char_4026_vulpis.webp", abilityType: "整备能力",
      ordinary: { text: "<获得时> 获得1次免费刷新（触发2次后升级，至多获得3次免费刷新）" },
      elite: { text: "<获得时> 获得1次免费刷新（触发2次后升级，至多获得3次免费刷新）" },
      profileSource: "https://prts.wiki/w/忍冬"
    },
    {
      id: "char_427_vigil", name: "伺夜", englishName: "Vigil", tier: 3,
      alliances: ["叙拉古", "精准"], profession: "先锋", branch: "战术家", position: "远程位",
      avatar: "./assets/garrison/char_427_vigil.webp", abilityType: "持续叠加",
      ordinary: { text: "<战斗中>造成的伤害变为弱点伤害（根据敌人的防御力与法术抗性变换伤害类型）；\n每击倒一名敌人使已激活的【叙拉古】【精准】层数+2（每回合至多叠加8层）" },
      elite: { text: "<战斗中>造成的伤害变为弱点伤害（根据敌人的防御力与法术抗性变换伤害类型）；\n每击倒一名敌人使已激活的【叙拉古】【精准】层数+4（每回合至多叠加16层）" },
      profileSource: "https://prts.wiki/w/伺夜"
    },
    {
      id: "char_4177_brigid", name: "水灯心", englishName: "Brigid", tier: 3,
      alliances: ["维多利亚", "独行", "灵巧"], profession: "狙击", branch: "回环射手", position: "远程位",
      avatar: "./assets/garrison/char_4177_brigid.webp", abilityType: "作战能力",
      ordinary: { text: "<战斗中>造成的伤害变为弱点伤害（根据敌人的防御力与法术抗性变换伤害类型）" },
      elite: { text: "<战斗中>造成的伤害变为弱点伤害（根据敌人的防御力与法术抗性变换伤害类型）" },
      profileSource: "https://prts.wiki/w/水灯心"
    },
    {
      id: "char_332_archet", name: "空弦", englishName: "ARCHETTO", tier: 3,
      alliances: ["精准", "远见"], profession: "狙击", branch: "速射手", position: "远程位",
      avatar: "./assets/archetto-avatar.png", abilityType: "定额叠层",
      trigger: "进入休整期时", facts: [["触发依据", "进入休整期"], ["生效条件", "目标干员的对应盟约已激活"], ["叠层对象", "自身及身前一格干员已激活的盟约"]],
      ordinary: { text: "<进入休整期时>使自身及身前一格干员已激活的盟约层数+3" },
      elite: { text: "<进入休整期时>使自身及身前一格干员已激活的盟约层数+6" },
      profileSource: "https://prts.wiki/w/空弦"
    },
    {
      id: "char_4203_kichi", name: "吉星", englishName: "Kichisei", tier: 3,
      alliances: ["奇迹"], profession: "狙击", branch: "散射手", position: "远程位",
      avatar: "./assets/garrison/char_4203_kichi.webp", abilityType: "整备能力",
      ordinary: { text: "<售出时>进行一次I阶干员的免费特殊招募\n本干员合成为精锐状态后，上述特殊招募变为V阶干员" },
      elite: { text: "<售出时>进行一次V阶干员的免费特殊招募" },
      profileSource: "https://prts.wiki/w/吉星"
    },
    {
      id: "char_355_ethan", name: "伊桑", englishName: "Ethan", tier: 3,
      alliances: ["奥术", "突袭"], profession: "特种", branch: "伏击客", position: "近战位",
      avatar: "./assets/garrison/char_355_ethan.webp", abilityType: "整备能力",
      ordinary: { text: "<售出时>随机获得一名当前人数最多盟约的干员（不高于当前调度中心等级；无法获得自身）" },
      elite: { text: "<售出时>随机获得一名当前人数最多盟约的干员（不高于当前调度中心等级；无法获得自身）" },
      profileSource: "https://prts.wiki/w/伊桑"
    },
    {
      id: "char_484_robrta", name: "罗比菈塔", englishName: "Roberta", tier: 3,
      alliances: ["坚守", "助力"], profession: "辅助", branch: "工匠", position: "近战位",
      avatar: "./assets/garrison/char_484_robrta.webp", abilityType: "持续叠加",
      ordinary: { text: "<休整期结束时>同一行每有1名干员，使已激活的【坚守】【助力】层数+2" },
      elite: { text: "<休整期结束时>同一行每有1名干员，使已激活的【坚守】【助力】层数+4" },
      profileSource: "https://prts.wiki/w/罗比菈塔"
    },
    {
      id: "char_455_nothin", name: "乌有", englishName: "Mr.Nothing", tier: 3,
      alliances: ["炎"], profession: "特种", branch: "行商", position: "近战位",
      avatar: "./assets/garrison/char_455_nothin.webp", abilityType: "整备能力",
      ordinary: { text: "<获得时>获得一枚“盟约之币”" },
      elite: { text: "<获得时>获得两枚“盟约之币”" },
      profileSource: "https://prts.wiki/w/乌有"
    },
    {
      id: "char_1036_fang2", name: "历阵锐枪芬", englishName: "Fang the Fire-sharpened", tier: 3,
      alliances: ["卡西米尔", "远见"], profession: "先锋", branch: "冲锋手", position: "近战位",
      avatar: "./assets/garrison/char_1036_fang2.webp", abilityType: "作战能力",
      ordinary: { text: "<战斗中>被击倒时召唤整备区的一名【卡西米尔】干员（优先选择最右侧）上场，并使整备区干员的当前再部署时间-30%" },
      elite: { text: "<战斗中>被击倒时召唤整备区的一名【卡西米尔】干员（优先选择最右侧）上场，并使整备区干员的当前再部署时间-60%" },
      profileSource: "https://prts.wiki/w/历阵锐枪芬"
    },
    {
      id: "char_4162_cathy", name: "凯瑟琳", englishName: "Catherine", tier: 3,
      alliances: ["维多利亚", "远见"], profession: "辅助", branch: "工匠", position: "近战位",
      avatar: "./assets/garrison/char_4162_cathy.webp", abilityType: "整备能力",
      ordinary: { text: "<获得时>获得一件维式重锤，小概率获得特殊维式重锤" },
      elite: { text: "<获得时>获得一件特殊维式重锤，小概率获得终极维式重锤" },
      profileSource: "https://prts.wiki/w/凯瑟琳"
    },
    {
      id: "char_4016_kazema", name: "风丸", englishName: "Kazemaru", tier: 3,
      alliances: ["不屈"], profession: "特种", branch: "傀儡师", position: "近战位",
      avatar: "./assets/garrison/char_4016_kazema.webp", abilityType: "持续叠加",
      ordinary: { text: "<战斗中>自身被击倒或与傀儡发生替换时使已激活的【不屈】层数+2（每回合至多叠加10层）" },
      elite: { text: "<战斗中>自身被击倒或与傀儡发生替换时使已激活的【不屈】层数+4（每回合至多叠加20层）" },
      profileSource: "https://prts.wiki/w/风丸"
    },
    {
      id: "char_4054_malist", name: "至简", englishName: "Minimalist", tier: 3,
      alliances: ["萨尔贡"], profession: "术师", branch: "驭械术师", position: "远程位",
      avatar: "./assets/garrison/char_4054_malist.webp", abilityType: "整备能力",
      ordinary: { text: "购买价格为1" },
      elite: { text: "购买价格为1" },
      profileSource: "https://prts.wiki/w/至简"
    },
    {
      id: "char_4245_alga", name: "奥尔佳", englishName: "Ольга", tier: 3,
      alliances: ["乌萨斯", "灵巧"], profession: "近卫", branch: "教官", position: "近战位",
      avatar: "./assets/garrison/char_4245_alga.webp", abilityType: "整备能力",
      ordinary: { text: "<获得时>获得一件乌萨斯呼吸器" },
      elite: { text: "<获得时>获得两件乌萨斯呼吸器" },
      profileSource: "https://prts.wiki/w/奥尔佳"
    },
    {
      id: "char_488_buildr", name: "青枳", englishName: "Poncirus", tier: 3,
      alliances: ["坚守", "迅捷"], profession: "先锋", branch: "尖兵", position: "近战位",
      avatar: "./assets/garrison/char_488_buildr.webp", abilityType: "持续叠加",
      ordinary: { text: "<进入休整期时>使自身及身后一格干员已激活的盟约层数+3" },
      elite: { text: "<进入休整期时>使自身及身后一格干员已激活的盟约层数+6" },
      profileSource: "https://prts.wiki/w/青枳"
    },
    {
      id: "char_4046_ebnhlz", name: "黑键", englishName: "Ebenholz", tier: 4,
      alliances: ["莱塔尼亚", "精准"], profession: "术师", branch: "秘术师", position: "远程位",
      avatar: "./assets/garrison/char_4046_ebnhlz.webp", abilityType: "持续叠加",
      ordinary: { text: "<战斗中>攻击范围内每有一名敌人被击倒使已激活的【莱塔尼亚】【精准】层数+1（每回合至多叠加8层）" },
      elite: { text: "<战斗中>攻击范围内每有一名敌人被击倒使已激活的【莱塔尼亚】【精准】层数+2（每回合至多叠加16层）" },
      profileSource: "https://prts.wiki/w/黑键"
    },
    {
      id: "char_180_amgoat", name: "艾雅法拉", englishName: "Eyjafjalla", tier: 4,
      alliances: ["莱塔尼亚", "奥术"], profession: "术师", branch: "中坚术师", position: "远程位",
      avatar: "./assets/garrison/char_180_amgoat.webp", abilityType: "作战能力",
      ordinary: { text: "<战斗中>【莱塔尼亚】【奥术】每叠加2层，本干员技力自然回复速度+0.02/秒，攻击力+1%" },
      elite: { text: "<战斗中>【莱塔尼亚】【奥术】每叠加1层，本干员技力自然回复速度+0.02/秒，攻击力+1%" },
      profileSource: "https://prts.wiki/w/艾雅法拉"
    },
    {
      id: "char_188_helage", name: "赫拉格", englishName: "Hellagur", tier: 4,
      alliances: ["乌萨斯", "突袭"], profession: "近卫", branch: "武者", position: "近战位",
      avatar: "./assets/garrison/char_188_helage.webp", abilityType: "持续叠加",
      ordinary: { text: "<战斗中>部署时使已激活的【乌萨斯】【突袭】层数+4（每场战斗至多叠加12层）" },
      elite: { text: "<战斗中>部署时使已激活的【乌萨斯】【突袭】层数+8（每场战斗至多叠加24层）" },
      profileSource: "https://prts.wiki/w/赫拉格"
    },
    {
      id: "char_4226_veen", name: "维伊", englishName: "Вий", tier: 4,
      alliances: ["乌萨斯", "奥术"], profession: "术师", branch: "秘术师", position: "远程位",
      avatar: "./assets/garrison/char_4226_veen.webp", abilityType: "作战能力",
      ordinary: { text: "<战斗中>【乌萨斯】每叠加2层，本干员攻击速度+1" },
      elite: { text: "<战斗中>【乌萨斯】每叠加1层，本干员攻击速度+1" },
      profileSource: "https://prts.wiki/w/维伊"
    },
    {
      id: "char_400_weedy", name: "温蒂", englishName: "Weedy", tier: 4,
      alliances: ["伊比利亚", "坚守"], profession: "特种", branch: "推击手", position: "近战位",
      avatar: "./assets/garrison/char_400_weedy.webp", abilityType: "整备能力",
      ordinary: { text: "售出价格为3" },
      elite: { text: "售出价格为6" },
      profileSource: "https://prts.wiki/w/温蒂"
    },
    {
      id: "char_4042_lumen", name: "流明", englishName: "Lumen", tier: 4,
      alliances: ["伊比利亚", "聚合"], profession: "医疗", branch: "疗养师", position: "远程位",
      avatar: "./assets/garrison/char_4042_lumen.webp", abilityType: "持续叠加",
      ordinary: { text: "<战斗结束时>每有一名存活的我方干员，使已激活的【伊比利亚】【聚合】层数+1" },
      elite: { text: "<战斗结束时>每有一名存活的我方干员，使已激活的【伊比利亚】【聚合】层数+2" },
      profileSource: "https://prts.wiki/w/流明"
    },
    {
      id: "char_2026_yu", name: "余", englishName: "Yu", tier: 4,
      alliances: ["炎", "坚守"], profession: "重装", branch: "本源铁卫", position: "近战位",
      avatar: "./assets/garrison/char_2026_yu.webp", abilityType: "持续叠加",
      ordinary: { text: "<战斗中>周围八格每有一名敌人触发元素损伤爆发使自身已激活的盟约层数+1（每回合至多叠加8层）" },
      elite: { text: "<战斗中>周围八格每有一名敌人触发元素损伤爆发使自身已激活的盟约层数+2（每回合至多叠加16层）" },
      profileSource: "https://prts.wiki/w/余"
    },
    {
      id: "char_416_zumama", name: "森蚺", englishName: "Eunectes", tier: 4,
      alliances: ["萨尔贡", "不屈"], profession: "重装", branch: "决战者", position: "近战位",
      avatar: "./assets/garrison/char_416_zumama.webp", abilityType: "持续叠加",
      ordinary: { text: "<战斗中>部署时使已激活的【萨尔贡】【不屈】盟约层数+4（每回合至多叠加12层）" },
      elite: { text: "<战斗中>部署时使已激活的【萨尔贡】【不屈】盟约层数+8（每回合至多叠加24层）" },
      profileSource: "https://prts.wiki/w/森蚺"
    },
    {
      id: "char_206_gnosis", name: "灵知", englishName: "Gnosis", tier: 4,
      alliances: ["谢拉格", "迅捷"], profession: "辅助", branch: "削弱者", position: "远程位",
      avatar: "./assets/garrison/char_206_gnosis.webp", abilityType: "整备能力",
      ordinary: { text: "<获得时>获得一次特殊刷新，下次刷新至少出现一名谢拉格干员" },
      elite: { text: "<获得时>获得一次特殊刷新，下次刷新至少出现两名谢拉格干员" },
      profileSource: "https://prts.wiki/w/灵知"
    },
    {
      id: "char_1023_ghost2", name: "归溟幽灵鲨", englishName: "Specter the Unchained", tier: 4,
      alliances: ["阿戈尔", "不屈"], profession: "特种", branch: "傀儡师", position: "近战位",
      avatar: "./assets/garrison/char_1023_ghost2.webp", abilityType: "作战能力",
      ordinary: { text: "<战斗中>自身被击倒或与替身发生替换时使周围八格的【阿戈尔】干员回复5点技力" },
      elite: { text: "<战斗中>自身被击倒或与替身发生替换时使周围八格的【阿戈尔】干员回复10点技力" },
      profileSource: "https://prts.wiki/w/归溟幽灵鲨"
    },
    {
      id: "char_437_mizuki", name: "水月", englishName: "Mizuki", tier: 4,
      alliances: ["阿戈尔", "灵巧"], profession: "特种", branch: "伏击客", position: "近战位",
      avatar: "./assets/garrison/char_437_mizuki.webp", abilityType: "作战能力",
      ordinary: { text: "<战斗中>【阿戈尔】盟约每叠加20层，自身及周围四格干员每次造成伤害时使目标移动速度-1%，持续3秒" },
      elite: { text: "<战斗中>【阿戈尔】盟约每叠加10层，自身及周围四格干员每次造成伤害时使目标移动速度-1%，持续3秒" },
      profileSource: "https://prts.wiki/w/水月"
    },
    {
      id: "char_430_fartth", name: "远牙", englishName: "Fartooth", tier: 4,
      alliances: ["卡西米尔", "精准"], profession: "狙击", branch: "神射手", position: "远程位",
      avatar: "./assets/garrison/char_430_fartth.webp", abilityType: "作战能力",
      ordinary: { text: "<战斗中>攻击范围内每有一名敌人被击倒使攻击范围内及整备区中的干员再部署时间-3秒" },
      elite: { text: "<战斗中>攻击范围内每有一名敌人被击倒使攻击范围内及整备区中的干员再部署时间-6秒" },
      profileSource: "https://prts.wiki/w/远牙"
    },
    {
      id: "char_4064_mlynar", name: "玛恩纳", englishName: "Młynar", tier: 4,
      alliances: ["卡西米尔"], profession: "近卫", branch: "解放者", position: "近战位",
      avatar: "./assets/garrison/char_4064_mlynar.webp", abilityType: "作战能力",
      ordinary: { text: "<战斗中>【卡西米尔】每叠加5层，本干员部署后100秒内基础攻击力+10、基础生命上限+50" },
      elite: { text: "<战斗中>【卡西米尔】每叠加5层，本干员部署后100秒内基础攻击力+20、基础生命上限+100" },
      profileSource: "https://prts.wiki/w/玛恩纳"
    },
    {
      id: "char_1034_jesca2", name: "涤火杰西卡", englishName: "Jessica the Liberated", tier: 4,
      alliances: ["维多利亚", "坚守"], profession: "重装", branch: "哨戒铁卫", position: "近战位",
      avatar: "./assets/garrison/char_1034_jesca2.webp", abilityType: "持续叠加",
      ordinary: { text: "<休整期结束时>场上每有一名携带装备的干员，使已激活的【维多利亚】【坚守】层数+2" },
      elite: { text: "<休整期结束时>场上每有一名携带装备的干员，使已激活的【维多利亚】【坚守】层数+4" },
      profileSource: "https://prts.wiki/w/涤火杰西卡"
    },
    {
      id: "char_4072_ironmn", name: "白铁", englishName: "Stainless", tier: 4,
      alliances: ["维多利亚", "助力"], profession: "辅助", branch: "工匠", position: "近战位",
      avatar: "./assets/garrison/char_4072_ironmn.webp", abilityType: "整备能力",
      ordinary: { text: "<进入休整期时>使自身携带的装备变为精锐版本" },
      elite: { text: "<进入休整期时>使自身携带的装备变为精锐版本" },
      profileSource: "https://prts.wiki/w/白铁"
    },
    {
      id: "char_4065_judge", name: "斥罪", englishName: "Penance", tier: 4,
      alliances: ["叙拉古", "不屈"], profession: "重装", branch: "不屈者", position: "近战位",
      avatar: "./assets/garrison/char_4065_judge.webp", abilityType: "作战能力",
      ordinary: { text: "<战斗中>【叙拉古】【不屈】每叠加3层，本干员攻击力+1%" },
      elite: { text: "<战斗中>【叙拉古】【不屈】每叠加3层，本干员攻击力+2%" },
      profileSource: "https://prts.wiki/w/斥罪"
    },
    {
      id: "char_113_cqbw", name: "W", englishName: "W", tier: 4,
      alliances: ["迅捷"], profession: "狙击", branch: "炮手", position: "远程位",
      avatar: "./assets/garrison/char_113_cqbw.webp", abilityType: "作战能力",
      ordinary: { text: "<战斗中>【迅捷】每叠加3层，本干员攻击力+1%" },
      elite: { text: "<战斗中>【迅捷】每叠加3层，本干员攻击力+2%" },
      profileSource: "https://prts.wiki/w/W"
    },
    {
      id: "char_4027_heyak", name: "霍尔海雅", englishName: "Ho'olheyak", tier: 4,
      alliances: ["奥术", "精准"], profession: "术师", branch: "中坚术师", position: "远程位",
      avatar: "./assets/garrison/char_4027_heyak.webp", abilityType: "持续叠加",
      ordinary: { text: "<战斗中>每次开启技能时使自身已激活的盟约层数+4（每场战斗至多叠加12层）" },
      elite: { text: "<战斗中>每次开启技能时使自身已激活的盟约层数+8（每场战斗至多叠加24层）" },
      profileSource: "https://prts.wiki/w/霍尔海雅"
    },
    {
      id: "char_264_f12yin", name: "山", englishName: "Mountain", tier: 4,
      alliances: ["投资人"], profession: "近卫", branch: "斗士", position: "近战位",
      avatar: "./assets/garrison/char_264_f12yin.webp", abilityType: "作战能力",
      ordinary: { text: "<战斗中>造成的伤害变为弱点伤害（根据敌人的防御力与法术抗性变换伤害类型）" },
      elite: { text: "<战斗中>造成的伤害变为弱点伤害（根据敌人的防御力与法术抗性变换伤害类型）" },
      profileSource: "https://prts.wiki/w/山"
    },
    {
      id: "char_1031_slent2", name: "淬羽赫默", englishName: "Silence the Paradigmatic", tier: 4,
      alliances: ["助力"], profession: "辅助", branch: "护佑者", position: "远程位",
      avatar: "./assets/garrison/char_1031_slent2.webp", abilityType: "持续叠加",
      ordinary: { text: "<休整期结束时>使整备区每名干员已激活的盟约层数+1" },
      elite: { text: "<休整期结束时>使整备区每名干员已激活的盟约层数+2" },
      profileSource: "https://prts.wiki/w/淬羽赫默"
    },
    {
      id: "char_4088_hodrer", name: "赫德雷", englishName: "Hoederer", tier: 4,
      alliances: ["突袭"], profession: "近卫", branch: "重剑手", position: "近战位",
      avatar: "./assets/garrison/char_4088_hodrer.webp", abilityType: "持续叠加",
      ordinary: { text: "<战斗中>部署时使已激活的【突袭】层数+4（每回合至多叠加16层）" },
      elite: { text: "<战斗中>部署时使已激活的【突袭】层数+8（每回合至多叠加32层）" },
      profileSource: "https://prts.wiki/w/赫德雷"
    },
    {
      id: "char_179_cgbird", name: "夜莺", englishName: "Nightingale", tier: 4,
      alliances: ["聚合", "协防干员"], profession: "医疗", branch: "群愈师", position: "远程位",
      avatar: "./assets/garrison/char_179_cgbird.webp", abilityType: "持续叠加",
      ordinary: { text: "<战斗结束时>每有一名存活的我方干员，使自身已激活的盟约层数+1" },
      elite: { text: "<战斗结束时>每有一名存活的我方干员，使自身已激活的盟约层数+2" },
      profileSource: "https://prts.wiki/w/夜莺"
    },
    {
      id: "char_4082_qiubai", name: "仇白", englishName: "Qiubai", tier: 4,
      alliances: ["炎", "灵巧"], profession: "近卫", branch: "领主", position: "近战位",
      avatar: "./assets/garrison/char_4082_qiubai.webp", abilityType: "单次叠加",
      ordinary: { text: "<获得时>【炎】【灵巧】层数+6" },
      elite: { text: "<获得时>【炎】【灵巧】层数+12" },
      profileSource: "https://prts.wiki/w/仇白"
    },
    {
      id: "char_472_pasngr", name: "异客", englishName: "Passenger", tier: 4,
      alliances: ["萨尔贡", "奥术"], profession: "术师", branch: "链术师", position: "远程位",
      avatar: "./assets/garrison/char_472_pasngr.webp", abilityType: "整备能力",
      ordinary: { text: "<进入休整期时>获得1件“盟约之币”或“萨尔贡浓茶”，有小概率发现“拟态物质”" },
      elite: { text: "<进入休整期时>获得2件“盟约之币”或“萨尔贡浓茶”，有小概率发现“拟态物质”" },
      profileSource: "https://prts.wiki/w/异客"
    },
    {
      id: "char_291_aglina", name: "安洁莉娜", englishName: "Angelina", tier: 4,
      alliances: ["叙拉古", "奇迹"], profession: "辅助", branch: "凝滞师", position: "远程位",
      avatar: "./assets/garrison/char_291_aglina.webp", abilityType: "持续叠加",
      ordinary: { text: "<休整期结束时>本回合每进行过1次刷新，使已激活的【叙拉古】层数+2（每回合至多叠加8层），【奇迹】层数+1（每回合至多叠加4层）" },
      elite: { text: "<休整期结束时>本回合每进行过1次刷新，使已激活的【叙拉古】层数+4（每回合至多叠加16层），【奇迹】层数+2（每回合至多叠加8层）" },
      profileSource: "https://prts.wiki/w/安洁莉娜"
    },
    {
      id: "char_171_bldsk", name: "华法琳", englishName: "Warfarin", tier: 4,
      alliances: ["灵巧", "聚合"], profession: "医疗", branch: "医师", position: "远程位",
      avatar: "./assets/garrison/char_171_bldsk.webp", abilityType: "持续叠加",
      ordinary: { text: "<战斗开始时>使身前一格干员获得特质“<开启技能时>使自身已激活的盟约层数+1（每回合至多叠加7层）”" },
      elite: { text: "<战斗开始时>使身前一格干员获得特质“<开启技能时>使自身已激活的盟约层数+2（每回合至多叠加14层）”" },
      profileSource: "https://prts.wiki/w/华法琳"
    },
    {
      id: "char_341_sntlla", name: "寒檀", englishName: "Santalla", tier: 4,
      alliances: ["远见"], profession: "术师", branch: "扩散术师", position: "远程位",
      avatar: "./assets/garrison/char_341_sntlla.webp", abilityType: "持续叠加",
      ordinary: { text: "<休整期结束时><休整期开始时>使已激活的【远见】层数+3" },
      elite: { text: "<休整期结束时><休整期开始时>使已激活的【远见】层数+6" },
      profileSource: "https://prts.wiki/w/寒檀"
    },
    {
      id: "char_1016_agoat2", name: "纯烬艾雅法拉", englishName: "Eyjafjalla the Hvít Aska", tier: 5,
      alliances: ["聚合", "莱塔尼亚", "远见"], profession: "医疗", branch: "行医", position: "远程位",
      avatar: "./assets/garrison/char_1016_agoat2.webp", abilityType: "持续叠加",
      ordinary: { text: "<战斗中>攻击范围内每有一名敌人被击倒使已激活的【莱塔尼亚】【聚合】层数+2（每场战斗至多叠加20层）" },
      elite: { text: "<战斗中>攻击范围内每有一名敌人被击倒使已激活的【莱塔尼亚】【聚合】层数+4（每场战斗至多叠加40层）" },
      profileSource: "https://prts.wiki/w/纯烬艾雅法拉"
    },
    {
      id: "char_1051_headb2", name: "怒潮凛冬", englishName: "Zima the Raging Tide", tier: 5,
      alliances: ["乌萨斯", "奇迹"], profession: "近卫", branch: "撼地者", position: "近战位",
      avatar: "./assets/garrison/char_1051_headb2.webp", abilityType: "作战能力",
      ordinary: { text: "<战斗中>【乌萨斯】【奇迹】每叠加10层，本干员技力自然回复速度+0.1/秒，攻击力+1%" },
      elite: { text: "<战斗中>【乌萨斯】【奇迹】每叠加10层，本干员技力自然回复速度+0.2/秒，攻击力+2%" },
      profileSource: "https://prts.wiki/w/怒潮凛冬"
    },
    {
      id: "char_4009_irene", name: "艾丽妮", englishName: "Irene", tier: 5,
      alliances: ["伊比利亚"], profession: "近卫", branch: "剑豪", position: "近战位",
      avatar: "./assets/garrison/char_4009_irene.webp", abilityType: "作战能力",
      ordinary: { text: "<战斗中>周围12格每有一名敌人被击倒自身回复3点技力" },
      elite: { text: "<战斗中>周围12格每有一名敌人被击倒自身回复6点技力" },
      profileSource: "https://prts.wiki/w/艾丽妮"
    },
    {
      id: "char_293_thorns", name: "棘刺", englishName: "Thorns", tier: 5,
      alliances: ["伊比利亚", "奥术"], profession: "近卫", branch: "领主", position: "近战位",
      avatar: "./assets/garrison/char_293_thorns.webp", abilityType: "持续叠加",
      ordinary: { text: "<休整期结束时>使已激活的【伊比利亚】叠加等同于场上所有干员售出价格的层数（每回合至多叠加12层）" },
      elite: { text: "<休整期结束时>使已激活的【伊比利亚】叠加等同于场上所有干员售出价格2倍的层数（每回合至多叠加24层）" },
      profileSource: "https://prts.wiki/w/棘刺"
    },
    {
      id: "char_2025_shu", name: "黍", englishName: "SHU", tier: 5,
      alliances: ["炎", "远见"], profession: "重装", branch: "守护者", position: "近战位",
      avatar: "./assets/shu-avatar.webp", abilityType: "单次叠加",
      trigger: "获得时", facts: [["触发依据", "获得该干员"], ["叠层对象", "炎、远见"]],
      ordinary: { text: "<获得时>【炎】层数+8，【远见】层数+4" },
      elite: { text: "<获得时>【炎】层数+16，【远见】层数+8" },
      profileSource: "https://prts.wiki/w/黍"
    },
    {
      id: "char_4058_pepe", name: "佩佩", englishName: "Pepe", tier: 5,
      alliances: ["萨尔贡", "灵巧"], profession: "近卫", branch: "撼地者", position: "近战位",
      avatar: "./assets/garrison/char_4058_pepe.webp", abilityType: "持续叠加",
      ordinary: { text: "<战斗中>周围八格每有一名敌人或干员进入沉睡或眩晕时使自身及身后一格干员已激活的盟约层数+1（每回合至多叠加9层）" },
      elite: { text: "<战斗中>周围八格每有一名敌人或干员进入沉睡或眩晕时使自身及身后一格干员已激活的盟约层数+2（每回合至多叠加18层）" },
      profileSource: "https://prts.wiki/w/佩佩"
    },
    {
      id: "char_1046_sbell2", name: "圣聆初雪", englishName: "Pramanix the Prerita", tier: 5,
      alliances: ["谢拉格", "奥术"], profession: "术师", branch: "阵法术师", position: "远程位",
      avatar: "./assets/garrison/char_1046_sbell2.webp", abilityType: "持续叠加",
      ordinary: { text: "<战斗中>攻击范围内每有一名敌人陷入冻结自身回复1点技力，并使已激活的【谢拉格】层数+1（每回合至多叠加24层）" },
      elite: { text: "<战斗中>攻击范围内每有一名敌人冻结自身回复2点技力，并使已激活的【谢拉格】层数+2（每回合至多叠加48层）" },
      profileSource: "https://prts.wiki/w/圣聆初雪"
    },
    {
      id: "char_1045_svash2", name: "凛御银灰", englishName: "SilverAsh the Reignfrost", tier: 5,
      alliances: ["谢拉格", "灵巧", "投资人"], profession: "先锋", branch: "策士", position: "近战位",
      avatar: "./assets/garrison/char_1045_svash2.webp", abilityType: "持续叠加",
      ordinary: { text: "<战斗中>身前一格【谢拉格】【灵巧】干员每场战斗的叠层上限+75%" },
      elite: { text: "<战斗中>身前一格【谢拉格】【灵巧】干员每场战斗的叠层上限+150%" },
      profileSource: "https://prts.wiki/w/凛御银灰"
    },
    {
      id: "char_474_glady", name: "歌蕾蒂娅", englishName: "Gladiia", tier: 5,
      alliances: ["阿戈尔"], profession: "特种", branch: "钩索师", position: "近战位",
      avatar: "./assets/garrison/char_474_glady.webp", abilityType: "整备能力",
      ordinary: { text: "<进入休整期时>若同一行有3名干员，获得1个幽灵鲨、安哲拉、深巡或斯卡蒂" },
      elite: { text: "<进入休整期时>获得1个幽灵鲨、安哲拉、深巡或斯卡蒂" },
      profileSource: "https://prts.wiki/w/歌蕾蒂娅"
    },
    {
      id: "char_4145_ulpia", name: "乌尔比安", englishName: "Ulpianus", tier: 5,
      alliances: ["阿戈尔"], profession: "近卫", branch: "重剑手", position: "近战位",
      avatar: "./assets/garrison/char_4145_ulpia.webp", abilityType: "作战能力",
      ordinary: { text: "<战斗中>部署时【阿戈尔】盟约每叠加20层，使自身及周围四格的干员攻击力+1%，持续30秒" },
      elite: { text: "<战斗中>部署时【阿戈尔】盟约每叠加10层，使自身及周围四格的干员攻击力+1%，持续30秒" },
      profileSource: "https://prts.wiki/w/乌尔比安"
    },
    {
      id: "char_4098_vvana", name: "薇薇安娜", englishName: "Viviana", tier: 5,
      alliances: ["莱塔尼亚", "卡西米尔", "奥术"], profession: "近卫", branch: "术战者", position: "近战位",
      avatar: "./assets/garrison/char_4098_vvana.webp", abilityType: "持续叠加",
      ordinary: { text: "<战斗中>场上其他与自身拥有相同盟约的干员在本回合战斗期的叠层上限+7" },
      elite: { text: "<战斗中>场上其他与自身拥有相同盟约的干员在本回合战斗期的叠层上限+14" },
      profileSource: "https://prts.wiki/w/薇薇安娜"
    },
    {
      id: "char_358_lisa", name: "铃兰", englishName: "Suzuran", tier: 5,
      alliances: ["叙拉古"], profession: "辅助", branch: "凝滞师", position: "远程位",
      avatar: "./assets/garrison/char_358_lisa.webp", abilityType: "特异化",
      ordinary: { text: "<进入休整期时>触发身前一格的其他干员的“获得时”类效果" },
      elite: { text: "<进入休整期时>触发身前两格的其他干员的“获得时”类效果" },
      profileSource: "https://prts.wiki/w/铃兰"
    },
    {
      id: "char_4037_demetr", name: "贝洛内", englishName: "Bellone", tier: 5,
      alliances: ["叙拉古", "突袭"], profession: "近卫", branch: "斗士", position: "近战位",
      avatar: "./assets/garrison/char_4037_demetr.webp", abilityType: "作战能力",
      ordinary: { text: "<战斗中>【叙拉古】【突袭】每叠加3层，本干员攻击力+1%" },
      elite: { text: "<战斗中>【叙拉古】【突袭】每叠加3层，本干员攻击力+2%" },
      profileSource: "https://prts.wiki/w/贝洛内"
    },
    {
      id: "char_1019_siege2", name: "维娜·维多利亚", englishName: "Vina Victoria", tier: 5,
      alliances: ["维多利亚", "奇迹"], profession: "近卫", branch: "术战者", position: "近战位",
      avatar: "./assets/garrison/char_1019_siege2.webp", abilityType: "持续叠加",
      ordinary: { text: "<休整期结束时>场上每有一名不同阶的【维多利亚】干员，使已激活的【维多利亚】【奇迹】层数+2" },
      elite: { text: "<休整期结束时>场上每有一名不同阶的【维多利亚】干员，使已激活的【维多利亚】【奇迹】层数+4" },
      profileSource: "https://prts.wiki/w/维娜·维多利亚"
    },
    {
      id: "char_391_rosmon", name: "迷迭香", englishName: "Rosmontis", tier: 5,
      alliances: ["精准", "助力"], profession: "狙击", branch: "投掷手", position: "远程位",
      avatar: "./assets/garrison/char_391_rosmon.webp", abilityType: "持续叠加",
      ordinary: { text: "<休整期结束时>使已激活的【精准】【助力】层数+10" },
      elite: { text: "<休整期结束时>使已激活的【精准】【助力】层数+20" },
      profileSource: "https://prts.wiki/w/迷迭香"
    },
    {
      id: "char_4010_etlchi", name: "隐德来希", englishName: "Entelechia", tier: 5,
      alliances: ["灵巧", "不屈"], profession: "近卫", branch: "收割者", position: "近战位",
      avatar: "./assets/garrison/char_4010_etlchi.webp", abilityType: "作战能力",
      ordinary: { text: "<战斗中>【灵巧】【不屈】每叠加3层，本干员攻击力+1%" },
      elite: { text: "<战斗中>【灵巧】【不屈】每叠加3层，本干员攻击力+2%" },
      profileSource: "https://prts.wiki/w/隐德来希"
    },
    {
      id: "char_202_demkni", name: "塞雷娅", englishName: "Saria", tier: 5,
      alliances: ["坚守", "协防干员"], profession: "重装", branch: "守护者", position: "近战位",
      avatar: "./assets/garrison/char_202_demkni.webp", abilityType: "特异化",
      ordinary: { text: "身前一格干员若为“休整期结束时”特质，本干员的特质与其相同" },
      elite: { text: "身前一格干员若为“休整期结束时”特质，本干员的特质与其相同" },
      profileSource: "https://prts.wiki/w/塞雷娅"
    },
    {
      id: "char_1047_halo2", name: "溯光星源", englishName: "Astgenne the Lightchaser", tier: 5,
      alliances: ["奥术"], profession: "辅助", branch: "凝滞师", position: "远程位",
      avatar: "./assets/garrison/char_1047_halo2.webp", abilityType: "持续叠加",
      ordinary: { text: "<休整期结束时> 本回合每消耗3资金，使已激活的【奥术】层数+2（每回合至多叠加18层）" },
      elite: { text: "<休整期结束时> 本回合每消耗3资金，使已激活的【奥术】层数+4（每回合至多叠加36层）" },
      profileSource: "https://prts.wiki/w/溯光星源"
    },
    {
      id: "char_322_lmlee", name: "老鲤", englishName: "Lee", tier: 5,
      alliances: ["投资人", "炎"], profession: "特种", branch: "行商", position: "近战位",
      avatar: "./assets/garrison/char_322_lmlee.webp", abilityType: "作战能力",
      ordinary: { text: "<战斗中>【炎】【投资人】每叠加3层，本干员攻击力+1%" },
      elite: { text: "<战斗中>【炎】【投资人】每叠加3层，本干员攻击力+2%" },
      profileSource: "https://prts.wiki/w/老鲤"
    },
    {
      id: "char_4179_monstr", name: "Mon3tr", englishName: "Mon3tr", tier: 5,
      alliances: ["协防干员"], profession: "医疗", branch: "链愈师", position: "远程位",
      avatar: "./assets/garrison/char_4179_monstr.webp", abilityType: "持续叠加",
      ordinary: { text: "<战斗中>周围八格干员每场战斗的叠层上限+30%" },
      elite: { text: "<战斗中>周围八格干员每场战斗的叠层上限+60%" },
      profileSource: "https://prts.wiki/w/Mon3tr"
    },
    {
      id: "char_4228_closur", name: "可露希尔", englishName: "Closure", tier: 5,
      alliances: ["投资人"], profession: "先锋", branch: "战术家", position: "远程位",
      avatar: "./assets/garrison/char_4228_closur.webp", abilityType: "持续叠加",
      ordinary: { text: "<休整期结束时> 本回合每获得过一名干员，使已激活的【投资人】层数+2（每回合至多叠加16层）" },
      elite: { text: "<休整期结束时> 本回合每获得过一名干员，使已激活的【投资人】层数+4（每回合至多叠加32层）" },
      profileSource: "https://prts.wiki/w/可露希尔"
    },
    {
      id: "char_4055_bgsnow", name: "鸿雪", englishName: "Позёмка", tier: 5,
      alliances: ["萨尔贡", "精准"], profession: "狙击", branch: "重射手", position: "远程位",
      avatar: "./assets/garrison/char_4055_bgsnow.webp", abilityType: "持续叠加",
      ordinary: { text: "<战斗中>每次开启技能时使已激活的【萨尔贡】【精准】层数+4（每回合至多叠加16层）" },
      elite: { text: "<战斗中>每次开启技能时使已激活的【萨尔贡】【精准】层数+8（每回合至多叠加32层）" },
      profileSource: "https://prts.wiki/w/鸿雪"
    },
    {
      id: "char_420_flamtl", name: "焰尾", englishName: "Flametail", tier: 5,
      alliances: ["卡西米尔", "迅捷"], profession: "先锋", branch: "尖兵", position: "近战位",
      avatar: "./assets/garrison/char_420_flamtl.webp", abilityType: "持续叠加",
      ordinary: { text: "<休整期结束时>整备区每有一名干员，使已激活的【卡西米尔】【迅捷】层数+1" },
      elite: { text: "<休整期结束时>整备区每有一名干员，使已激活的【卡西米尔】【迅捷】层数+2" },
      profileSource: "https://prts.wiki/w/焰尾"
    },
    {
      id: "char_4244_tocka", name: "冻河", englishName: "Тоска", tier: 5,
      alliances: ["乌萨斯", "迅捷"], profession: "辅助", branch: "游击手", position: "远程位",
      avatar: "./assets/garrison/char_4244_tocka.webp", abilityType: "持续叠加",
      ordinary: { text: "<战斗中>攻击范围内每有一名敌人被击倒使已激活的【乌萨斯】【迅捷】层数+1（每场战斗至多叠加16层）" },
      elite: { text: "<战斗中>攻击范围内每有一名敌人被击倒使已激活的【乌萨斯】【迅捷】层数+2（每场战斗至多叠加32层）" },
      profileSource: "https://prts.wiki/w/冻河"
    },
    {
      id: "char_002_amiya", name: "阿米娅", englishName: "Amiya", tier: 5,
      alliances: ["奇迹"], profession: "术师", branch: "中坚术师", position: "远程位",
      avatar: "./assets/garrison/char_002_amiya.webp", abilityType: "持续叠加",
      ordinary: { text: "<战斗中>身前一格干员提升盟约层数时，每次提升的层数额外+1（不受叠层上限影响）" },
      elite: { text: "<战斗中>身前一格干员提升盟约层数时，每次提升的层数额外+2（不受叠层上限影响）" },
      profileSource: "https://prts.wiki/w/阿米娅"
    },
    {
      id: "char_1039_thorn2", name: "引星棘刺", englishName: "Thorns the Lodestar", tier: 6,
      alliances: ["伊比利亚", "迅捷"], profession: "特种", branch: "炼金师", position: "远程位",
      avatar: "./assets/garrison/char_1039_thorn2.webp", abilityType: "持续叠加",
      ordinary: { text: "<休整期结束时>使已激活的【伊比利亚】【迅捷】层数+12" },
      elite: { text: "<休整期结束时>使已激活的【伊比利亚】【迅捷】层数+24" },
      profileSource: "https://prts.wiki/w/引星棘刺"
    },
    {
      id: "char_1040_blaze2", name: "烛煌", englishName: "BLAZE THE IGNITING SPARK", tier: 6,
      alliances: ["炎", "维多利亚", "迅捷"], profession: "术师", branch: "本源术师", position: "远程位",
      avatar: "./assets/blaze-avatar.webp", abilityType: "持续叠加",
      trigger: "战斗中", facts: [["触发依据", "攻击范围内的敌人触发元素损伤爆发"], ["生效条件", "对应盟约已激活"], ["叠层对象", "炎、维多利亚"]],
      ordinary: { text: "<战斗中>攻击范围内每有一名敌人触发元素损伤爆发使已激活的【炎】【维多利亚】层数+1（每回合至多叠加12层）" },
      elite: { text: "<战斗中>攻击范围内每有一名敌人触发元素损伤爆发使已激活的【炎】【维多利亚】层数+2（每回合至多叠加24层）" },
      profileSource: "https://prts.wiki/w/烛煌"
    },
    {
      id: "char_1012_skadi2", name: "浊心斯卡蒂", englishName: "Skadi the Corrupting Heart", tier: 6,
      alliances: ["阿戈尔", "聚合"], profession: "辅助", branch: "吟游者", position: "远程位",
      avatar: "./assets/garrison/char_1012_skadi2.webp", abilityType: "持续叠加",
      ordinary: { text: "<战斗中>攻击范围内每有一名我方干员部署使已激活的【阿戈尔】层数+2（每场战斗至多叠加20层）" },
      elite: { text: "<战斗中>攻击范围内每有一名我方干员部署使已激活的【阿戈尔】层数+4（每场战斗至多叠加40层）" },
      profileSource: "https://prts.wiki/w/浊心斯卡蒂"
    },
    {
      id: "char_4231_clemnt", name: "克莱门莎", englishName: "Clementia", tier: 6,
      alliances: ["阿戈尔"], profession: "近卫", branch: "本源近卫", position: "近战位",
      avatar: "./assets/garrison/char_4231_clemnt.webp", abilityType: "作战能力",
      ordinary: { text: "<战斗开始时>【阿戈尔】盟约每叠加20层，使场上所有敌人侵蚀损伤冷却恢复速度+1%" },
      elite: { text: "<战斗开始时>【阿戈尔】盟约每叠加10层，使场上所有敌人侵蚀损伤冷却恢复速度+1%" },
      profileSource: "https://prts.wiki/w/克莱门莎"
    },
    {
      id: "char_1014_nearl2", name: "耀骑士临光", englishName: "Nearl the Radiant Knight", tier: 6,
      alliances: ["卡西米尔", "突袭"], profession: "近卫", branch: "无畏者", position: "近战位",
      avatar: "./assets/garrison/char_1014_nearl2.webp", abilityType: "持续叠加",
      ordinary: { text: "<战斗中>被击倒时召唤整备区最右侧的【卡西米尔】【突袭】干员上场，并使自身及被召唤干员已激活的盟约层数+6（每名干员每回合至多叠加12层）" },
      elite: { text: "<战斗中>被击倒时召唤整备区最右侧的【卡西米尔】【突袭】干员上场，并使自身及被召唤干员已激活的盟约层数+12（每名干员每回合至多叠加24层）" },
      profileSource: "https://prts.wiki/w/耀骑士临光"
    },
    {
      id: "char_1038_whitw2", name: "荒芜拉普兰德", englishName: "Lappland the Decadenza", tier: 6,
      alliances: ["叙拉古"], profession: "术师", branch: "驭械术师", position: "远程位",
      avatar: "./assets/garrison/char_1038_whitw2.webp", abilityType: "持续叠加",
      ordinary: { text: "<战斗中>每击倒一名敌人使已激活的【叙拉古】层数+2（每场战斗至多叠加20层）\n（晋升为精锐状态时，使所有【叙拉古】干员获得此效果）" },
      elite: { text: "<战斗中>所有【叙拉古】干员每击倒一名敌人使已激活的【叙拉古】层数+4（每场战斗至多叠加40层）" },
      profileSource: "https://prts.wiki/w/荒芜拉普兰德"
    },
    {
      id: "char_1042_phatm2", name: "酒神", englishName: "Tragodia", tier: 6,
      alliances: ["维多利亚"], profession: "辅助", branch: "巫役", position: "远程位",
      avatar: "./assets/garrison/char_1042_phatm2.webp", abilityType: "整备能力",
      ordinary: { text: "<进入休整期时>获得一件随机装备（不高于当前调度中心等级）" },
      elite: { text: "<进入休整期时>获得两件随机装备（不高于当前调度中心等级）" },
      profileSource: "https://prts.wiki/w/酒神"
    },
    {
      id: "char_4133_logos", name: "逻各斯", englishName: "LOGOS", tier: 6,
      alliances: ["奥术", "远见"], profession: "术师", branch: "中坚术师", position: "远程位",
      avatar: "./assets/logos-avatar.webp", abilityType: "持续叠加",
      trigger: "获得时／战斗中", facts: [["触发依据", "获得该干员；战斗中的盟约层数"], ["相关盟约", "奥术、远见"]],
      ordinary: { text: "<获得时>【奥术】层数+10，【远见】层数+5\n<战斗中>【奥术】【远见】每叠加3层，本干员攻击速度+1" },
      elite: { text: "<获得时>【奥术】层数+20，【远见】层数+10\n<战斗中>【奥术】【远见】每叠加3层，本干员攻击速度+2" },
      profileSource: "https://prts.wiki/w/逻各斯"
    },
    {
      id: "char_4204_mantra", name: "真言", englishName: "Mantra", tier: 6,
      alliances: ["萨尔贡"], profession: "术师", branch: "本源术师", position: "远程位",
      avatar: "./assets/garrison/char_4204_mantra.webp", abilityType: "作战能力",
      ordinary: { text: "<战斗中>【萨尔贡】每叠加5层，本干员攻击力+1%" },
      elite: { text: "<战斗中>【萨尔贡】每叠加5层，本干员攻击力+2%" },
      profileSource: "https://prts.wiki/w/真言"
    },
    {
      id: "char_4146_nymph", name: "妮芙", englishName: "Nymph", tier: 6,
      alliances: ["迅捷", "远见"], profession: "术师", branch: "本源术师", position: "远程位",
      avatar: "./assets/garrison/char_4146_nymph.webp", abilityType: "持续叠加",
      ordinary: { text: "<战斗中>攻击范围内每有一名敌人陷入恐惧使已激活的【迅捷】层数+4（每回合至多叠加20层）" },
      elite: { text: "<战斗中>攻击范围内每有一名敌人陷入恐惧使已激活的【迅捷】层数+8（每回合至多叠加40层）" },
      profileSource: "https://prts.wiki/w/妮芙"
    },
    {
      id: "char_4202_haruka", name: "遥", englishName: "Haruka", tier: 6,
      alliances: ["聚合", "奇迹"], profession: "辅助", branch: "护佑者", position: "远程位",
      avatar: "./assets/garrison/char_4202_haruka.webp", abilityType: "持续叠加",
      ordinary: { text: "<战斗中>攻击范围内每有一名敌人被击倒使已激活的【聚合】【奇迹】层数+1（每回合至多叠加12层）" },
      elite: { text: "<战斗中>攻击范围内每有一名敌人被击倒使已激活的【聚合】【奇迹】层数+2（每回合至多叠加24层）" },
      profileSource: "https://prts.wiki/w/遥"
    },
    {
      id: "char_4134_cetsyr", name: "魔王", englishName: "Civilight Eterna", tier: 6,
      alliances: ["调和"], profession: "辅助", branch: "吟游者", position: "远程位",
      avatar: "./assets/garrison/char_4134_cetsyr.webp", abilityType: "持续叠加",
      ordinary: { text: "<休整期结束时>使已激活的核心盟约层数+10" },
      elite: { text: "<休整期结束时>使已激活的核心盟约层数+20" },
      profileSource: "https://prts.wiki/w/魔王"
    },
    {
      id: "char_350_surtr", name: "史尔特尔", englishName: "Surtr", tier: 6,
      alliances: ["突袭", "不屈"], profession: "近卫", branch: "术战者", position: "近战位",
      avatar: "./assets/garrison/char_350_surtr.webp", abilityType: "持续叠加",
      ordinary: { text: "<战斗中>每击倒一名敌人使已激活的【突袭】【不屈】层数+4（每回合至多叠加16层）" },
      elite: { text: "<战斗中>每击倒一名敌人使已激活的【突袭】【不屈】层数+8（每回合至多叠加32层）" },
      profileSource: "https://prts.wiki/w/史尔特尔"
    },
    {
      id: "char_4116_blkkgt", name: "锏", englishName: "Degenbrecher", tier: 6,
      alliances: ["卡西米尔", "谢拉格", "莱塔尼亚"], profession: "近卫", branch: "剑豪", position: "近战位",
      avatar: "./assets/garrison/char_4116_blkkgt.webp", abilityType: "作战能力",
      ordinary: { text: "<战斗中>【卡西米尔】【谢拉格】【莱塔尼亚】每叠加6层，本干员技力自然回复速度+0.01/秒，生命上限+1%" },
      elite: { text: "<战斗中>【卡西米尔】【谢拉格】【莱塔尼亚】每叠加3层，本干员技力自然回复速度+0.01/秒，生命上限+1%" },
      profileSource: "https://prts.wiki/w/锏"
    },
    {
      id: "char_4230_mcnist", name: "机械师", englishName: "Mechanist", tier: 6,
      alliances: ["协防干员", "坚守"], profession: "重装", branch: "哨戒铁卫", position: "近战位",
      avatar: "./assets/garrison/char_4230_mcnist.webp", abilityType: "整备能力",
      ordinary: { text: "<进入休整期时>若同一行至少有三名干员，获得一名当前人数最多盟约的干员" },
      elite: { text: "<进入休整期时>获得一名当前人数最多盟约的干员" },
      profileSource: "https://prts.wiki/w/机械师"
    },
    {
      id: "char_4247_oxi", name: "塔露拉", englishName: "Talulah", tier: 6,
      alliances: ["乌萨斯", "奥术", "协防干员"], profession: "近卫", branch: "本源近卫", position: "近战位",
      avatar: "./assets/garrison/char_4247_oxi.webp", abilityType: "持续叠加",
      ordinary: { text: "<战斗中>【乌萨斯】盟约获得强化：击倒单位时叠加的临时层数提升至4层；在场6名不同【乌萨斯】干员时，提升至6层" },
      elite: { text: "<战斗中>【乌萨斯】盟约获得强化：击倒单位时叠加的临时层数提升至6层；在场6名不同【乌萨斯】干员时，提升至8层" },
      profileSource: "https://prts.wiki/w/塔露拉"
    },
    {
      id: "char_2015_dusk", name: "夕", englishName: "DUSK", tier: 6,
      alliances: ["炎", "奥术"], profession: "术师", branch: "扩散术师", position: "远程位",
      avatar: "./assets/dusk-avatar.webp", abilityType: "持续叠加",
      trigger: "休整期结束时", facts: [["触发依据", "本回合获得的干员人数"], ["生效条件", "对应盟约已激活"], ["叠层对象", "炎、奥术"]],
      ordinary: { text: "<休整期结束时> 本回合每获得过一名干员，使已激活的【炎】【奥术】层数+2（每回合至多叠加24层）" },
      elite: { text: "<休整期结束时> 本回合每获得过一名干员，使已激活的【炎】【奥术】层数+4（每回合至多叠加48层）" },
      profileSource: "https://prts.wiki/w/夕"
    },
    {
      id: "char_4193_lemuen", name: "蕾缪安", englishName: "Lemuen", tier: 6,
      alliances: ["精准"], profession: "狙击", branch: "神射手", position: "远程位",
      avatar: "./assets/garrison/char_4193_lemuen.webp", abilityType: "作战能力",
      ordinary: { text: "<战斗中>【精准】每叠加4层，本干员技力自然回复速度+0.01/秒" },
      elite: { text: "<战斗中>【精准】每叠加2层，本干员技力自然回复速度+0.01/秒" },
      profileSource: "https://prts.wiki/w/蕾缪安"
    },
    {
      id: "char_249_mlyss", name: "缪尔赛思", englishName: "Muelsyse", tier: 6,
      alliances: ["协防干员"], profession: "先锋", branch: "战术家", position: "远程位",
      avatar: "./assets/garrison/char_249_mlyss.webp", abilityType: "整备能力",
      ordinary: { text: "<获得时>获得一个“变形同构体”" },
      elite: { text: "<获得时>获得两个“变形同构体”" },
      profileSource: "https://prts.wiki/w/缪尔赛思"
    },
    {
      id: "char_485_pallas", name: "帕拉斯", englishName: "Pallas", tier: 6,
      alliances: ["灵巧", "助力"], profession: "近卫", branch: "教官", position: "近战位",
      avatar: "./assets/garrison/char_485_pallas.webp", abilityType: "持续叠加",
      ordinary: { text: "<休整期结束时>使自身以及身前一格干员已激活的盟约层数+9" },
      elite: { text: "<休整期结束时>使自身以及身前一格干员已激活的盟约层数+18" },
      profileSource: "https://prts.wiki/w/帕拉斯"
    },
    {
      id: "char_616_pithst", name: "盟约·辅助干员", tier: "special",
      alliances: ["调和"], avatar: "./assets/garrison/char_616_pithst.webp", abilityType: "作战能力",
      sourceNote: "策略「优等生」在第 1 回合发放，可造成神经、灼燃和凋亡损伤。",
      ordinary: { text: "<战斗中>攻击力和生命上限+20%" },
      elite: { text: "<战斗中>攻击力和生命上限+40%" }
    },
    {
      id: "special_ironhide", name: "“暴躁铁皮”", tier: "special",
      alliances: ["协防干员"], abilityType: "作战能力",
      sourceNote: "策略「暴躁铁皮」在第 1 回合发放，可携带 4 件装备。",
      ordinary: { text: "<战斗中>攻击力和生命上限+60%" },
      elite: { text: "<战斗中>攻击力和生命上限+120%" }
    },
    {
      id: "char_605_cmedic", name: "预备干员-医疗", tier: "special",
      alliances: [], avatar: "./assets/garrison/char_605_cmedic.webp", abilityType: "作战能力", rosterEligible: false,
      sourceNote: "策略「外勤医疗」",
      ordinary: { text: "在所有玩家场上生成。战斗开始时，场上至少有 2 名精锐干员则替换为 Touch。" }
    },
    {
      id: "char_613_acmedc", name: "Touch", tier: "special",
      alliances: [], avatar: "./assets/garrison/char_613_acmedc.webp", abilityType: "作战能力", rosterEligible: false,
      sourceNote: "策略「外勤医疗」",
      ordinary: { text: "<战斗开始时>场上至少有 2 名精锐干员时，替换由外勤医疗生成的预备干员-医疗。" }
    },
    {
      id: "special_simulated_treasure", name: "“模拟宝藏”", tier: "special",
      alliances: [], abilityType: "整备能力", rosterEligible: false,
      sourceNote: "策略「宝藏探机」",
      ordinary: { text: "消耗 1 资金放到可用地块，冷却 3 回合。被敌人触碰时永久消失，存活至战斗结束时获得 1 资金。" }
    },
    {
      id: "special_yan_guardian", name: "“炎佑”", tier: "special",
      alliances: ["炎"], abilityType: "作战能力", rosterEligible: false,
      sourceNote: "策略「黑白相易」",
      ordinary: { text: "<战斗开始时>在场有 6 名不同的炎干员时，策略收集其部分属性召唤 1 只炎佑。达到 9 名时改为召唤 2 只。" }
    },
    {
      id: "special_snow_giant", name: "雪山巨人", tier: "special",
      alliances: ["谢拉格"], abilityType: "作战能力", rosterEligible: false,
      sourceNote: "谢拉格 6 人档",
      ordinary: { text: "<战斗开始时>由谢拉格盟约召唤，在巨人和雪山形态间切换，攻击力和生命值随谢拉格层数提高。" }
    },
    {
      id: "special_leithanien_motif", name: "“一个小节”", tier: "special",
      alliances: ["莱塔尼亚"], abilityType: "作战能力", rosterEligible: false,
      sourceNote: "莱塔尼亚 3 人档",
      ordinary: { text: "<战斗中>场上敌人被击倒时在附近召唤，3 人档场上最多存在 10 个莱塔尼亚召唤物。" }
    },
    {
      id: "special_leithanien_ensemble", name: "“一个乐部”", tier: "special",
      alliances: ["莱塔尼亚"], abilityType: "作战能力", rosterEligible: false,
      sourceNote: "莱塔尼亚 6 人档",
      ordinary: { text: "<战斗中>有概率替代一个小节被召唤，在场时为莱塔尼亚干员提供 20 攻速。6 人档场上最多存在 20 个莱塔尼亚召唤物。" }
    }
  ],
  modeSource: "https://closure.wiki/zh-cn/stronghold-protocol/3"
};
