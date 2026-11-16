// The activities drawn on the 2D canvas: three original visual games
// and the "ride the wave" breathing scene. None of them has a score that
// is kept, a way to lose, or any text to read while playing.

const TAU = Math.PI * 2;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

// Shared set-up: sizing, a frame loop, pointer input, and a clean stop.
function stage(canvas, o, make) {
  const g = canvas.getContext('2d');
  const S = { W: 0, H: 0, t: 0, px: 0, py: 0, down: false, g };
  let raf = 0, last = performance.now(), ended = false;
  const game = make(S);
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    S.W = canvas.clientWidth; S.H = canvas.clientHeight;
    canvas.width = S.W * dpr; canvas.height = S.H * dpr;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    game.resize && game.resize();
  }
  const skipUi = (e) => e.target.closest && e.target.closest('button');
  const pd = (e) => { if (skipUi(e)) return; S.down = true; S.px = e.clientX; S.py = e.clientY; game.down && game.down(e); };
  const pm = (e) => { S.px = e.clientX; S.py = e.clientY; game.move && game.move(e); };
  const pu = (e) => { S.down = false; game.up && game.up(e); };
  const kd = (e) => game.key && game.key(e);
  function loop(now) {
    raf = requestAnimationFrame(loop);
    const dt = Math.min(.05, (now - last) / 1000); last = now; S.t += dt;
    g.clearRect(0, 0, S.W, S.H);
    game.frame(dt);
    o.onTick && o.onTick(S.t / o.duration);
    if (S.t >= o.duration && !ended) { ended = true; api.stop(); o.onEnd && o.onEnd(); }
  }
  const api = {
    game,
    stop() {
      cancelAnimationFrame(raf);
      removeEventListener('resize', resize); removeEventListener('pointerdown', pd);
      removeEventListener('pointermove', pm); removeEventListener('pointerup', pu);
      removeEventListener('pointercancel', pu); removeEventListener('keydown', kd);
      g.clearRect(0, 0, S.W, S.H);
    }
  };
  resize();
  S.px = S.W / 2; S.py = S.H * .6;
  addEventListener('resize', resize); addEventListener('pointerdown', pd);
  addEventListener('pointermove', pm); addEventListener('pointerup', pu);
  addEventListener('pointercancel', pu); addEventListener('keydown', kd);
  raf = requestAnimationFrame(loop);
  return api;
}

/* ------------------------------------------------------------------
   1. Fit the shapes: arcs of light fall inward toward a core. Point to
      where an arc should land. A full ring dissolves.
   ------------------------------------------------------------------ */
