"use strict";

(() => {
  const data = window.GARRISON_ENEMY_STATS;
  const catalog = window.GARRISON_ENEMIES.enemies;
  const dialog = document.getElementById('enemy-stats-dialog');
  const title = document.getElementById('enemy-stats-title');
  const content = document.getElementById('enemy-stats-content');
  const controls = document.getElementById('enemy-stats-controls');
  const phase = document.getElementById('enemy-stats-phase');
  const prts = document.getElementById('enemy-stats-prts');
  const source = document.getElementById('enemy-stats-source');
  const calculation = document.getElementById('enemy-stats-calculation');
  const seasonData = 'https://github.com/sganggs/Stronghold-Protocol/blob/55f528e9fc4872388360ee85e13eca8594856204/data/versions/act3autochess-v3_1/';
  const leaderSource = 'https://prts.wiki/w/卫戍协议·规程/PRTS盟约记录#敌方资料';
  const hpFormula = 'https://github.com/sganggs/Stronghold-Protocol/blob/55f528e9fc4872388360ee85e13eca8594856204/server/match/gamedata.js#L168-L184';
  const clientLevels = 'https://github.com/Kengxxiao/ArknightsGameData/blob/6f63c14e27b847ef74b53b00fe51fc322b3cd7ff/zh_CN/gamedata/levels/activities/act3autochess/level_';
  const spawnPreview = 'https://www.lubiao.wiki/tools/garrison-spawn-preview';
  const mainLabels = ['生命值', '攻击力', '防御力', '法术抗性', '基础攻击间隔', '移动速度'];
  const waveLabels = ['生命', '攻击', '防御', '法抗', '基础间隔', '移速'];
  const slotNames = { N: '地面普通敌人', NF: '飞行普通敌人' };
  const campNames = { fixed: '固定随行', part: '领袖部件', slot: '随机替换位' };
  const number = new Intl.NumberFormat('zh-CN', { maximumFractionDigits: 2 });
  let enemy;

  function element(tag, text, className) {
    const result = document.createElement(tag);
    if (text) result.textContent = text;
    if (className) result.className = className;
    return result;
  }

  function statList(entries, className) {
    const list = element('dl', '', className);
    for (const [label, value] of entries) {
      const item = element('div');
      item.append(element('dt', label), element('dd', value));
      list.append(item);
    }
    return list;
  }

  function externalLink(label, href) {
    const link = element('a', label);
    link.href = href;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    return link;
  }

  function report(values, extras = []) {
    return statList(
      [...mainLabels, ...extras].flatMap((label, i) => values[i] == null
        ? []
        : [[label, number.format(values[i]) + (i === 4 ? ' 秒' : '')]]),
      'enemy-stats-values'
    );
  }

  function waveReport(wave) {
    const section = element('section', '', 'enemy-wave');
    const heading = element('h3', '第 ' + wave.round + ' 回合 · 随行敌人', 'enemy-stats-subheading');
    const table = element('table', '', 'enemy-wave-table');
    table.setAttribute('aria-label', heading.textContent);
    const header = table.createTHead().insertRow();
    for (const label of ['敌人', '单人场', '双人场']) {
      const cell = element('th', label);
      cell.scope = 'col';
      header.append(cell);
    }
    const body = table.createTBody();
    const slots = Object.entries(wave.slots).map(([slot, counts]) => [slot, 'slot', ...counts]);
    for (const [key, kind, single, pair, values, hpKind] of [...wave.units, ...slots]) {
      const row = body.insertRow();
      const nameCell = row.insertCell();
      const entry = catalog[key];
      const name = entry?.name ?? data.waveNames[key] ?? slotNames[key] ?? key;
      const title = element('div', '', 'enemy-wave-name');
      if (kind === 'slot') {
        title.append(element('span', name));
      } else {
        const target = name.includes('/')
          ? 'https://prts.wiki/w/Special:Search?search=' + encodeURIComponent(name.split('/')[0])
          : 'https://prts.wiki/w/' + encodeURIComponent(name);
        const link = externalLink(name + ' ↗', target);
        if (entry?.image) {
          const portrait = element('img');
          portrait.src = entry.image;
          portrait.alt = '';
          portrait.width = 30;
          portrait.height = 30;
          portrait.loading = 'lazy';
          portrait.addEventListener('error', () => portrait.remove(), { once: true });
          title.append(portrait);
        }
        title.append(link);
      }
      nameCell.append(title, element('small', campNames[kind]));
      if (values) {
        const entries = waveLabels.map((label, i) => {
          if (i === 0 && hpKind === 'hits') return ['击倒所需次数', number.format(values[i]) + ' 次'];
          return [label, number.format(values[i]) + (i === 4 ? ' 秒' : '')];
        });
        nameCell.append(statList(entries, 'enemy-wave-stats'));
      }
      row.insertCell().textContent = single ? '×' + single : '—';
      row.insertCell().textContent = pair ? '×' + pair : '—';
    }
    const note = element('p', '数量按一个场地的模板统计。随机位的怪种和实际数量随本轮怪组变化。', 'enemy-stats-note');
    const sources = element('div', '', 'boss-route-sources');
    sources.append(
      externalLink('路标档案馆 · 出怪预览 ↗', spawnPreview),
      externalLink('单人场配置 ↗', clientLevels + wave.template + '_s.json'),
      externalLink('双人场配置 ↗', clientLevels + wave.template + '.json')
    );
    const caption = element('p', '终极模拟回合参考 · 社区推算，未实战核实。技能与形态加成另计。', 'enemy-wave-caption');
    section.append(heading, caption, table, note, sources);
    return section;
  }

  function draw() {
    const leader = data.leaders[enemy.id];
    controls.hidden = !leader?.hidden;
    calculation.hidden = !leader;
    if (!leader) {
      const [level, ...values] = data.base[enemy.id];
      content.replaceChildren(
        element('p', '基础属性 · Lv.' + level, 'enemy-stats-caption'),
        report(values, ['重量等级', '漏怪扣除目标生命']),
        element('p', '实战属性会随回合、难度和敌人机制变化。', 'enemy-stats-note')
      );
      source.href = seasonData + 'enemies.json';
      source.textContent = '敌人基础配置 ↗';
      return;
    }

    const wave = leader[phase.value] ?? leader.normal;
    const hp = wave.stats[0];
    const note = element('p', '按开战时仍参战的人数计算，全队共享。', 'enemy-stats-note');
    note.append(' ', externalLink('共享血量算法 ↗', hpFormula));
    content.replaceChildren(
      element('p', '终极模拟 · 单人开场参考 · 未实战核实', 'enemy-stats-caption'),
      report(wave.stats),
      element('h3', '多人共享血量 · 社区推算，未核实', 'enemy-stats-subheading'),
      statList([2, 3, 4].map(players => [players + ' 人', number.format(hp * players / 10000) + ' 万']), 'enemy-stats-health'),
      note,
      waveReport(wave)
    );
    source.href = leaderSource;
    source.textContent = 'PRTS 领袖血量表 ↗';
  }

  phase.addEventListener('change', draw);
  window.GARRISON_ENEMY_STAT_VIEW = {
    open(entry) {
      enemy = entry;
      title.textContent = entry.name + (data.leaders[entry.id] ? ' · 波次属性' : ' · 属性');
      prts.href = 'https://prts.wiki/w/' + encodeURIComponent(entry.name);
      phase.value = 'normal';
      draw();
      dialog.showModal();
      if (data.leaders[entry.id]) window.GARRISON_USAGE?.record('boss');
    }
  };
})();
