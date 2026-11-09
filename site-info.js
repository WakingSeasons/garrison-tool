(() => {
  const guide = document.getElementById('quick-start');
  const versionButton = document.getElementById('version-trigger');
  const latestVersion = document.querySelector('#release-notes .release-history h3').textContent;
  versionButton.textContent = latestVersion;
  versionButton.setAttribute('aria-label', latestVersion + ' · 更新记录');

  for (const button of document.querySelectorAll('[data-open-info]')) {
    const dialog = document.getElementById(button.getAttribute('aria-controls'));
    button.addEventListener('click', () => dialog.showModal());
  }

  for (const button of guide.querySelectorAll('[data-guide-toggle]')) {
    const example = document.getElementById(button.getAttribute('aria-controls'));
    button.addEventListener('click', () => {
      const show = example.hidden;
      example.hidden = !show;
      button.setAttribute('aria-pressed', String(show));
      button.classList.toggle('selected', show);
    });
  }

  const exampleMembers = [{ id: 'char_4222_taraxa' }, { id: 'char_2025_shu' }];
  const dusk = { id: 'char_2015_dusk' };
  const status = document.getElementById('guide-roster-status');
  const count = document.getElementById('guide-flame-count');
  const note = document.getElementById('guide-flame-note');
  const duskAvatar = document.getElementById('guide-dusk');
  const rosterAction = document.getElementById('guide-roster-action');

  function renderExampleRoster() {
    const hasDusk = exampleMembers.includes(dusk);
    const flame = window.GARRISON_WORKSPACE.allianceProgress('炎', exampleMembers);
    const target = flame.activeThreshold || flame.nextThreshold;
    count.textContent = flame.count + '/' + target;
    note.textContent = flame.activeThreshold ? '已激活' : '还差 ' + flame.needed + ' 人';
    status.classList.toggle('is-active', Boolean(flame.activeThreshold));
    duskAvatar.hidden = !hasDusk;
    rosterAction.textContent = hasDusk ? '移出夕' : '加入夕';
  }

  rosterAction.addEventListener('click', () => {
    if (exampleMembers.includes(dusk)) {
      exampleMembers.pop();
    } else {
      exampleMembers.push(dusk);
    }
    renderExampleRoster();
  });
  renderExampleRoster();
})();
