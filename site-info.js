(() => {
  const versionButton = document.getElementById('version-trigger');
  const latestVersion = document.querySelector('#release-notes .release-history h3').textContent;
  versionButton.textContent = latestVersion;
  versionButton.setAttribute('aria-label', latestVersion + ' · 更新记录');

  const header = document.querySelector('.site-header');
  const menuButton = document.getElementById('mobile-menu-toggle');
  const actions = document.getElementById('header-actions');
  const mobile = window.matchMedia('(max-width: 760px), (max-width: 1000px) and (pointer: coarse)');
  function closeMenu(returnFocus = false) {
    header.classList.remove('menu-open');
    menuButton.setAttribute('aria-expanded', 'false');
    if (returnFocus) menuButton.focus();
  }
  menuButton.addEventListener('click', () => {
    const open = header.classList.toggle('menu-open');
    menuButton.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('click', event => {
    if (!actions.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && header.classList.contains('menu-open')) {
      closeMenu(true);
    }
  });
  actions.addEventListener('click', event => {
    if (!mobile.matches) return;
    const action = event.target.closest('button, a');
    if (!action) return;
    // Keep focus outside the menu when it is hidden. Dialog triggers below
    // record this visible button as their return target on mobile.
    closeMenu(true);
  }, true);
  mobile.addEventListener('change', () => {
    const focusedInside = actions.contains(document.activeElement);
    closeMenu(mobile.matches && focusedInside);
  });

  for (const button of document.querySelectorAll('[data-open-info]')) {
    const dialog = document.getElementById(button.getAttribute('aria-controls'));
    button.addEventListener('click', () => {
      dialog.showModal();
      if (mobile.matches) dialog.addEventListener('close', () => menuButton.focus(), { once: true });
    });
  }
})();