export function fitGame(canvas, o) {
  return stage(canvas, o, (S) => {
    const SECT = 12, LAYERS = 7, g = S.g;
    let grid, piece, cx, cy, r0, th, flash = [], aim = null, fast = false, wipe = 0;
    const empty = () => Array.from({ length: LAYERS }, () => new Array(SECT).fill(0));
    grid = empty();
    const cells = (s, len) => Array.from({ length: len }, (_, i) => (s + i + SECT * 4) % SECT);
    const freeAt = (s, len, layerF) => {            // nothing in the way at or above this height
      for (let l = Math.max(0, Math.floor(layerF)); l < LAYERS; l++) for (const c of cells(s, len)) if (grid[l][c]) return false;
      return true;
    };
    const rest = (s, len) => {                      // the layer where the piece will settle
      let l = LAYERS;
      while (l > 0 && cells(s, len).every((c) => !grid[l - 1][c])) l--;
      return l;
    };
    function spawn() {
      const len = [1, 2, 2, 3, 3, 4][Math.floor(Math.random() * 6)];
      piece = { len, s: Math.floor(Math.random() * SECT), layer: LAYERS + 1.5, hue: 260 + Math.random() * 120 };
      fast = false;
    }
    function lock() {
      const l = rest(piece.s, piece.len);
      if (l >= LAYERS) { wipe = 1; grid = empty(); spawn(); return; }   // too full: breathe out and begin again
      for (const c of cells(piece.s, piece.len)) grid[l][c] = piece.hue;
      for (let k = LAYERS - 1; k >= 0; k--) if (grid[k].every(Boolean)) { grid.splice(k, 1); grid.push(new Array(SECT).fill(0)); flash.push({ l: k, a: 1 }); }
      spawn();
    }
    function turn(d) { const s = (piece.s + d + SECT) % SECT; if (freeAt(s, piece.len, piece.layer)) piece.s = s; }
    function arc(l, s, len, fill, stroke) {
      const a0 = (s / SECT) * TAU - Math.PI / 2 + .02, a1 = ((s + len) / SECT) * TAU - Math.PI / 2 - .02;
      const ri = r0 + l * th + 2, ro = r0 + (l + 1) * th - 2;
      g.beginPath(); g.arc(cx, cy, ro, a0, a1); g.arc(cx, cy, ri, a1, a0, true); g.closePath();
      if (fill) { g.fillStyle = fill; g.fill(); }
      if (stroke) { g.strokeStyle = stroke; g.lineWidth = 1.5; g.stroke(); }
    }
    spawn();
    return {
      turn, drop() { fast = true; },
      resize() { cx = S.W / 2; cy = S.H * .47; const R = Math.min(S.W * .47, S.H * .36); r0 = R * .16; th = (R - r0) / (LAYERS + 1.5); },
      down() { this.move(); },
      move() {
        if (!S.down) return;
        const a = Math.atan2(S.py - cy, S.px - cx) + Math.PI / 2;
        aim = Math.round(((a + TAU) % TAU) / TAU * SECT - piece.len / 2 + SECT) % SECT;
      },
      up() { aim = null; },
      key(e) { if (e.key === 'ArrowLeft') turn(-1); if (e.key === 'ArrowRight') turn(1); if (e.key === ' ' || e.key === 'ArrowDown') fast = true; },
      frame(dt) {
        if (aim != null && aim !== piece.s) {       // step toward where the finger points
          const d = (aim - piece.s + SECT) % SECT; turn(d <= SECT / 2 ? 1 : -1);
        }
        const speed = (.75 + Math.min(.8, S.t / 180 * .8)) * (fast ? 9 : 1);
        piece.layer -= speed * dt;
        if (piece.layer <= rest(piece.s, piece.len)) lock();
        wipe = Math.max(0, wipe - dt);

        for (let l = 0; l <= LAYERS; l++) { g.beginPath(); g.arc(cx, cy, r0 + l * th, 0, TAU); g.strokeStyle = 'rgba(255,255,255,.07)'; g.lineWidth = 1; g.stroke(); }
        const core = g.createRadialGradient(cx, cy, 0, cx, cy, r0 * 1.6);
        core.addColorStop(0, 'rgba(255,240,210,.95)'); core.addColorStop(.5, 'rgba(255,180,90,.35)'); core.addColorStop(1, 'rgba(255,160,60,0)');
        g.fillStyle = core; g.beginPath(); g.arc(cx, cy, r0 * 1.6 * (1 + wipe * 3), 0, TAU); g.fill();
        for (let l = 0; l < LAYERS; l++) for (let s = 0; s < SECT; s++) if (grid[l][s]) arc(l, s, 1, `hsla(${grid[l][s]},85%,66%,.9)`);
        arc(rest(piece.s, piece.len), piece.s, piece.len, null, `hsla(${piece.hue},90%,80%,.5)`);   // where it will land
        arc(piece.layer, piece.s, piece.len, `hsl(${piece.hue},95%,74%)`);
        flash = flash.filter((f) => (f.a -= dt * 1.6) > 0);
        for (const f of flash) { g.beginPath(); g.arc(cx, cy, r0 + (f.l + .5) * th + (1 - f.a) * 40, 0, TAU); g.strokeStyle = `rgba(255,236,190,${f.a})`; g.lineWidth = th * f.a; g.stroke(); }
      }
    };
  });
}

/* ------------------------------------------------------------------
   2. Sort the lights: drag each drifting light to the ring of its colour.
      Each colour also has its own mark, so it works without colour vision.
   ------------------------------------------------------------------ */
