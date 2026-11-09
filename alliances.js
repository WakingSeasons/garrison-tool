/* 用户提供的规程数据TXT，2026-11-08；人数门槛与叠层奖励分别保留。 */
window.GARRISON_ALLIANCES = {
  "炎": {
    "thresholds": [
      3,
      6
    ],
    "rules": [
      {
        "label": "3炎",
        "body": "干员攻击力+23%+0.9*层数",
        "kind": "members",
        "threshold": 3
      },
      {
        "label": "6炎",
        "body": "战斗开始时，[炎]干员每次攻击时造成攻击力6%的随机元素损伤；全场敌人元素损伤恢复速度增加40%+0.3*层数",
        "kind": "members",
        "threshold": 6
      }
    ],
    "source": "https://nga.178.com/read.php?tid=47877197"
  },
  "萨尔贡": {
    "thresholds": [
      3,
      6
    ],
    "rules": [
      {
        "label": "3萨尔贡",
        "body": "干员开启技能时，所有[萨尔贡]干员攻击速度+12(至多+300)，持续5+0.22*层数秒",
        "kind": "members",
        "threshold": 3
      },
      {
        "label": "6萨尔贡",
        "body": "[萨尔贡]干员每次开启技能时，在攻击范围内制造一个流沙地面。位于流沙地面上的敌人受到20%+0.025*层数(上限60%)的迟钝效果，每5秒造成一次5000+25*层数点法术伤害并束缚1秒；[萨尔贡]干员技能持续期间，攻击范围内的流沙地面使敌人的迟钝效果变为2倍，每秒受到800+4*层数点法术伤害",
        "kind": "members",
        "threshold": 6
      }
    ],
    "source": "https://nga.178.com/read.php?tid=47877197"
  },
  "维多利亚": {
    "thresholds": [
      3,
      6
    ],
    "rules": [
      {
        "label": "3维多利亚",
        "body": "携带装备的[维多利亚]干员伤害提升至125%+0.8*层数",
        "kind": "members",
        "threshold": 3
      },
      {
        "label": "每叠加25层",
        "body": "获得一件带有随机特殊效果的维式重锤",
        "kind": "layers"
      },
      {
        "label": "6维多利亚",
        "body": "[维多利亚]干员每携带1件装备攻击力+40%，携带进阶装备改为+80%",
        "kind": "members",
        "threshold": 6
      }
    ],
    "source": "https://nga.178.com/read.php?tid=47877197"
  },
  "谢拉格": {
    "thresholds": [
      3,
      6
    ],
    "rules": [
      {
        "label": "3谢拉格",
        "body": "干员伤害提升至125%，对寒冷和冻结敌人额外提升至135%+1*层数",
        "kind": "members",
        "threshold": 3
      },
      {
        "label": "每叠加100层",
        "body": "获得一件谢拉格不融冰",
        "kind": "layers"
      },
      {
        "label": "6谢拉格",
        "body": "战斗开始时召唤可自主行动的雪山巨人，其攻击力和生命值随谢拉格层数提升而提升。雪山巨人将在巨人和雪山形态转换，雪山形态可以阻挡敌人并造成溅射伤害，雪山形态攻击被冻结的敌人时造成高额法术伤害并解除目标的冻结状态；巨人形态可以移动并对敌人造成远程溅射伤害",
        "kind": "members",
        "threshold": 6
      }
    ],
    "source": "https://nga.178.com/read.php?tid=47877197"
  },
  "阿戈尔": {
    "thresholds": [
      3,
      6
    ],
    "rules": [
      {
        "label": "3阿戈尔",
        "body": "干员生命值+35%+1*层数；战斗开始时[阿戈尔]干员依次吞噬身前一格干员造成5000点物理伤害并获得其基础攻击力和阻挡数，并叠加等于被吞噬者等阶的盟约层数([阿戈尔]之间优先对更靠左和靠上的干员发起吞噬)",
        "kind": "members",
        "threshold": 3
      },
      {
        "label": "6阿戈尔",
        "body": "前3名[阿戈尔]干员首次被击倒时立刻复活",
        "kind": "members",
        "threshold": 6
      }
    ],
    "source": "https://nga.178.com/read.php?tid=47877197"
  },
  "叙拉古": {
    "thresholds": [
      3,
      6
    ],
    "rules": [
      {
        "label": "3叙拉古",
        "body": "干员部署后攻击速度+25+0.8*层数，持续32+0.4*层数秒",
        "kind": "members",
        "threshold": 3
      },
      {
        "label": "6叙拉古",
        "body": "每次攻击时有30%概率为敌人随机附加一个异常状态，持续1+0.0018*层数秒；敌人存在2种或以上异常状态时，每秒对自身及周围一定范围内的敌人造成800+10*层数点真实伤害",
        "kind": "members",
        "threshold": 6
      }
    ],
    "source": "https://nga.178.com/read.php?tid=47877197"
  },
  "卡西米尔": {
    "thresholds": [
      3,
      6
    ],
    "rules": [
      {
        "label": "3卡西米尔",
        "body": "每次有干员部署时[卡西米尔]干员攻击力+20%(至多+50%+1*层数)，持续至战斗结束",
        "kind": "members",
        "threshold": 3
      },
      {
        "label": "6卡西米尔",
        "body": "[卡西米尔]地面干员被击倒时离场并召唤整备区最右侧[卡西米尔]干员加入战斗(不改变当前盟约的激活状态)；[卡西米尔]干员开启技能或部署后30秒内攻击时附带攻击力65%的真实伤害",
        "kind": "members",
        "threshold": 6
      }
    ],
    "source": "https://nga.178.com/read.php?tid=47877197"
  },
  "乌萨斯": {
    "thresholds": [
      3,
      6
    ],
    "rules": [
      {
        "label": "3乌萨斯",
        "body": "干员攻击力+35%+0.75*层数，生命值+10%+0.3*层数，[乌萨斯]干员击倒其他单位时为[乌萨斯]叠加2层临时层数",
        "kind": "members",
        "threshold": 3
      },
      {
        "label": "6乌萨斯",
        "body": "[乌萨斯]干员受到伤害的15%+0.05*层数(上限100%)转化为10秒的生命流失，当伤害来源被击倒时不再流失生命；阻挡敌人期间，敌人每秒受到相当于攻击力50%+0.25*层数的法术伤害；[乌萨斯]干员击倒其他单位时叠加的临时层数提升至4层",
        "kind": "members",
        "threshold": 6
      }
    ],
    "source": "https://nga.178.com/read.php?tid=47877197"
  },
  "伊比利亚": {
    "thresholds": [
      3,
      6
    ],
    "rules": [
      {
        "label": "3伊比利亚",
        "body": "干员或炼金单元每次造成伤害时，使目标每秒受到11%+0.06*层数攻击力(至多叠加10次)的持续法术伤害，持续10秒",
        "kind": "members",
        "threshold": 3
      },
      {
        "label": "6伊比利亚",
        "body": "[伊比利亚]干员或炼金单元造成伤害时附带的持续法术伤害提升至2倍，并使目标移动速度-4%(至多-80%)，持续10秒；[伊比利亚]干员或炼金单元每次造成伤害时有20%概率弹射到周围一定范围内的敌人造成300%攻击力的法术伤害",
        "kind": "members",
        "threshold": 6
      }
    ],
    "source": "https://nga.178.com/read.php?tid=47877197"
  },
  "莱塔尼亚": {
    "thresholds": [
      3,
      6
    ],
    "rules": [
      {
        "label": "3莱塔尼亚",
        "body": "干员和召唤物攻击力+30%+1*层数，场上敌人被击倒时在附近召唤“一个小节”(场上最多存在10个)",
        "kind": "members",
        "threshold": 3
      },
      {
        "label": "6莱塔尼亚",
        "body": "召唤“一个小节”时30%+0.1*层数(上限100%)概率改为召唤“一个乐部”，在场时使[莱塔尼亚]干员攻速+20；场上[莱塔尼亚]召唤物上限提升至20；场上我方干员被击倒时会额外召唤“一个小节”",
        "kind": "members",
        "threshold": 6
      }
    ],
    "source": "https://nga.178.com/read.php?tid=47877197"
  },
  "精准": {
    "thresholds": [
      2,
      3
    ],
    "rules": [
      {
        "label": "2精准",
        "body": "干员攻击力+10%+1.2*层数",
        "kind": "members",
        "threshold": 2
      },
      {
        "label": "3精准",
        "body": "生效范围变为[精准]干员和所有远程干员，且攻击无视30%防御力和法术抗性",
        "kind": "members",
        "threshold": 3
      }
    ],
    "source": "https://nga.178.com/read.php?tid=47877197"
  },
  "迅捷": {
    "thresholds": [
      2
    ],
    "rules": [
      {
        "label": "2迅捷",
        "body": "干员技能结束时有20%+0.35*层数(上限100%)概率立刻回复12点技力",
        "kind": "members",
        "threshold": 2
      },
      {
        "label": "40层",
        "body": "所有干员技能结束时有等概率额外回复15点技力",
        "kind": "layers"
      }
    ],
    "source": "https://nga.178.com/read.php?tid=47877197"
  },
  "灵巧": {
    "thresholds": [
      2
    ],
    "rules": [
      {
        "label": "2灵巧",
        "body": "干员及周围4格的干员攻击速度+10+1*层数",
        "kind": "members",
        "threshold": 2
      },
      {
        "label": "40层",
        "body": "生效范围变为[灵巧]干员周围8格",
        "kind": "layers"
      }
    ],
    "source": "https://nga.178.com/read.php?tid=47877197"
  },
  "坚守": {
    "thresholds": [
      2,
      3
    ],
    "rules": [
      {
        "label": "2坚守",
        "body": "所有干员生命值+25%+1.2*层数",
        "kind": "members",
        "threshold": 2
      },
      {
        "label": "3坚守",
        "body": "场上非[坚守]干员受到伤害时，所受伤害的40%由[坚守]干员平均承担；[坚守]干员受到伤害时，伤害来源受到850+10*层数点法术伤害(每0.2秒至多触发1次)和持续5秒的40%的脆弱效果",
        "kind": "members",
        "threshold": 3
      }
    ],
    "source": "https://nga.178.com/read.php?tid=47877197"
  },
  "助力": {
    "thresholds": [
      2,
      3
    ],
    "rules": [
      {
        "label": "2助力",
        "body": "所有干员防御力+15%+1.2*层数，再部署时间-30%；休整期结束时，使当前所有已激活的盟约层数+2",
        "kind": "members",
        "threshold": 2
      },
      {
        "label": "3助力",
        "body": "改为层数+4",
        "kind": "members",
        "threshold": 3
      }
    ],
    "source": "https://nga.178.com/read.php?tid=47877197"
  },
  "远见": {
    "thresholds": [
      2
    ],
    "rules": [
      {
        "label": "2远见",
        "body": "每叠加10层，获得一次2资金",
        "kind": "members",
        "threshold": 2
      },
      {
        "label": "首次到达80层",
        "body": "所有[远见]干员购买价格永久-1资金",
        "kind": "layers"
      },
      {
        "label": "首次到达150层",
        "body": "所有[远见]干员购买价格额外永久-1资金",
        "kind": "layers"
      },
      {
        "label": "激活条件",
        "body": "整备区的[远见]干员也可用于激活盟约",
        "kind": "note"
      }
    ],
    "source": "https://nga.178.com/read.php?tid=47877197"
  },
  "奇迹": {
    "thresholds": [
      2
    ],
    "rules": [
      {
        "label": "2奇迹",
        "body": "刷新调度中心时，有18%+0.25*层数(上限100%)概率使下次刷新不消耗资金",
        "kind": "members",
        "threshold": 2
      },
      {
        "label": "首次到达100层",
        "body": "调度中心刷新时至少出现一名等同于当前调度中心等级的干员",
        "kind": "layers"
      },
      {
        "label": "激活条件",
        "body": "整备区的[奇迹]干员也可用于激活盟约",
        "kind": "note"
      }
    ],
    "source": "https://nga.178.com/read.php?tid=47877197"
  },
  "投资人": {
    "thresholds": [
      3
    ],
    "rules": [
      {
        "label": "3投资人",
        "body": "干员的“获得时”类特质每次触发2次",
        "kind": "members",
        "threshold": 3
      },
      {
        "label": "100层",
        "body": "“获得时”类特质每次触发3次",
        "kind": "layers"
      },
      {
        "label": "激活条件",
        "body": "整备区的[投资人]干员也可用于激活盟约",
        "kind": "note"
      }
    ],
    "source": "https://nga.178.com/read.php?tid=47877197"
  },
  "突袭": {
    "thresholds": [
      2
    ],
    "rules": [
      {
        "label": "2突袭",
        "body": "干员10秒内未进行攻击或技能就绪时，若范围内没有敌人，则保留技力立即再部署至一名地面敌人周围，期间攻击力和生命值+25%+1*层数",
        "kind": "members",
        "threshold": 2
      },
      {
        "label": "50层",
        "body": "所有干员攻击速度+50",
        "kind": "layers"
      }
    ],
    "source": "https://nga.178.com/read.php?tid=47877197"
  },
  "不屈": {
    "thresholds": [
      2,
      3
    ],
    "rules": [
      {
        "label": "2不屈",
        "body": "地面干员被击倒时，有18%+0.4*层数(上限100%)概率立刻重新部署",
        "kind": "members",
        "threshold": 2
      },
      {
        "label": "3不屈",
        "body": "地面干员被击倒时使场上所有干员技力+5",
        "kind": "members",
        "threshold": 3
      }
    ],
    "source": "https://nga.178.com/read.php?tid=47877197"
  },
  "调和": {
    "thresholds": [
      1
    ],
    "rules": [
      {
        "label": "1调和",
        "body": "激活时可以使场上核心盟约的激活人数+1，[调和]干员享受已激活的核心盟约的效果",
        "kind": "members",
        "threshold": 1
      }
    ],
    "source": "https://nga.178.com/read.php?tid=47877197"
  },
  "协防干员": {
    "thresholds": [
      2
    ],
    "rules": [
      {
        "label": "2协防干员",
        "body": "所有干员受到的物理和法术伤害-20%；[协防干员]伤害提升至120%，精锐[协防干员]造成伤害提升至140%",
        "kind": "members",
        "threshold": 2
      }
    ],
    "source": "https://nga.178.com/read.php?tid=47877197"
  },
  "独行": {
    "thresholds": [
      1
    ],
    "rules": [
      {
        "label": "1独行",
        "body": "干员攻击力和生命值+60%，初始技力+15(在场2名及以上[独行]干员时失效)",
        "kind": "members",
        "threshold": 1
      }
    ],
    "source": "https://nga.178.com/read.php?tid=47877197",
    "exclusiveMax": 1
  },
  "绝技": {
    "thresholds": [
      2,
      5
    ],
    "rules": [
      {
        "label": "2精锐",
        "body": "精锐状态的干员攻击力+30%",
        "kind": "members",
        "threshold": 2
      },
      {
        "label": "5精锐",
        "body": "精锐状态的干员技力消耗-30%",
        "kind": "members",
        "threshold": 5
      }
    ],
    "source": "https://nga.178.com/read.php?tid=47877197"
  },
  "聚合": {
    "thresholds": [
      2,
      3
    ],
    "rules": [
      {
        "label": "2聚合",
        "body": "干员攻击范围内的我方单位每秒回复攻击力16%+0.12*层数的生命值和攻击力8%+0.06*层数的元素损伤",
        "kind": "members",
        "threshold": 2
      },
      {
        "label": "3聚合",
        "body": "[聚合]干员攻击范围内的所有干员获得15%+0.08*层数的庇护",
        "kind": "members",
        "threshold": 3
      }
    ],
    "source": "https://nga.178.com/read.php?tid=47877197"
  },
  "奥术": {
    "thresholds": [
      2,
      3
    ],
    "rules": [
      {
        "label": "2奥术",
        "body": "干员造成伤害时额外附加一次20%+0.4*层数攻击力的法术伤害",
        "kind": "members",
        "threshold": 2
      },
      {
        "label": "3奥术",
        "body": "场上所有敌人每次受到伤害时法术抗性-1(累计降幅上限为30+0.05*层数点，最多降低100点)；[奥术]干员攻击范围内的敌人隐匿效果失效",
        "kind": "members",
        "threshold": 3
      }
    ],
    "source": "https://nga.178.com/read.php?tid=47877197"
  }
};
