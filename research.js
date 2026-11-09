"use strict";

(() => {
  const data = window.GARRISON_RESEARCH;
  const query = window.GARRISON_RESEARCH_QUERY;
  const dialog = document.getElementById('relation-dialog');
  const state = { term: null, kind: 'all', search: '', context: '', operator: null, history: [] };
  const escapeHtml = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
  const modeLabels = { trait: '干员特质', skill: '战斗技能', strategy: '角色策略', alliance: '盟约', equipment: '装备' };
  const groups = {
    modifies: { title: '复制、再触发与增幅', note: '改变触发方式或产出，保留具体作用对象与限制。' },
    provides: { title: '提供触发条件', note: '提供事件或积累状态所需的条件。' },
    uses: { title: '利用这个词条', note: '条件成立后，从中获得层数、资源或其他收益。' },
    indirect: { title: '间接资源支持', note: '还需要购买、使用道具等后续步骤。' }
  };
  function termButton(id, label) {
    return `<button type="button" class="term-chip ${state.term === id ? 'selected' : ''}" data-term="${id}">${escapeHtml(label || data.terms[id].label)} ↗</button>`;
  }
  function entryMarkup(entry) {
    const related = query.relatedTerms(entry.id, state.term);
    return `<article class="relation-card" data-entity="${entry.id}"><div class="relation-card-heading"><span class="entity-kind kind-${entry.kind}">${modeLabels[entry.kind]}</span><span class="evidence-label ${entry.checked ? '' : 'pending'}">${entry.checked ? '规程文本依据' : '规程适配待核'}</span></div><h4>${escapeHtml(entry.name)}</h4><p class="entity-identity">${escapeHtml(entry.identity)}</p><p class="relation-reason">${escapeHtml(entry.reason)}</p><div class="relation-condition"><span>成立条件</span><p>${escapeHtml(entry.conditions)}</p></div><details class="relation-source"><summary>效果与资料来源 ⌄</summary><p>${escapeHtml(entry.body)}</p><a href="${entry.source}" target="_blank" rel="noopener noreferrer">查看${entry.kind === 'skill' ? '技能' : '规程'}资料 ↗</a></details>${related.length ? `<div class="related-term-row"><span>继续查看</span>${related.map(id => termButton(id)).join('')}</div>` : ''}</article>`;
  }
  function render() {
    const term = data.terms[state.term];
    document.getElementById('relation-tools').hidden = !term;
    document.getElementById('relation-tip').hidden = !term;
    document.getElementById('relation-topics').hidden = !term;
    document.getElementById('relation-back').hidden = !state.history.length;
    document.getElementById('relation-context').textContent = state.context ? `从${state.context}展开 · 可查看当前盟约之外的辅助` : '直接查阅具体机制，不受左右检索条件限制。';
    if (!term) {
      document.getElementById('relation-title').textContent = state.operator ? `${state.operator.name} · 机制联动` : '机制联动';
      document.getElementById('relation-kind').textContent = 'MECHANISM LIBRARY';
      document.getElementById('relation-description').textContent = '查看谁提供条件、谁利用条件，以及干员特质、战斗技能、角色策略之间怎样配合。';
      const related = state.operator ? [...new Set(data.operators[state.operator.id].effects.flatMap(effect => effect.termIds))] : Object.keys(data.terms);
      const topics = related.length ? related : Object.keys(data.terms);
      document.getElementById('relation-content').innerHTML = `${state.operator && !related.length ? '<p class="operator-link-note">该干员的具体联动关系待补充。下方可浏览已收录的联动词条。</p>' : ''}<div class="topic-directory">${topics.map(id => `<button type="button" class="topic-card" data-term="${id}"><strong>${data.terms[id].label} ↗</strong><p>${data.terms[id].description}</p><span>${query.entries(id).length} 条已整理关系 · 特质 / 技能 / 策略</span></button>`).join('')}</div>`;
      return;
    }
    const allEntries = query.entries(state.term);
    const entries = query.entries(state.term, { kind: state.kind, query: state.search });
    document.getElementById('relation-title').textContent = term.label;
    document.getElementById('relation-kind').textContent = `机制联动 · ${term.kind}`;
    document.getElementById('relation-description').textContent = term.description;
    document.getElementById('relation-tip').textContent = term.tip;
    document.getElementById('relation-topics').innerHTML = Object.keys(data.terms).map(id => termButton(id)).join('');
    document.getElementById('relation-count').textContent = `显示 ${entries.length} 条 / 已收录 ${allEntries.length} 条`;
    for (const button of dialog.querySelectorAll('[data-relation-kind]')) {
      const kind = button.dataset.relationKind;
      button.querySelector('span').textContent = query.entries(state.term, { kind }).length;
      button.classList.toggle('selected', kind === state.kind);
      button.setAttribute('aria-pressed', String(kind === state.kind));
    }
    const order = ['gain','restEnd','cap'].includes(state.term) ? ['modifies','provides','uses','indirect'] : ['provides','uses','modifies','indirect'];
    document.getElementById('relation-content').innerHTML = entries.length ? order.map(group => {
      const items = entries.filter(entry => entry.group === group);
      return items.length ? `<section class="relation-group" data-relation-group="${group}"><div class="relation-group-title"><h3>${groups[group].title}</h3><span>${items.length}</span></div><p class="relation-group-note">${groups[group].note}</p>${items.map(entryMarkup).join('')}</section>` : '';
    }).join('') : '<div class="relation-empty"><h3>当前条件下没有已收录的关联</h3><p>可以切回“全部”，或清空搜索。</p><button type="button" class="secondary-button" id="reset-relations">查看全部关联</button></div>';
  }
  function open({ term = null, operator = null, context = '', back = false } = {}) {
    if (term && !data.terms[term]) return;
    if (dialog.open && !back) state.history.push({ term: state.term, operator: state.operator, context: state.context });
    if (!dialog.open) state.history = [];
    state.term = term; state.operator = operator; state.context = context; state.kind = 'all'; state.search = '';
    document.getElementById('relation-search').value = '';
    render(); if (!dialog.open) dialog.showModal();
    document.getElementById('relation-content').scrollTop = 0;
  }
  document.addEventListener('click', event => {
    const button = event.target.closest('button'); if (!button) return;
    if (button.hasAttribute('data-research-home')) open();
    else if (button.dataset.operatorLinks) {
      const operator = window.GARRISON_DATA.operators.find(operator => operator.id === button.dataset.operatorLinks);
      open({ operator, context: `${operator.name}的特质` });
    } else if (button.dataset.term) {
      const operator = button.closest('.operator-card')?.querySelector('h3')?.textContent;
      open({ term: button.dataset.term, context: operator ? `${operator}的特质` : state.context, operator: dialog.open ? state.operator : null });
    } else if (button.dataset.relationKind) { state.kind = button.dataset.relationKind; render(); }
    else if (button.id === 'relation-close') dialog.close();
    else if (button.id === 'relation-back') { const previous = state.history.pop(); if (previous) open({ ...previous, back: true }); }
    else if (button.id === 'reset-relations') { state.kind = 'all'; state.search = ''; document.getElementById('relation-search').value = ''; render(); }
  });
  document.getElementById('relation-search').addEventListener('input', event => { state.search = event.target.value; render(); });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
})();
