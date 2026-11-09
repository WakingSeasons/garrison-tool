(() => {
  const versionButton = document.getElementById('version-trigger');
  const latestVersion = document.querySelector('#release-notes .release-history h3').textContent;
  versionButton.textContent = latestVersion;
  versionButton.setAttribute('aria-label', latestVersion + ' · 更新记录');

  for (const button of document.querySelectorAll('[data-open-info]')) {
    const dialog = document.getElementById(button.getAttribute('aria-controls'));
    button.addEventListener('click', () => dialog.showModal());
  }
})();