export function sortGame(canvas, o) {
  return stage(canvas, o, (S) => {
    const g = S.g, COL = ['#ff5d9e', '#7be0c0', '#ffcf7a', '#8fa8ff'];
    let orbs = [], rings = [], held = null, nextAt = .4, kinds = 3;
    function layout() { rings = Array.from({ length: kinds }, (_, i) => ({ k: i, x: S.W * (i + .5) / kinds, y: S.H * .84, pulse: 0 })); }
    function mark(k, x, y, r) {
      g.strokeStyle = 'rgba(10,5,15,.75)'; g.lineWidth = 3; g.beginPath();
      if (k === 0) g.arc(x, y, r * .35, 0, TAU);
      else if (k === 1) { g.moveTo(x, y - r * .45); g.lineTo(x + r * .42, y + r * .32); g.lineTo(x - r * .42, y + r * .32); g.closePath(); }
      else if (k === 2) g.rect(x - r * .34, y - r * .34, r * .68, r * .68);
      else { g.moveTo(x - r * .4, y); g.lineTo(x + r * .4, y); g.moveTo(x, y - r * .4); g.lineTo(x, y + r * .4); }
      g.stroke();
    }
    layout();
    return {
      resize: layout,
      down() {
        let best = null, bd = 56;
        for (const b of orbs) { const d = Math.hypot(b.x - S.px, b.y - S.py); if (d < bd && !b.gone) { bd = d; best = b; } }
        held = best;
      },
      up() {
        if (!held) return;
        const r = rings.find((r) => Math.hypot(r.x - held.x, r.y - held.y) < 62);
        if (r && r.k === held.k) { held.gone = 1; held.tx = r.x; held.ty = r.y; r.pulse = 1; }
        else if (r) { held.vy = -150; held.vx = (held.x - r.x) * 2; }     // wrong ring: it drifts back up
        held = null;
      },
      frame(dt) {
        if (S.t > 55 && kinds === 3) { kinds = 4; layout(); }
        nextAt -= dt;
        if (nextAt <= 0 && orbs.length < 9) {
          nextAt = Math.max(.8, 1.7 - S.t / 180);
          orbs.push({ k: Math.floor(Math.random() * kinds), x: S.W * (.12 + Math.random() * .76), y: -30, vx: 0, vy: 38 + Math.min(40, S.t / 4), ph: Math.random() * 9, a: 1 });
        }
        for (const r of rings) {
          r.pulse = Math.max(0, r.pulse - dt * 2);
          g.beginPath(); g.arc(r.x, r.y, 40 + r.pulse * 14, 0, TAU); g.strokeStyle = COL[r.k]; g.lineWidth = 4 + r.pulse * 6; g.globalAlpha = .85; g.stroke();
          g.globalAlpha = .16 + r.pulse * .4; g.fillStyle = COL[r.k]; g.fill(); g.globalAlpha = 1;
          g.save(); g.globalAlpha = .9; g.strokeStyle = COL[r.k]; mark(r.k, r.x, r.y, 40); g.restore();
        }
        for (const b of orbs) {
          if (b.gone) { b.x += (b.tx - b.x) * dt * 10; b.y += (b.ty - b.y) * dt * 10; b.a -= dt * 3; }
          else if (b === held) { b.x += (S.px - b.x) * .6; b.y += (S.py - b.y) * .6; }
          else { b.vy += (38 + Math.min(40, S.t / 4) - b.vy) * dt * 2; b.vx *= 1 - dt * 2; b.x += (b.vx + Math.sin(S.t * 1.3 + b.ph) * 16) * dt; b.y += b.vy * dt; if (b.y > S.H * .93) b.a -= dt * 2; }
          b.x = clamp(b.x, 26, S.W - 26);
          const R = b === held ? 30 : 26;
          g.globalAlpha = clamp(b.a, 0, 1);
          const gl = g.createRadialGradient(b.x, b.y, 0, b.x, b.y, R * 1.9);
          gl.addColorStop(0, COL[b.k]); gl.addColorStop(.5, COL[b.k] + '55'); gl.addColorStop(1, COL[b.k] + '00');
          g.fillStyle = gl; g.beginPath(); g.arc(b.x, b.y, R * 1.9, 0, TAU); g.fill();
          g.fillStyle = COL[b.k]; g.beginPath(); g.arc(b.x, b.y, R, 0, TAU); g.fill();
          mark(b.k, b.x, b.y, R);
          g.globalAlpha = 1;
        }
        orbs = orbs.filter((b) => b.a > 0);
      }
    };
  });
}

/* ------------------------------------------------------------------
   3. Follow the path: a ribbon of light flows toward you. Keep the
      torch on it. On the path it glows gold and its lights wake up.
   ------------------------------------------------------------------ */
