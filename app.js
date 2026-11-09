"use strict";

(() => {
  const data = window.GARRISON_DATA;
  const analysis = window.GARRISON_RESEARCH;
  const filter = window.GARRISON_FILTERS;
  const model = window.GARRISON_WORKSPACE;
  const definitions = window.GARRISON_ALLIANCES;
  const equipment = window.GARRISON_EQUIPMENT;
  const strategies = window.GARRISON_STRATEGIES;
  const equipmentPage = window.GARRISON_EQUIPMENT_PAGE;
  const storageKey = 'garrison-research-workspace-v1';
  const root = document.getElementById('workspace');
  const layout = document.getElementById('encyclopedia-layout');
  const sidebarToggle = document.getElementById('toggle-sidebar');
  const sectionButtons = layout.querySelectorAll('[data-encyclopedia-section]');
  const sectionPanels = layout.querySelectorAll('[data-section-panel]');
  const roster = document.getElementById('roster-panel');
  const allianceDialog = document.getElementById('alliance-dialog');
  const headerSearch = document.getElementById('header-any-search');
  const searchScope = document.getElementById('header-search-scope');
  const transferDialog = document.getElementById('transfer-dialog');
  const transferSelect = document.getElementById('transfer-gear');
  const escapeHtml = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
  let storageAvailable = true;
  let saved;
  try { saved = localStorage.getItem(storageKey); } catch { storageAvailable = false; }
  const state = model.restore(saved);
  const operatorCount = data.operators.filter(operator => operator.tier !== 'special').length;
  const tierLabel = tier => tier === 'special' ? '特殊' : `${tier} 阶`;
  const filterValue = (kind, value) => kind === 'tiers' && value !== 'special' ? Number(value) : value;
  document.getElementById('operator-total').textContent = `${operatorCount} 名干员`;
  const catalogFilters = { alliances: 'all', strategies: 'all' };
  const searchPlaceholders = {
    operators: '搜索盟约、特质、机制、技能…',
    alliances: '搜索盟约名称、档位或效果…',
    strategies: '搜索策略名称、效果或关联盟约…',
    equipment: '搜索装备名称、效果、联合部件或新增盟约…',
    enemies: '敌方资料 · 后续制作',
    presets: '阵容保存与预设 · 后续制作'
  };
  let toastTimer, scrollSaveTimer;
  let transferMemberId;

  function persist() {
    if (storageAvailable) {
      try { localStorage.setItem(storageKey, JSON.stringify(state)); }
      catch { storageAvailable = false; }
    }
    document.getElementById('save-status').textContent = storageAvailable ? '本机自动保存' : '当前会话保存 · 本机存储不可用';
  }
  function notify(text) {
    const toast = document.getElementById('toast');
    toast.textContent = text; toast.hidden = false;
    clearTimeout(toastTimer); toastTimer = setTimeout(() => { toast.hidden = true; }, 2500);
  }
  function groupMarkup(kind, items, label) {
    return `<div class="filter-row"><span class="filter-label">${label}</span><div class="filter-options" role="group" aria-label="${label}">${items.map(([value, text, title]) => `<button type="button" class="filter-button" data-filter="${kind}" data-value="${escapeHtml(value)}" aria-pressed="false"${title ? ` title="${escapeHtml(title)}"` : ''}>${escapeHtml(text)}</button>`).join('')}</div></div>`;
  }
  function mountPane(pane) {
    const node = document.createElement('section');
    node.className = 'search-pane'; node.dataset.pane = pane.id;
    node.setAttribute('aria-labelledby', `${pane.id}-title`);
    const allianceItems = names => names.map(name => [name, name, `${data.operators.filter(operator => operator.tier !== 'special' && operator.alliances.includes(name)).length} 名固定成员`]);
    const banItems = names => names.map(name => [name, name]);
    node.innerHTML = `<div class="pane-heading"><div><span class="pane-index">${pane.id === 'primary' ? '01 · 主检索' : '02 · 并排检索'}</span><div class="pane-title-line"><h2 id="${pane.id}-title">全部干员</h2><div class="pane-thresholds" aria-label="盟约触发人数"></div></div></div><div class="pane-heading-actions"><button type="button" class="text-button" data-reset-pane>重置筛选</button>${pane.id === 'compare' ? '<button type="button" class="icon-button close-compare" data-close-compare aria-label="关闭右侧检索">×</button>' : ''}</div></div>
      <div class="pane-scroll" tabindex="0" aria-label="${pane.id === 'primary' ? '左侧' : '右侧'}检索内容">
      <label class="search-field name-search"><span>干员名称</span><input type="search" data-search="nameQuery" aria-label="${pane.id === 'primary' ? '左侧' : '右侧'}搜索干员名称" placeholder="仅搜索干员名称／英文名" autocomplete="off"></label>
      <details class="filters-box" data-filters-details><summary><span>筛选条件</span><small class="filter-selection-count"></small><span class="details-chevron" aria-hidden="true">⌄</span></summary><div class="filters-content">
      ${groupMarkup('tiers', [['all', '不限'], ...data.tiers.map(tier => [tier, tierLabel(tier)])], '阶级')}
      <div class="filter-row mode-row"><span class="filter-label">筛选方式</span><div class="match-switch" role="group" aria-label="统一筛选方式"><button type="button" data-mode="single">单选</button><button type="button" data-mode="all">多选 · 全部符合</button><button type="button" data-mode="any">多选 · 符合任一</button></div></div><p class="mode-help"></p>
      ${groupMarkup('alliances', [['all', '不限'], ...allianceItems(data.coreAlliances)], '核心盟约')}
      ${groupMarkup('alliances', allianceItems(data.addonAlliances), '独立盟约')}
      ${groupMarkup('categories', [['all', '不限'], ...analysis.categories.map(name => [name, name])], '特质分类')}
      ${groupMarkup('keywords', [['all', '不限'], ...Object.entries(analysis.terms).map(([id, term]) => [id, term.label])], '联动词条')}
      <p class="filter-footnote">各组条件同时生效；多选阶级表示允许范围。分类与联动词条在同一段效果中匹配。</p>
      <details class="ban-settings">
        <summary><span>本局 BAN 位</span><small class="ban-selection-count"></small><span class="details-chevron" aria-hidden="true">⌄</span></summary>
        <div class="ban-settings-content">
          <p>按开局名单选中不完整或未开放的盟约。参考上一期规则，所属盟约全被选中的干员标红。两侧共用。</p>
          ${groupMarkup('bans', banItems(data.coreAlliances), '核心 BAN')}
          ${groupMarkup('bans', banItems(data.addonAlliances), '独立 BAN')}
          <button type="button" class="text-button" data-clear-bans hidden>清空 BAN 位</button>
        </div>
      </details></div></details>
      <div class="active-filters" aria-label="已选筛选条件"></div>
      <div class="alliance-reference" aria-label="已选盟约效果"></div>
      <div class="results-heading"><h3>干员与单位</h3><span class="result-count"></span><button type="button" class="text-button" data-research-home>查看机制联动 ↗</button></div>
      <div class="operator-results"></div><div class="empty-state" hidden><span aria-hidden="true">⌕</span><h3>没有匹配的干员</h3><p>可以减少筛选条件，或清空检索词。</p><button type="button" class="secondary-button" data-reset-pane>重置本侧筛选</button><button type="button" class="text-button" data-research-home>查看机制联动 ↗</button></div>
      <footer class="pane-footer"><span>${operatorCount} 名参战干员 · ${data.operators.length - operatorCount} 个特殊条目</span><a href="${data.modeSource}" target="_blank" rel="noopener noreferrer">可露希尔 Wiki ↗</a></footer></div>`;
    root.append(node);
    node.querySelector('[data-filters-details]').open = pane.filtersOpen;
    node.querySelector('.pane-scroll').addEventListener('scroll', event => {
      if (root.hidden) return;
      const current = state.panes.find(item => item.id === node.dataset.pane);
      if (current) current.scrollTop = event.target.scrollTop;
      clearTimeout(scrollSaveTimer); scrollSaveTimer = setTimeout(persist, 150);
    }, { passive: true });
    return node;
  }
  function ruleMarkup(name, { compact = false } = {}) {
    const definition = definitions[name];
    const progress = model.allianceProgress(name, state.members);
    return `<div class="alliance-rule-list">${definition.rules.map(rule => {
      const active = rule.kind === 'members' && progress.activeThreshold >= rule.threshold;
      return `<div class="alliance-rule ${active ? 'is-active' : ''} ${rule.kind === 'note' ? 'activation-note' : ''}"><span class="rule-label">${rule.kind === 'members' ? `${rule.threshold} 人${active ? ' · 已激活' : ''}` : escapeHtml(rule.label)}</span><p>${escapeHtml(rule.body)}</p></div>`;
    }).join('')}</div>${compact ? '' : `<p class="reference-note">人数激活与层数奖励分别判断；公式中的“层数”指游戏内实际累计值。</p><a class="source-link" href="${definition.source}" target="_blank" rel="noopener noreferrer">用户提供的规程数据 · 原讨论来源 ↗</a>`}`;
  }
  function progressLabel(progress) {
    if (!progress.count) return `未编入阵容 · ${progress.nextThreshold} 人激活`;
    return `${progress.count}/${progress.nextThreshold} 人 · ${progress.activeThreshold ? `${progress.activeThreshold} 人档已激活` : '未激活'}`;
  }
  function renderAllianceReference(node, pane) {
    const names = pane.filters.alliances;
    node.querySelector('.alliance-reference').innerHTML = names.length ? `<div class="section-kicker">已选盟约 · 效果说明</div>${names.map(name => {
      const progress = model.allianceProgress(name, state.members);
      return `<details class="alliance-effect" data-effect-alliance="${name}"${pane.effectsExpanded.includes(name) ? ' open' : ''}><summary><span class="alliance-name ${data.coreAlliances.includes(name) ? 'core-name' : ''}">${name}</span><span class="alliance-progress-label ${progress.activeThreshold ? 'active' : ''}">${progressLabel(progress)}</span><span class="details-chevron" aria-hidden="true">⌄</span></summary>${ruleMarkup(name, { compact: true })}</details>`;
    }).join('')}` : '<p class="reference-placeholder">选择盟约，即可在这里查看各档效果；点击阵容中的盟约也能查看。</p>';
  }
  function abilityMarkup(text) {
    return escapeHtml(text).replace(/【([^】]+)】/g, '<span class="inline-alliance">$1</span>')
      .replace(/&lt;([^&]+)&gt;/g, '<span class="inline-timing">$1</span>').replaceAll('\n', '<br>');
  }
  function avatarMarkup(operator, size) {
    if (!operator.avatar) return `<span class="operator-avatar special-avatar" style="--avatar-size:${size}px" aria-hidden="true">特</span>`;
    return `<img class="operator-avatar" src="${operator.avatar}" alt="${escapeHtml(operator.name)}头像" width="${size}" height="${size}" loading="lazy" decoding="async" draggable="false">`;
  }
  function renderCard(operator, pane) {
    const elite = !!operator.elite && pane.elites.includes(operator.id);
    const member = state.members.find(member => member.id === operator.id);
    const canJoin = operator.rosterEligible !== false;
    const banned = model.isBanned(operator, state.bannedAlliances);
    const effects = analysis.operators[operator.id].effects;
    const terms = [...new Set(effects.flatMap(effect => effect.termIds))];
    const trait = elite ? operator.elite.text : operator.ordinary.text;
    const training = data.trainingByTier[operator.tier];
    const trigger = operator.facts?.find(([label]) => label === '触发依据')?.[1] || operator.trigger;
    return `<article class="operator-card${banned ? ' is-banned' : ''}" data-operator-id="${operator.id}"${canJoin ? ' title="可拖入下方阵容"' : ' data-reference-only'} draggable="false" aria-label="${operator.name}的${canJoin ? '干员' : '单位'}信息">
      <div class="operator-heading">
        <div class="operator-identity">
          ${avatarMarkup(operator, 34)}
          <div class="name-line"><h3>${operator.name}</h3><span class="tier-badge">${tierLabel(operator.tier)}</span>${banned ? '<span class="ban-tag">BAN</span>' : ''}</div>
        </div>
        <div class="card-alliances">${operator.alliances.map(name => `<button type="button" class="alliance-badge ${data.coreAlliances.includes(name) ? 'core-badge' : 'addon-badge'}" data-compare-alliance="${name}" title="在右侧查看${name}的效果与干员">${name}</button>`).join('')}</div>
      </div>
      <div class="ability-box">
        ${operator.elite ? `<div class="state-switch" role="group" aria-label="${operator.name}的资料预览状态">
          <button type="button" data-preview="ordinary" data-operator="${operator.id}" aria-pressed="${!elite}" class="${!elite ? 'selected' : ''}">普通</button>
          <button type="button" data-preview="elite" data-operator="${operator.id}" aria-pressed="${elite}" class="${elite ? 'selected' : ''}">精锐</button>
        </div>` : ''}
        <p>${abilityMarkup(trait)}</p>
      </div>
      <div class="card-actions">
        <details class="trait-details">
          <summary>详情</summary>
          ${training ? `<div class="card-training">
            <h4>规程练度</h4>
            <dl class="stack-metrics">
              <div><dt>普通</dt><dd>${training.ordinary}</dd></div>
              <div><dt>精锐</dt><dd>${training.elite}</dd></div>
            </dl>
          </div>` : ''}
          ${operator.sourceNote ? `<p class="special-source">${escapeHtml(operator.sourceNote)}</p>` : ''}
          <div class="effect-summary">${effects.map(effect => {
            const values = elite ? effect.elite : effect.normal;
            return `<div class="effect-item">
              <div class="effect-meta"><span class="effect-role">${effect.category}</span><span class="effect-timing">${effect.timing}</span></div>
              <dl class="stack-metrics">
                ${values.gain
                  ? `<div><dt>${effect.role === '直接叠层' ? '每次产出' : '层数收益'}</dt><dd>${escapeHtml(values.gain)}</dd></div>`
                  : `<div class="effect-target"><dt>效果</dt><dd>${abilityMarkup(values.text)}</dd></div>`}
                ${values.cap ? `<div><dt>累计上限</dt><dd>${escapeHtml(values.cap)}</dd></div>` : ''}
                ${effect.targets.length ? `<div class="effect-target"><dt>作用对象</dt><dd>${escapeHtml(effect.targets.join('、'))}</dd></div>` : ''}
              </dl>
            </div>`;
          }).join('')}</div>
          ${trigger ? `<div class="trigger-basis"><span>触发依据</span>${escapeHtml(trigger)}</div>` : ''}
          ${terms.length ? `<div class="card-term-row"><span>联动</span>${terms.map(term => `<button type="button" class="term-chip" data-term="${term}">${analysis.terms[term].label} ↗</button>`).join('')}</div>` : ''}
        </details>
        ${training || terms.length ? `<button type="button" class="text-button" data-operator-links="${operator.id}">查看联动 ↗</button>` : ''}
        <a class="text-button" href="${operator.profileSource || data.modeSource}" target="_blank" rel="noopener noreferrer"${operator.profileSource ? ` title="在 PRTS 查看${operator.name}的基础档案"` : ''}>${operator.profileSource ? '基础档案' : '规程来源'} ↗</a>
        ${canJoin ? `<button type="button" class="${member ? 'added-button' : 'primary-button'}" data-add-op="${operator.id}" aria-label="${member ? `${operator.name}已在阵容` : `加入${operator.name}到阵容`}">${member ? '✓ 已在阵容' : '＋ 加入阵容'}</button>` : '<span class="special-unit-note">策略或盟约生成</span>'}
      </div>
    </article>`;
  }
  function renderHeaderSearch() {
    const operators = state.section === 'operators';
    searchScope.hidden = !operators || state.panes.length < 2;
    if (state.panes.length < 2) searchScope.value = 'primary';
    headerSearch.placeholder = searchPlaceholders[state.section];
    headerSearch.disabled = !operators && !Object.hasOwn(state.catalogQueries, state.section);
    const query = operators
      ? state.panes.find(pane => pane.id === searchScope.value).filters.query
      : state.catalogQueries[state.section] || '';
    if (headerSearch.value !== query) headerSearch.value = query;
  }
  function renderSidebar() {
    layout.classList.toggle('sidebar-collapsed', state.sidebarCollapsed);
    const label = state.sidebarCollapsed ? '展开侧栏' : '收起侧栏';
    sidebarToggle.setAttribute('aria-expanded', String(!state.sidebarCollapsed));
    sidebarToggle.setAttribute('aria-label', label);
    sidebarToggle.title = label;
    for (const button of sectionButtons) {
      if (button.dataset.encyclopediaSection === state.section) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    }
  }
  function reportGroup(title, cards) {
    return cards.length ? `<section class="catalog-group"><h3>${title} <small>${cards.length}</small></h3><div class="catalog-grid">${cards.join('')}</div></section>` : '';
  }
  function renderCatalog(resetScroll = false) {
    const { section, catalogQueries } = state;
    if (section === 'equipment') {
      equipmentPage.setQuery(catalogQueries.equipment);
      return;
    }
    if (!Object.hasOwn(catalogFilters, section)) return;
    const panel = layout.querySelector(`[data-section-panel="${section}"]`);
    const results = panel.querySelector('.catalog-results');
    const scrollTop = resetScroll ? 0 : results.scrollTop;
    const selected = catalogFilters[section];
    const needle = catalogQueries[section].trim().toLowerCase();
    const matches = (...fields) => !needle || fields.some(field => field.toLowerCase().includes(needle));
    for (const button of panel.querySelectorAll('[data-catalog-filter]')) {
      const active = button.dataset.catalogFilter === selected;
      button.classList.toggle('selected', active);
      button.setAttribute('aria-pressed', String(active));
    }
    let total = 0;
    const alliances = section === 'alliances';
    const markup = alliances ? [
      ['core', '核心盟约', data.coreAlliances],
      ['addon', '独立盟约', data.addonAlliances]
    ].filter(([key]) => selected === 'all' || selected === key).map(([, title, names]) => {
      const cards = names.filter(name => matches(name, title, ...definitions[name].rules.flatMap(rule =>
        [rule.label, rule.body, rule.threshold ? `${rule.threshold}人` : '']
      ))).map(name => {
        const progress = model.allianceProgress(name, state.members);
        return `<article class="catalog-card" data-report-alliance="${escapeHtml(name)}">
          <div class="catalog-card-heading"><h4>${escapeHtml(name)}</h4><span class="catalog-meta${progress.activeThreshold ? ' active' : ''}">${progressLabel(progress)}</span></div>
          ${ruleMarkup(name, { compact: true })}
          <button type="button" class="text-button catalog-link" data-compare-alliance="${escapeHtml(name)}">右侧查找干员 ↗</button>
        </article>`;
      });
      total += cards.length;
      return reportGroup(title, cards);
    }) : [
      ['general', '通用策略', strategy => !strategy.alliance],
      ['linked', '盟约策略', strategy => !!strategy.alliance]
    ].filter(([key]) => selected === 'all' || selected === key).map(([, title, inGroup]) => {
      const cards = strategies.filter(strategy => inGroup(strategy) && matches(
        strategy.name, strategy.effect, strategy.alliance || '', title, `${strategy.initialLife}点`
      )).map(strategy => `<article class="catalog-card" data-report-strategy="${escapeHtml(strategy.name)}">
        <div class="catalog-card-heading"><h4>${escapeHtml(strategy.name)}</h4>${strategy.alliance ? `<span class="catalog-tag">${escapeHtml(strategy.alliance)}</span>` : ''}</div>
        <p class="catalog-meta">初始目标生命值 <strong>${strategy.initialLife}</strong></p>
        <p class="catalog-effect">${abilityMarkup(strategy.effect)}</p>
      </article>`);
      total += cards.length;
      return reportGroup(title, cards);
    });
    const noun = alliances ? '盟约' : '策略';
    panel.querySelector('.catalog-count').textContent = `显示 ${total} / ${alliances ? Object.keys(definitions).length : strategies.length} 项${noun}`;
    results.innerHTML = markup.join('') || `<div class="relation-empty"><h3>没有匹配的${noun}</h3><p>换个关键词，或选择「全部」扩大范围。</p></div>`;
    results.scrollTop = scrollTop;
  }
  function renderPane(pane) {
    renderHeaderSearch();
    const node = root.querySelector(`[data-pane="${pane.id}"]`) || mountPane(pane);
    const scrollTop = pane.scrollTop;
    const f = pane.filters;
    node.querySelector('[data-filters-details]').open = pane.filtersOpen;
    node.querySelector('h2').textContent = f.alliances.length ? f.alliances.join(' · ') : '全部干员';
    node.querySelector('.pane-thresholds').innerHTML = f.alliances.map(name => {
      const { thresholds, exclusiveMax } = definitions[name];
      const prefix = f.alliances.length > 1 ? `${escapeHtml(name)} ` : '';
      const requirement = exclusiveMax ? `仅 ${exclusiveMax} 人` : `${thresholds.join('、')} 人`;
      return `<span>${prefix}${requirement}触发</span>`;
    }).join('');
    for (const input of node.querySelectorAll('[data-search]')) if (input.value !== f[input.dataset.search]) input.value = f[input.dataset.search];
    for (const button of node.querySelectorAll('[data-filter]')) {
      const kind = button.dataset.filter;
      const values = kind === 'bans' ? state.bannedAlliances : f[kind];
      const value = filterValue(kind, button.dataset.value);
      const selected = button.dataset.value === 'all' ? !values.length : values.includes(value);
      button.classList.toggle('selected', selected); button.setAttribute('aria-pressed', String(selected));
    }
    for (const button of node.querySelectorAll('[data-mode]')) {
      const selected = button.dataset.mode === f.selectionMode;
      button.classList.toggle('selected', selected); button.setAttribute('aria-pressed', String(selected));
    }
    node.querySelector('.mode-help').textContent = f.selectionMode === 'single' ? '各组单选；多选时可选择全部符合或符合任一。' : '模式统一作用于盟约、分类与词条；阶级始终按允许范围匹配。';
    const chips = [];
    for (const key of ['alliances', 'tiers', 'categories', 'keywords']) for (const value of f[key]) {
      const label = key === 'tiers' ? tierLabel(value) : key === 'keywords' ? analysis.terms[value].label : value;
      chips.push(`<button type="button" class="active-chip" data-remove-filter="${key}" data-value="${escapeHtml(value)}" aria-label="取消${escapeHtml(label)}筛选">${escapeHtml(label)} <span aria-hidden="true">×</span></button>`);
    }
    node.querySelector('.active-filters').innerHTML = chips.join('');
    const banCount = state.bannedAlliances.length;
    const filterCount = chips.length ? `${chips.length} 项已选` : '阶级 · 盟约 · 特质 · 联动';
    node.querySelector('.filter-selection-count').textContent = banCount ? `${filterCount} · BAN ${banCount}` : filterCount;
    node.querySelector('.ban-selection-count').textContent = banCount ? `${banCount} 项已选` : '未设置';
    node.querySelector('[data-clear-bans]').hidden = !banCount;
    renderAllianceReference(node, pane);
    const matches = data.operators.filter(operator => filter.matches(operator, f))
      .sort((a, b) => data.tiers.indexOf(a.tier) - data.tiers.indexOf(b.tier));
    node.querySelector('.result-count').textContent = `${matches.length} / ${data.operators.length} 项`;
    const openTraitDetails = new Set([...node.querySelectorAll('.trait-details[open]')].map(details => details.closest('.operator-card').dataset.operatorId));
    node.querySelector('.operator-results').innerHTML = matches.map(operator => renderCard(operator, pane)).join('');
    for (const card of node.querySelectorAll('.operator-card')) if (openTraitDetails.has(card.dataset.operatorId)) card.querySelector('.trait-details').open = true;
    node.querySelector('.empty-state').hidden = !!matches.length;
    node.querySelector('.pane-scroll').scrollTop = scrollTop;
  }
  function renderRoster() {
    const limit = state.personnelDocument ? 9 : 8;
    const memberCount = document.getElementById('member-count');
    memberCount.textContent = `${state.members.length}/${limit}`;
    memberCount.title = `已选 ${state.members.length} 人，参考上限 ${limit} 人`;
    const personnelButton = document.getElementById('toggle-personnel-document');
    personnelButton.classList.toggle('selected', state.personnelDocument);
    personnelButton.setAttribute('aria-pressed', String(state.personnelDocument));
    const progress = model.progress(state.members);
    document.getElementById('roster-summary').innerHTML = progress.length ? progress.map(item => `<div class="roster-alliance ${item.activeThreshold ? 'is-active' : ''}"><button type="button" data-view-alliance="${item.name}" aria-label="查看${item.name}盟约效果"><strong>${item.name}</strong><span class="progress-numbers">${item.count}<span>/${item.nextThreshold}</span></span><span class="activation-status">${item.activeThreshold ? `${item.activeThreshold}人档已激活` : '未激活'}</span></button><button type="button" class="find-alliance" data-compare-alliance="${item.name}" aria-label="在右侧查找${item.name}干员" title="在右侧找${item.name}干员">↗</button></div>`).join('') : '<span class="roster-empty">把干员加入这里，查看盟约人数与激活进度。<span>收起时也能拖入</span></span>';
    document.getElementById('roster-members').innerHTML = state.members.length ? state.members.map(member => {
      const operator = data.operators.find(operator => operator.id === member.id);
      const gear = equipment.byName.get(member.transferEquipment);
      const granted = gear?.grantAlliance;
      const grantLabel = granted && operator.alliances.includes(granted) ? `已有${granted}` : `＋${granted}`;
      const banned = model.isBanned(operator, state.bannedAlliances);
      return `<article class="roster-member${banned ? ' is-banned' : ''}" data-member-id="${member.id}">
        ${avatarMarkup(operator, 36)}
        <div>
          <strong>${operator.name}</strong>
          <span>${operator.alliances.join(' · ')}</span>
          ${banned ? '<span class="ban-tag">BAN</span>' : ''}
          ${granted ? `<span class="transfer-tag">${grantLabel} · 占${equipment.transferSlots}格</span>` : ''}
        </div>
        <button type="button" class="member-state ${member.elite ? 'elite' : ''}" data-member-elite="${member.id}" aria-pressed="${member.elite}" aria-label="切换阵容中${operator.name}的普通精锐状态">${member.elite ? '精锐' : '普通'}</button>
        <button type="button" class="member-transfer ${granted ? 'is-set' : ''}" data-member-transfer="${member.id}" aria-label="设置${operator.name}的转职配装">转职</button>
        <button type="button" class="remove-member" data-remove-member="${member.id}" aria-label="移除${operator.name}">×</button>
      </article>`;
    }).join('') : '<div class="roster-drop-placeholder">拖入一名干员，开始构建阵容</div>';
    document.getElementById('roster-body').hidden = !state.rosterOpen;
    document.getElementById('toggle-roster').textContent = state.rosterOpen ? '收起 ⌄' : '展开 ⌃';
    document.getElementById('toggle-roster').setAttribute('aria-expanded', String(state.rosterOpen));
    roster.classList.toggle('is-open', state.rosterOpen);
  }
  function render() {
    for (const panel of sectionPanels) panel.hidden = panel.dataset.sectionPanel !== state.section;
    renderSidebar();
    renderHeaderSearch();
    for (const node of root.querySelectorAll('[data-pane]')) if (!state.panes.some(pane => pane.id === node.dataset.pane)) node.remove();
    root.classList.toggle('is-split', state.panes.length === 2);
    const add = document.getElementById('add-compare');
    add.hidden = state.section !== 'operators';
    add.disabled = state.panes.length === 2; add.textContent = state.panes.length === 2 ? '✓ 已并排检索' : '＋ 并排检索';
    if (state.section === 'operators') state.panes.forEach(renderPane);
    else renderCatalog();
    renderRoster(); persist();
  }
  function openCompare(name) {
    state.section = 'operators';
    model.openCompare(state, name);
    if (allianceDialog.open) allianceDialog.close();
    render();
    root.querySelector('[data-pane="compare"]')?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    notify(name ? `右侧已打开${name}检索，左侧与阵容保留` : '已打开独立的右侧检索');
  }
  function addMember(id, pane) {
    const operator = data.operators.find(operator => operator.id === id);
    if (!operator) return;
    const first = !state.members.length;
    if (!model.addMember(state, id, pane?.elites.includes(id))) { notify(`${operator.name}已在阵容，不重复计数`); return; }
    if (first) state.rosterOpen = true;
    render(); notify(`已加入${operator.name} · 阵容 ${state.members.length} 人`);
  }
  function showAlliance(name) {
    if (!definitions[name]) return;
    document.getElementById('alliance-dialog-title').textContent = `${name} · 盟约效果`;
    document.getElementById('alliance-dialog-content').innerHTML = `<div class="dialog-alliance-progress">${progressLabel(model.allianceProgress(name, state.members))}</div>${ruleMarkup(name)}<button type="button" class="primary-button find-from-dialog" data-compare-alliance="${name}">在右侧找${name}干员 ↗</button>`;
    if (!allianceDialog.open) allianceDialog.showModal();
  }
  function renderTransferPreview() {
    const preview = document.getElementById('transfer-preview');
    const gear = equipment.byName.get(transferSelect.value);
    if (!gear) {
      preview.textContent = '选择与变形同构体一起装备的部件。两件装备各占一格。';
      return;
    }
    const operator = data.operators.find(operator => operator.id === transferMemberId);
    const alreadyHasAlliance = operator.alliances.includes(gear.grantAlliance);
    const result = alreadyHasAlliance
      ? `已拥有【${gear.grantAlliance}】，仍按一名干员计入。`
      : `额外获得【${gear.grantAlliance}】，计入该盟约人数。`;
    preview.innerHTML = `<strong>${equipment.transferItem} ＋ ${escapeHtml(gear.name)}</strong>
      <p>合计占 ${equipment.transferSlots} 个装备格。${result}</p>`;
  }
  function showTransfer(id) {
    const member = state.members.find(member => member.id === id);
    if (!member) return;
    transferMemberId = id;
    const operator = data.operators.find(operator => operator.id === id);
    document.getElementById('transfer-title').textContent = `${operator.name} · 转职配装`;
    transferSelect.innerHTML = '<option value="">未配置转职</option>' + equipment.transferGear.map(gear =>
      `<option value="${escapeHtml(gear.name)}">${gear.tier} 阶 · ${escapeHtml(gear.name)} → ${gear.grantAlliance}${operator.alliances.includes(gear.grantAlliance) ? '（已有）' : ''}</option>`
    ).join('');
    transferSelect.value = member.transferEquipment || '';
    renderTransferPreview();
    transferDialog.showModal();
  }
  searchScope.addEventListener('change', renderHeaderSearch);
  transferSelect.addEventListener('change', renderTransferPreview);
  document.getElementById('transfer-close').addEventListener('click', () => transferDialog.close());
  document.getElementById('transfer-apply').addEventListener('click', () => {
    if (!model.setTransfer(state, transferMemberId, transferSelect.value)) return;
    transferDialog.close();
    render();
    roster.querySelector(`[data-member-transfer="${transferMemberId}"]`)?.focus({ preventScroll: true });
  });
  document.addEventListener('input', event => {
    const input = event.target.closest('[data-search]');
    if (!input || event.isComposing) return;
    if (input === headerSearch && state.section !== 'operators') {
      if (Object.hasOwn(state.catalogQueries, state.section)) {
        state.catalogQueries[state.section] = input.value;
        renderCatalog(true); persist();
      }
      return;
    }
    const paneId = input === headerSearch ? searchScope.value : input.closest('[data-pane]')?.dataset.pane;
    const pane = state.panes.find(pane => pane.id === paneId);
    if (!pane) return;
    pane.filters[input.dataset.search] = input.value;
    renderPane(pane); persist();
  });
  document.addEventListener('compositionend', event => {
    if (event.target.matches('[data-search]')) event.target.dispatchEvent(new Event('input', { bubbles: true }));
  });
  document.addEventListener('toggle', event => {
    const node = event.target.closest('[data-pane]');
    if (!node) return;
    const pane = state.panes.find(pane => pane.id === node.dataset.pane);
    if (!pane) return;
    if (event.target.matches('[data-filters-details]')) pane.filtersOpen = event.target.open;
    else if (event.target.matches('[data-effect-alliance]')) {
      const name = event.target.dataset.effectAlliance;
      pane.effectsExpanded = pane.effectsExpanded.filter(value => value !== name);
      if (event.target.open) pane.effectsExpanded.push(name);
    } else return;
    persist();
  }, true);
  document.addEventListener('click', event => {
    const button = event.target.closest('button'); if (!button) return;
    if (button.id === 'toggle-sidebar') {
      state.sidebarCollapsed = !state.sidebarCollapsed;
      renderSidebar(); persist();
      return;
    }
    if (button.dataset.encyclopediaSection) {
      const next = button.dataset.encyclopediaSection;
      if (next !== state.section) {
        state.section = next;
        render();
      }
      return;
    }
    if (button.dataset.catalogFilter) {
      catalogFilters[state.section] = button.dataset.catalogFilter;
      renderCatalog(true);
      return;
    }
    if (button.hasAttribute('data-clear-bans')) {
      state.bannedAlliances = [];
      render();
      return;
    }
    const paneNode = button.closest('[data-pane]');
    const pane = state.panes.find(pane => pane.id === paneNode?.dataset.pane);
    if (button.dataset.filter) {
      const key = button.dataset.filter;
      const rawValue = button.dataset.value;
      if (key === 'bans') {
        state.bannedAlliances = filter.toggleSelection(state.bannedAlliances, rawValue, 'any');
        render();
        return;
      }
      const value = filterValue(key, rawValue);
      pane.filters[key] = rawValue === 'all' ? [] : filter.toggleSelection(pane.filters[key], value, pane.filters.selectionMode);
      if (key === 'alliances' && rawValue !== 'all' && pane.filters.alliances.includes(value)) pane.effectsExpanded = [value];
      renderPane(pane); persist();
    } else if (button.dataset.mode) {
      pane.filters = filter.normalize({ ...pane.filters, selectionMode: button.dataset.mode }); renderPane(pane); persist();
    } else if (button.dataset.removeFilter) {
      const key = button.dataset.removeFilter;
      const value = filterValue(key, button.dataset.value);
      pane.filters[key] = pane.filters[key].filter(item => item !== value); renderPane(pane); persist();
    } else if (button.hasAttribute('data-reset-pane')) {
      pane.filters = filter.normalize(); pane.scrollTop = 0; pane.effectsExpanded = []; renderPane(pane); persist();
    } else if (button.dataset.preview) {
      const id = button.dataset.operator;
      pane.elites = pane.elites.filter(value => value !== id); if (button.dataset.preview === 'elite') pane.elites.push(id);
      renderPane(pane); persist(); paneNode.querySelector(`[data-operator="${id}"][data-preview="${button.dataset.preview}"]`)?.focus({ preventScroll: true });
    } else if (button.dataset.addOp) {
      addMember(button.dataset.addOp, pane);
      paneNode?.querySelector(`[data-add-op="${button.dataset.addOp}"]`)?.focus({ preventScroll: true });
    } else if (button.dataset.removeMember) {
      const name = data.operators.find(operator => operator.id === button.dataset.removeMember).name;
      model.removeMember(state, button.dataset.removeMember); render(); notify(`已移除${name}，盟约人数已更新`);
    } else if (button.dataset.memberTransfer) {
      showTransfer(button.dataset.memberTransfer);
    } else if (button.dataset.memberElite) {
      const member = state.members.find(member => member.id === button.dataset.memberElite); member.elite = !member.elite;
      render(); roster.querySelector(`[data-member-elite="${member.id}"]`)?.focus({ preventScroll: true });
    } else if (button.dataset.viewAlliance) showAlliance(button.dataset.viewAlliance);
    else if (button.dataset.compareAlliance) openCompare(button.dataset.compareAlliance);
    else if (button.id === 'add-compare') openCompare();
    else if (button.hasAttribute('data-close-compare')) { model.closeCompare(state); render(); notify('已关闭右侧检索，阵容与左侧条件已保留'); }
    else if (button.id === 'toggle-roster') { state.rosterOpen = !state.rosterOpen; renderRoster(); persist(); }
    else if (button.id === 'toggle-personnel-document') { state.personnelDocument = !state.personnelDocument; renderRoster(); persist(); }
    else if (button.id === 'alliance-dialog-close') allianceDialog.close();
  });
  // 使用指针捕获完成拖动，避免依赖浏览器原生Drag & Drop的跨容器投放握手。
  // 按钮和链接仍可直接操作；触屏从头像或标题发起，其余正文保持可滚动。
  let dragging = null;
  function overRoster(event) {
    const rect = roster.getBoundingClientRect();
    return event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
  }
  function cancelDrag() {
    const previous = dragging; dragging = null;
    if (previous?.card.hasPointerCapture(previous.pointerId)) previous.card.releasePointerCapture(previous.pointerId);
    previous?.preview?.remove();
    roster.classList.remove('drop-ready','drop-active'); document.body.classList.remove('dragging-card');
  }
  document.addEventListener('pointerdown', event => {
    if (event.button !== 0 || event.isPrimary === false || event.target.closest('button,a,input,summary')) return;
    const card = event.target.closest('.operator-card'); if (!card || card.hasAttribute('data-reference-only')) return;
    if (event.pointerType === 'touch' && !event.target.closest('.operator-heading')) return;
    cancelDrag();
    dragging = { card, pointerId: event.pointerId, id: card.dataset.operatorId,
      paneId: card.closest('[data-pane]').dataset.pane, x: event.clientX, y: event.clientY, moved: false };
    card.setPointerCapture(event.pointerId);
  });
  document.addEventListener('pointermove', event => {
    if (!dragging || dragging.pointerId !== event.pointerId) return;
    if (!dragging.moved && Math.hypot(event.clientX - dragging.x, event.clientY - dragging.y) < 8) return;
    if (!dragging.moved) {
      dragging.moved = true;
      dragging.preview = document.createElement('div'); dragging.preview.className = 'drag-preview';
      dragging.preview.textContent = `＋ ${data.operators.find(operator => operator.id === dragging.id).name}`;
      document.body.append(dragging.preview); document.body.classList.add('dragging-card');
    }
    dragging.preview.style.transform = `translate(${event.clientX + 14}px, ${event.clientY - 15}px)`;
    roster.classList.add('drop-ready'); roster.classList.toggle('drop-active', overRoster(event));
    if (event.cancelable) event.preventDefault();
  });
  document.addEventListener('pointerup', event => {
    if (!dragging || dragging.pointerId !== event.pointerId) return;
    const previous = dragging;
    const accepted = previous.moved && overRoster(event);
    cancelDrag();
    if (accepted) addMember(previous.id, state.panes.find(pane => pane.id === previous.paneId));
  });
  document.addEventListener('pointercancel', cancelDrag);
  document.addEventListener('keydown', event => { if (event.key === 'Escape') cancelDrag(); });
  window.addEventListener('blur', cancelDrag);
  allianceDialog.addEventListener('click', event => { if (event.target === allianceDialog) { const rect=allianceDialog.getBoundingClientRect(); if(event.clientX<rect.left || event.clientX>rect.right || event.clientY<rect.top || event.clientY>rect.bottom) allianceDialog.close(); } });
  window.addEventListener('pagehide', persist);
  render();
})();
