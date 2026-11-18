"use strict";

(() => {
  const { levels, maps } = window.GARRISON_BOSS_ROUTES;
  const dialog = document.getElementById('boss-route-dialog');
  const title = document.getElementById('boss-route-title');
  const mapSelect = document.getElementById('boss-route-map');
  const canvas = document.getElementById('boss-route-chart');
  const zoom = document.getElementById('boss-route-zoom');
  const prts = document.getElementById('boss-route-prts');
  const source = document.getElementById('boss-route-source');
  const clientRoot = 'https://github.com/Kengxxiao/ArknightsGameData/blob/6f63c14e27b847ef74b53b00fe51fc322b3cd7ff/zh_CN/gamedata/levels/activities/act3autochess/';
  const mapWiki = 'https://prts.wiki/w/卫戍协议·规程/战场一览';
  const colors = ['#805028', '#176751', '#265d9f', '#805495'];
  const cell = 60;
  const cols = 17;
  const rows = 5;
  let enemy;

  for (const id of Object.keys(maps).sort()) {
    mapSelect.add(new Option('战场 #' + id, id));
  }

  function setZoom(expanded) {
    zoom.classList.toggle('is-zoomed', expanded);
    zoom.setAttribute('aria-pressed', String(expanded));
    zoom.setAttribute('aria-label', expanded ? '还原路线图' : '放大路线图');
    zoom.lastElementChild.textContent = expanded ? '点击还原' : '点击放大';
    zoom.parentElement.scrollLeft = 0;
  }

  function arrow(ctx, points, color) {
    let start = points[0];
    let end = points[1];
    let longest = 0;
    for (let i = 1; i < points.length; i++) {
      const [x1, y1] = points[i - 1];
      const [x2, y2] = points[i];
      const length = Math.hypot(x2 - x1, y2 - y1);
      if (length > longest) {
        [start, end] = [points[i - 1], points[i]];
        longest = length;
      }
    }
    const [x1, y1] = start;
    const [x2, y2] = end;
    if (!longest) return;
    const dx = (x2 - x1) / longest;
    const dy = (y2 - y1) / longest;
    // Opposite arrows on a shared stretch stay visible on opposite sides.
    ctx.save();
    ctx.translate((x1 + x2) / 2 - 6 * dy, (y1 + y2) / 2 + 6 * dx);
    ctx.rotate(Math.atan2(dy, dx));
    ctx.beginPath();
    ctx.moveTo(10, 0);
    ctx.lineTo(-8, -8);
    ctx.lineTo(-8, 8);
    ctx.closePath();
    ctx.strokeStyle = '#f7faf7';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
  }

  function draw() {
    const id = mapSelect.value;
    const beast = enemy.id === 'enemy_2124_dyjsfg';
    const point = ([row, col]) => [(col - 2 + 0.5) * cell, (rows - row + 0.5) * cell];
    const ctx = canvas.getContext('2d');
    const width = cols * cell;
    const height = rows * cell;
    ctx.setTransform(canvas.width / width, 0, 0, canvas.height / height, 0, 0);
    ctx.fillStyle = '#f4f7f4';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = '#e5eee7';
    ctx.fillRect(8 * cell, 0, cell, height);
    ctx.strokeStyle = '#d5e0d8';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = cell; x < width; x += cell) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }
    for (let y = cell; y < height; y += cell) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
    ctx.stroke();
    ctx.fillStyle = '#52675e';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('左侧', 4 * cell, height - cell / 2);
    ctx.fillText('右侧', 13 * cell, height - cell / 2);

    const left = maps[id].left.map(leg => leg.map(point));
    const right = maps[id][beast ? 'rightBeast' : 'right'].map(leg => leg.map(point));
    if (beast) {
      left[0][0][0] -= 0.2 * cell;
      right[0][0][0] += 0.2 * cell;
    }
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    for (const legs of [left, right]) {
      legs.forEach((points, index) => {
        ctx.setLineDash(index === 0 ? [4, 6] : index === 2 ? [9, 7] : []);
        ctx.strokeStyle = colors[index];
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(...points[0]);
        for (const entry of points.slice(1)) ctx.lineTo(...entry);
        ctx.stroke();
      });
      ctx.setLineDash([]);
      legs.forEach((points, index) => arrow(ctx, points, colors[index]));
    }

    function marker([x, y], index) {
      ctx.beginPath();
      ctx.arc(x, y, 19, 0, 2 * Math.PI);
      ctx.fillStyle = colors[index];
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#f7faf7';
      ctx.stroke();
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText(index || '出', x, y + 1);
    }
    marker(point(maps[id].left[0][0]), 0);
    for (const legs of [left, right]) {
      legs.slice(1).forEach(([start], i) => marker(start, i + 1));
    }

    canvas.setAttribute('aria-label', `${enemy.name} · 战场 #${id} · 同盟双人完整场地，两侧各自从出生点前往巡逻点 1、2、3，再返回 1`);
    prts.href = mapWiki + '#%23' + id;
    source.href = clientRoot + 'level_act3autochess_h07_' + levels[enemy.id] + '.json';
  }

  mapSelect.addEventListener('change', draw);
  zoom.addEventListener('click', () => setZoom(!zoom.classList.contains('is-zoomed')));
  window.GARRISON_BOSS_ROUTE_VIEW = {
    has(id) {
      return Object.hasOwn(levels, id);
    },
    open(entry) {
      enemy = entry;
      title.textContent = entry.name + ' · 巡逻路线';
      setZoom(false);
      draw();
      dialog.showModal();
    }
  };
})();
