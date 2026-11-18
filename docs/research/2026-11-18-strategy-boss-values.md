# 策略数值与Boss难度属性调查 · 2026-11-18

本次仅调查数据来源与展示方式，尚未把两项新内容接入网页。避免把旧季炎盟约文本直接当作本季策略，或把多人血量口径误写为最终总血量。

## 策略：以望／黑白相易／炎佑为例

- 本季[角色策略配置 bands.json](https://github.com/sganggs/Stronghold-Protocol/blob/master/data/versions/act3autochess-v3_1/bands.json)中，`band_yan2` 的 `auto_chess_effect_replace` 将 `bondeffect_yan_2` 替换为 `bondeffect_yan`，可以追溯到具体效果，而不只显示简短策略文案。
- 本季[效果配置 effects.json](https://github.com/sganggs/Stronghold-Protocol/blob/master/data/versions/act3autochess-v3_1/effects.json)中，`bondeffect_yan` 说明6炎收集攻击／生命总和30%，炎佑同时攻击3目标，攻击附带自身攻击20%的灼燃损伤，周围敌人20%元素脆弱；9炎召唤2只，攻击提升至1.5倍，受到伤害减少90%。
- [PRTS炎佑](https://prts.wiki/w/炎佑)和本季[tokens.json](https://github.com/sganggs/Stronghold-Protocol/blob/master/data/versions/act3autochess-v3_1/tokens.json)可核对基础生命12000、攻击600、防御200、法抗0、攻击间隔2.5秒。PRTS指出30%是最终加算，不能把收集的30%简单写成整个最终面板。
- 技能资料有每秒60%攻击的法伤、最多20秒、15秒初始／冷却，但存在两种技能形态；本季望具体采用的形态及效果范围还应核实。PRTS光环半径与配置原始半径字段存在口径差异，暂不宣称某个半径已确定。

建议：策略卡保留原文，详情分「触发条件／直接效果／召唤物详情／数值口径与来源」。炎佑的基础面板、继承、技能分开，防止把基础值当实战最终值。优先以炎佑做样例，再补其他引用召唤物、替换效果或隐藏参数的策略。

## Boss：终极模拟血量资料可取得，完整面板还不齐

[PRTS本季盟约记录的领袖属性表](https://prts.wiki/w/卫戍协议·规程/PRTS盟约记录#敌方资料)已经按标准／险境／绝境／终极，以及独立等级列出数值，并区分隐秘核心；不是各Boss独立词条的0级面板。与本季[bosses.json](https://github.com/sganggs/Stronghold-Protocol/blob/master/data/versions/act3autochess-v3_1/bosses.json)的`bloodByMode.mode_multi_abyss`一致。

| Boss | 终极模拟表值／blood配置 | 说明 |
|---|---:|---|
| 矩兽 | 1,950,000 | 不等同于已经核实的四人共享总血量 |
| 阿利斯泰尔，帝国余晖 | 3,700,000 | 同上 |
| 假想敌：茧 | 4,150,000 | 普通领袖 |
| 假想敌：茧（隐秘核心） | 7,885,000 | 需与普通阶段分开 |

社区复刻[DATA.md](https://github.com/sganggs/Stronghold-Protocol/blob/master/docs/DATA.md)将多人池建模为该值乘开战存活人数，并明确有维护者依据观察做的选择；不是完整客户端公式的证明。`enemyScale`的普通敌人血量倍率也不应再乘到领袖专用血量池上。完整终极攻击、防御、法抗、阶段增益和取整仍需继续核对。

建议：点Boss打开站内详情，顶部选择模式／难度／普通领袖或隐秘核心；优先显示有据可核对的血量表，写明人数口径待核实；机制、基础面板、阶段变化与PRTS链接分别呈现。尚未确认的终极攻防抗不填猜测值，也不直接给出“×人数”的确定最终面板。
