"use strict";

(() => {
  const site = document.currentScript.dataset.goatcounterSite;
  const publishedOrigin = 'https://wakingseasons.github.io';
  const sitePath = '/garrison-tool/';
  if (!/^[a-z0-9][a-z0-9-]{0,63}$/.test(site ?? '') ||
      location.origin !== publishedOrigin ||
      !location.pathname.startsWith(sitePath)) return;

  const endpoint = 'https://' + site + '.goatcounter.com/count';
  const preferenceKey = 'garrison-usage-disabled';
  const settings = document.getElementById('usage-settings');
  const optOut = document.getElementById('usage-opt-out');
  const events = {
    page: [sitePath, '卫戍协议·规程'],
    apply: ['apply-recognition', '套用本局信息'],
    roster: ['add-to-roster', '加入阵容'],
    boss: ['open-boss-wave', '查看 Boss 波次']
  };
  const sent = new Set();
  const browserOptOut = navigator.globalPrivacyControl === true || navigator.doNotTrack === '1';
  let disabled = false;
  try { disabled = localStorage.getItem(preferenceKey) === '1'; } catch {}
  optOut.checked = disabled || browserOptOut;
  optOut.disabled = browserOptOut;
  optOut.addEventListener('change', () => {
    disabled = optOut.checked;
    try { localStorage.setItem(preferenceKey, disabled ? '1' : '0'); } catch {}
  });
  settings.hidden = false;

  function record(name) {
    if (disabled || browserOptOut || navigator.webdriver || !Object.hasOwn(events, name) || sent.has(name)) return;
    const [path, title] = events[name];
    const params = new URLSearchParams({ p: path, t: title });
    if (name !== 'page') params.set('e', 'true');
    sent.add(name);
    // GoatCounter's public browser endpoint accepts these fixed labels. Omit site data and navigation details.
    fetch(endpoint + '?' + params, {
      mode: 'no-cors', credentials: 'omit', referrerPolicy: 'no-referrer', cache: 'no-store', keepalive: true
    }).catch(() => {});
  }

  window.GARRISON_USAGE = { record };
  document.addEventListener('garrison:recognition-applied', event => {
    if (event.detail?.ok) record('apply');
  });
  record('page');
})();
