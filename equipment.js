"use strict";

(() => {
  const catalog = window.GARRISON_EQUIPMENT;
  const page = document.getElementById('equipment-report');
  const results = document.getElementById('equipment-results');
  const count = document.getElementById('equipment-count');
  const tierFilters = document.getElementById('equipment-tier-filters');
  const kindFilters = document.getElementById('equipment-combination-filters');
  const tiers = [1, 2, 3, 4, 5, 6];
  const state = { view: 'items', tier: 0, kind: 'all', query: null };
  const escapeHtml = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

  tierFilters.innerHTML = [0, ...tiers].map(tier =>
    `<button type="button" data-equipment-tier="${tier}" aria-pressed="${tier === 0}">${tier ? `${tier} 阶` : '不限等阶'}</button>`
  ).join('');

  function matches(needle, ...values) {
    return !needle || values.some(value => typeof value === 'string' && value.toLowerCase().includes(needle));
  }

  function effectMarkup(item, showBasicLabel = false) {
    return `<div class="equipment-effects">
      <div>${item.upgraded || showBasicLabel ? '<span>基础</span>' : ''}<p>${escapeHtml(item.effect)}</p></div>
      ${item.upgraded ? `<div><span>进阶</span><p>${escapeHtml(item.upgraded)}</p></div>` : ''}
    </div>`;
  }

  function section(title, cards, description = '') {
    if (!cards.length) return '';
    return `<section class="equipment-section">
      <h3>${title} <small>${cards.length}</small></h3>
      ${description ? `<p class="equipment-section-note">${description}</p>` : ''}
      <div class="equipment-grid">${cards.join('')}</div>
    </section>`;
  }

  function renderItems(needle) {
    const displayed = catalog.items.filter(item => {
      if (state.tier && item.tier !== state.tier) return false;
      const related = catalog.recipes.filter(recipe => recipe.result === item.name || recipe.parts.includes(item.name));
      return matches(needle, item.name, item.effect, item.upgraded, item.grantAlliance,
        item.grantAlliance ? catalog.transferItem : '', ...related.flatMap(recipe => [...recipe.parts, recipe.result]));
    });
    count.textContent = `显示 ${displayed.length} / ${catalog.items.length} 件装备`;
    return tiers.map(tier => section(`${tier} 阶装备`, displayed.filter(item => item.tier === tier).map(item => {
      const recipe = catalog.recipes.find(recipe => recipe.result === item.name || recipe.parts.includes(item.name));
      return `<article class="equipment-card" data-equipment-item="${escapeHtml(item.name)}">
        <div class="equipment-card-heading"><h4>${escapeHtml(item.name)}</h4><span>配置价 ${escapeHtml(item.price)}</span></div>
        ${effectMarkup(item)}
        ${item.grantAlliance ? `<p class="equipment-relation">搭配${catalog.transferItem}，额外获得【${item.grantAlliance}】。共占 ${catalog.transferSlots} 格。</p>` : ''}
        ${recipe ? `<p class="equipment-relation">${recipe.parts.map(escapeHtml).join(' ＋ ')} → ${escapeHtml(recipe.result)} · ${recipe.slots} 格</p>` : ''}
        ${item.name === catalog.transferItem ? `<p class="equipment-relation">与指定装备同时携带。打开「联合装备 → 转职配装」查看对应盟约。</p>` : ''}
      </article>`;
    }))).join('');
  }

  function renderCombinations(needle) {
    let total = 0;
    const sections = [];
    if (state.kind === 'all' || state.kind === 'transfer') {
      const cards = catalog.transferGear
        .filter(item => matches(needle, item.name, item.grantAlliance, catalog.transferItem, '转职配装'))
        .map(item => `<article class="equipment-card combination-card" data-equipment-rule="transfer">
          <div class="equipment-card-heading"><h4>${catalog.transferItem} ＋ ${escapeHtml(item.name)}</h4><span class="slot-badge">${catalog.transferSlots} 格</span></div>
          <p class="combination-effect">额外获得【${item.grantAlliance}】。携带者计入该盟约人数。</p>
          <p class="equipment-relation">搭配部件 ${item.tier} 阶。两件装备各占一格。</p>
        </article>`);
      total += cards.length;
      sections.push(section('转职配装', cards, '同一干员同时携带变形同构体与指定装备。配装中的两件装备各占一格。'));
    }
    if (state.kind === 'all' || state.kind === 'recipe') {
      const cards = catalog.recipes
        .filter(recipe => matches(needle, ...recipe.parts, recipe.result, catalog.byName.get(recipe.result).effect, '异名合成'))
        .map(recipe => {
          const result = catalog.byName.get(recipe.result);
          const ingredients = recipe.parts.map(name => {
            const item = catalog.byName.get(name);
            return `${escapeHtml(name)}（${item.tier} 阶）`;
          }).join(' ＋ ');
          return `<article class="equipment-card combination-card" data-equipment-rule="recipe">
            <div class="equipment-card-heading"><h4>${escapeHtml(result.name)}</h4><span class="slot-badge">${recipe.slots} 格</span></div>
            <p class="combination-formula">${ingredients} → ${escapeHtml(result.name)}（${result.tier} 阶）</p>
            <p class="combination-effect">${escapeHtml(result.effect)}</p>
          </article>`;
        });
      total += cards.length;
      sections.push(section('异名合成', cards, '指定的两个不同部件合成一件联合装备。合成结果只占一格。'));
    }
    if (state.kind === 'all' || state.kind === 'upgrade') {
      const cards = catalog.items
        .filter(item => item.upgraded && matches(needle, item.name, item.effect, item.upgraded, '同名进阶'))
        .map(item => `<article class="equipment-card combination-card" data-equipment-rule="upgrade">
          <div class="equipment-card-heading"><h4>${escapeHtml(item.name)} · ${item.tier} 阶</h4><span class="slot-badge">1 格</span></div>
          <p class="combination-formula">两件基础${escapeHtml(item.name)} → 一件进阶${escapeHtml(item.name)}</p>
          ${effectMarkup(item, true)}
        </article>`);
      total += cards.length;
      sections.push(section('同名进阶', cards, '两件同名基础装备合并为一件进阶装备。下方列出已整理的基础和进阶效果。'));
    }
    count.textContent = `显示 ${total} 组配装与合成规则`;
    return sections.join('');
  }

  function render() {
    const combinations = state.view === 'combinations';
    tierFilters.hidden = combinations;
    kindFilters.hidden = !combinations;
    for (const button of page.querySelectorAll('[data-equipment-view], [data-equipment-tier], [data-equipment-kind]')) {
      const selected = button.dataset.equipmentView === state.view ||
        Number(button.dataset.equipmentTier) === state.tier || button.dataset.equipmentKind === state.kind;
      button.classList.toggle('selected', selected);
      button.setAttribute('aria-pressed', String(selected));
    }
    const needle = state.query.trim().toLowerCase();
    const markup = combinations ? renderCombinations(needle) : renderItems(needle);
    results.innerHTML = markup || '<div class="relation-empty"><h3>没有匹配的装备</h3><p>可以换个关键词，或放宽筛选条件。</p></div>';
    results.scrollTop = 0;
  }

  page.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button) return;
    if (button.dataset.equipmentView) state.view = button.dataset.equipmentView;
    else if (button.dataset.equipmentTier !== undefined) state.tier = Number(button.dataset.equipmentTier);
    else if (button.dataset.equipmentKind) state.kind = button.dataset.equipmentKind;
    else return;
    render();
  });
  window.GARRISON_EQUIPMENT_PAGE = {
    setQuery(query) {
      if (query === state.query) return;
      state.query = query;
      render();
    }
  };
})();