export function pathGame(canvas, o) {
  return stage(canvas, o, (S) => {
    const g = S.g; let scroll = 0, glow = .3, sparks = [];
    const cx = (y) => S.W / 2 + Math.sin(y * .0052) * S.W * .27 + Math.sin(y * .013 + 2) * S.W * .1 + Math.sin(y * .0021 + 5) * S.W * .06;
    return {
      frame(dt) {
        const speed = 95 + Math.min(85, S.t * .5), width = Math.max(58, 96 - S.t * .2);
        scroll += speed * dt;
        const wyT = scroll + (S.H - S.py), on = Math.abs(S.px - cx(wyT)) < width / 2;
        glow += ((on ? 1 : .22) - glow) * Math.min(1, dt * 5);
        g.lineCap = 'round'; g.lineJoin = 'round';
        for (const [lw, al, col] of [[width * 1.5, .1, '154,107,255'], [width, .22, on ? '255,207,122' : '154,107,255'], [4, .9, on ? '255,240,210' : '200,180,255']]) {
          g.beginPath();
          for (let s = -20; s <= S.H + 20; s += 14) { const x = cx(scroll + (S.H - s)); s === -20 ? g.moveTo(x, s) : g.lineTo(x, s); }
          g.lineWidth = lw; g.strokeStyle = `rgba(${col},${al * (.5 + glow * .5)})`; g.stroke();
        }
        // Small lights along the way wake when the torch passes over them.
        const first = Math.ceil(scroll / 120) * 120;
        for (let wy = first; wy < scroll + S.H + 120; wy += 120) {
          const x = cx(wy), s = S.H - (wy - scroll), key = wy;
          let sp = sparks.find((p) => p.k === key);
          if (!sp) { sp = { k: key, lit: 0 }; sparks.push(sp); }
          if (!sp.lit && Math.hypot(x - S.px, s - S.py) < 44) sp.lit = 1;
          g.beginPath(); g.arc(x, s, sp.lit ? 9 : 5, 0, TAU);
          g.fillStyle = sp.lit ? 'rgba(255,220,140,.95)' : 'rgba(255,255,255,.35)'; g.fill();
        }
        sparks = sparks.filter((p) => p.k > scroll - 200);
        const r = g.createRadialGradient(S.px, S.py, 0, S.px, S.py, 90);
        r.addColorStop(0, `rgba(255,236,190,${.5 + glow * .4})`); r.addColorStop(.3, 'rgba(255,190,90,.25)'); r.addColorStop(1, 'rgba(255,170,60,0)');
        g.globalCompositeOperation = 'lighter'; g.fillStyle = r; g.fillRect(S.px - 90, S.py - 90, 180, 180); g.globalCompositeOperation = 'source-over';
      }
    };
  });
}

/* ------------------------------------------------------------------
   Ride the wave: a wave of light that rises as you breathe in (4 s)
   and falls as you breathe out (6 s). With reduced motion it is still.
   ------------------------------------------------------------------ */
export function waveScene(canvas, o) {
  return stage(canvas, o, (S) => {
    const g = S.g; let lastPhase = '';
    return {
      frame() {
        const c = S.t % 10, inhale = c < 4, k = inhale ? c / 4 : 1 - (c - 4) / 6;
        const e = k * k * (3 - 2 * k), phase = inhale ? 'in' : 'out';
        if (phase !== lastPhase) { lastPhase = phase; o.onBreath && o.onBreath(phase); }
        const amp = o.reduced ? S.H * .08 : S.H * (.05 + e * .14), base = S.H * .62, tt = o.reduced ? 0 : S.t;
        for (let L = 0; L < 4; L++) {
          g.beginPath(); g.moveTo(0, S.H);
          for (let x = 0; x <= S.W + 12; x += 12) {
            const y = base + L * 22 - amp * (Math.sin(x * .008 + tt * .5 + L) * .5 + .5) - Math.sin(x * .02 - tt * .8 + L * 2) * 8;
            g.lineTo(x, y);
          }
          g.lineTo(S.W, S.H); g.closePath();
          const gr = g.createLinearGradient(0, base - amp, 0, S.H);
          gr.addColorStop(0, ['rgba(255,207,122,.5)', 'rgba(255,93,158,.36)', 'rgba(154,107,255,.36)', 'rgba(60,40,140,.5)'][L]);
          gr.addColorStop(1, 'rgba(10,5,20,0)');
          g.fillStyle = gr; g.fill();
        }
      }
    };
  });
}
