// The walk through the void: a torch, a path that appears under it,
// tangled threads of false thoughts, and lanterns that lead to each part.
// Drawn on the 2D canvas; lanterns and thread labels are real buttons.

const LEN = 2440;             // length of the path, in pixels of travel
const ITEMS = [
  { y: 170, lantern: 'rescue' },
  { y: 500, thread: 0 },
  { y: 790, lantern: 'plan' },
  { y: 1110, thread: 1 },
  { y: 1390, lantern: 'learn' },
  { y: 1610, lantern: 'practice' },
  { y: 1930, thread: 2 },
  { y: 2210, lantern: 'help' }
];
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

export function createJourney(o) {
  const cv = o.canvas, g = cv.getContext('2d'), world = o.world;
  let W = 0, H = 0, dpr = 1, raf = 0, last = 0, time = 0;
  let tx = 0, ty = 0, px = 0, py = 0, pt = 0, moved = false;
  const was = o.resume || { progress: 0, cut: [], shown: [] };
  let progress = was.progress, camY = 0, ended = false;
  const els = [];

  const pathX = (y) => W / 2 + Math.sin(y / 170) * W * .2 + Math.sin(y / 67 + 1.3) * W * .05;
  const sy = (wy) => H - (wy - camY);

  const threads = ITEMS.filter((i) => i.thread != null).map((i) => ({
    y: i.y, data: o.thoughts[i.thread], shine: 0, shown: !!was.shown[i.thread], cut: was.cut[i.thread] ? .0001 : 0, cutX: 0,
    seeds: [0, 1, 2, 3, 4].map(() => Math.random() * 10)
  }));
  const limit = () => { const t = threads.find((t) => !t.cut); return t ? t.y - 46 : LEN; };

  function build() {
    world.innerHTML = '';
    els.length = 0;
    for (const it of ITEMS) {
      if (it.lantern) {
        const b = document.createElement('button');
        b.className = 'lantern'; b.textContent = o.label(it.lantern);
        b.onclick = () => o.onLantern(it.lantern);
        world.appendChild(b); els.push({ el: b, y: it.y, side: els.length % 2 ? -1 : 1, lantern: true });
      } else {
        const th = threads[it.thread], b = document.createElement('button');
        b.className = 'thread';
        b.innerHTML = `<small>${o.t('falseThought')}</small><span></span><div class="a"><small>${o.t('truth')}</small><span></span></div>`;
        b.querySelector('span').textContent = o.L(th.data.t);
        b.querySelector('.a span').textContent = o.L(th.data.a);
        b.onclick = () => { if (!th.shown) reveal(th); else cut(th, W / 2); };   // tap also works: first shows, second cuts
        th.el = b; world.appendChild(b); els.push({ el: b, y: it.y + 74, thread: th });
        if (th.shown) b.classList.add('shown');
        if (th.cut) b.classList.add('cut');
      }
    }
    const e = document.createElement('div'); e.className = 'endmark'; e.textContent = o.t('pathOpen');
    world.appendChild(e); els.push({ el: e, y: LEN + 40, end: true });
  }

  function reveal(th) { th.shown = true; th.el.classList.add('shown'); o.onReveal && o.onReveal(threads.indexOf(th)); }
  function cut(th, x) {
    if (th.cut) return;
    th.cut = time || .001; th.cutX = x; th.el.classList.add('cut');
    o.onCut(threads.indexOf(th));
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = cv.clientWidth; H = cv.clientHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!moved) { tx = pathX(progress); ty = H * .58; camY = progress - H * .42; setTorch(); }
  }
  function setTorch() {
    document.documentElement.style.setProperty('--tx', tx + 'px');
    document.documentElement.style.setProperty('--ty', ty + 'px');
  }

  function onMove(e) {
    if (e.target.closest && e.target.closest('#ui button, #ui a, .top')) return;
    const now = performance.now();
    const nx = e.clientX, ny = e.clientY;
    if (moved) {
      // A fast swipe near a shown thread cuts it.
      const dist = Math.hypot(nx - px, ny - py), dt = Math.max(1, now - pt);
      for (const th of threads) {
        if (th.cut || !th.shown) continue;
        const y = sy(th.y);
        const crosses = (py - y) * (ny - y) <= 0 || (Math.abs(ny - y) < 46 && Math.abs(nx - px) > 24);
        if (crosses && dist / dt > .35 && dist > 10) cut(th, nx);
      }
    }
    px = nx; py = ny; pt = now; tx = nx; ty = ny; moved = true; setTorch();
    if (o.reduced) frame(now);
  }
  function onDown(e) { moved = false; onMove(e); }

  function step(dt) {
    // The path opens under the light, and never past an uncut thread.
    const wy = camY + (H - ty);
    if (moved && Math.abs(tx - pathX(wy)) < 86 && wy > progress && wy < progress + 190) progress = Math.min(wy, limit());
    const target = progress - H * .42;
    camY += (target - camY) * (o.reduced ? 1 : Math.min(1, dt * 3));
    for (const th of threads) {
      if (th.cut || th.shown) continue;
      if (Math.abs(ty - sy(th.y)) < 100 && moved) { th.shine += dt; if (th.shine > .7) reveal(th); }
    }
    const near = threads.find((t) => !t.cut && progress > t.y - 140);
    o.onHint(near ? 'thread' : progress < 60 ? 'torch' : '');
    if (!ended && progress >= LEN - 2) { ended = true; o.onEnd(); }
  }

  function frame(now) {
    const dt = Math.min(.05, (now - last) / 1000 || 0); last = now; time += dt;
    step(dt);
    g.clearRect(0, 0, W, H);

    // Stones of the path: bright near the torch, faint where you have walked.
    const y0 = Math.max(0, Math.floor((camY - 20) / 26) * 26), y1 = Math.min(LEN, camY + H + 20);
    for (let y = y0; y <= y1; y += 26) {
      const x = pathX(y), s = sy(y), d = Math.hypot(x - tx, s - ty);
      const a = Math.max(y <= progress ? .2 : 0, 1 - d / 190);
      if (a <= .01) continue;
      g.globalAlpha = a;
      g.fillStyle = y <= progress ? '#ffd58a' : '#cdb8ff';
      g.beginPath(); g.ellipse(x, s, 15, 6, Math.sin(y) * .4, 0, 7); g.fill();
    }
    g.globalAlpha = 1;

    // Threads: tangled, glowing, across the way.
    for (const th of threads) {
      const s = sy(th.y);
      if (s < -80 || s > H + 80) continue;
      const age = th.cut ? time - th.cut : 0;
      if (th.cut && (age > 1.1 || th.cut < .001)) continue;
      const d = Math.abs(ty - s), nearA = clamp(1 - d / 220, 0, 1);
      const fade = th.cut ? 1 - age / 1.1 : 1;
      for (let k = 0; k < 5; k++) {
        const sd = th.seeds[k], wob = o.reduced ? 0 : time * (.5 + k * .13);
        const drawHalf = (from, to, dir) => {
          g.beginPath();
          for (let i = 0; i <= 24; i++) {
            const u = i / 24, x = from + (to - from) * u;
            let y = s + Math.sin(x * .021 + sd + wob) * 22 + Math.sin(x * .05 + sd * 2 - wob * .7) * 10 + (k - 2) * 9;
            if (th.cut) { const pull = Math.abs(x - th.cutX) < 1 ? 0 : (1 - Math.abs(x - th.cutX) / W); y += age * age * 160 * pull + dir * 0; }
            const xx = th.cut ? x + dir * age * 90 * (1 - Math.abs(x - th.cutX) / W) : x;
            i ? g.lineTo(xx, y) : g.moveTo(xx, y);
          }
          g.stroke();
        };
        const col = th.shown ? '255,207,122' : '255,93,158';
        for (const [lw, al] of [[7, .1], [2, .5]]) {
          g.lineWidth = lw; g.strokeStyle = `rgba(${col},${(al + nearA * al) * fade})`;
          if (th.cut) { drawHalf(-20, th.cutX, -1); drawHalf(th.cutX, W + 20, 1); } else drawHalf(-20, W + 20, 0);
        }
      }
    }

    // The torch itself.
    if (!o.reduced || moved) {
      const fl = o.reduced ? 1 : 1 + Math.sin(time * 9) * .04 + Math.sin(time * 23) * .03;
      const r = g.createRadialGradient(tx, ty, 0, tx, ty, 120 * fl);
      r.addColorStop(0, 'rgba(255,236,190,.55)'); r.addColorStop(.25, 'rgba(255,190,90,.2)'); r.addColorStop(1, 'rgba(255,170,60,0)');
      g.globalCompositeOperation = 'lighter'; g.fillStyle = r; g.fillRect(tx - 130, ty - 130, 260, 260);
      g.globalCompositeOperation = 'source-over';
    }

    // Lanterns, thread labels and the end mark follow the path.
    for (const e of els) {
      const s = sy(e.y);
      if (s < -120 || s > H + 120) { e.el.style.opacity = 0; e.el.style.visibility = 'hidden'; continue; }
      e.el.style.visibility = 'visible';
      let x = W / 2;
      if (e.lantern) x = clamp(pathX(e.y) + e.side * 96, 76, W - 76);
      const d = Math.hypot(x - tx, s - ty);
      const lit = e.lantern ? progress >= e.y - 60 : e.thread ? e.thread.shown : ended;
      const a = e.end ? (ended ? 1 : 0) : Math.max(lit ? 1 : .45, 1 - d / 260);
      if (!(e.thread && e.thread.cut)) e.el.style.opacity = a.toFixed(2);
      e.el.style.transform = `translate3d(${x.toFixed(1)}px,${s.toFixed(1)}px,0)`;
    }
  }

  function loop(now) { raf = requestAnimationFrame(loop); frame(now); }

  return {
    start() {
      build(); resize();
      addEventListener('resize', resize);
      addEventListener('pointermove', onMove, { passive: true });
      addEventListener('pointerdown', onDown, { passive: true });
      last = performance.now();
      if (o.reduced) frame(last); else raf = requestAnimationFrame(loop);
    },
    stop() {
      cancelAnimationFrame(raf); raf = 0;
      removeEventListener('resize', resize);
      removeEventListener('pointermove', onMove);
      removeEventListener('pointerdown', onDown);
      g.clearRect(0, 0, W, H); world.innerHTML = '';
    },
    relabel() { build(); if (o.reduced) frame(performance.now()); },
    snapshot: () => ({ progress, cut: threads.map((t) => !!t.cut), shown: threads.map((t) => t.shown) }),
    get progress() { return progress; }, get camY() { return camY; }, pathX, threads,
    // In reduced motion there is no walking: everything is simply open.
    openAll() { threads.forEach((t) => { t.cut = .001; t.shown = true; }); progress = LEN; }
  };
}
