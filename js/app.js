// Komera: the main program. It shows each screen, runs the 5-minute
// rescue, and saves the plan and settings on this phone only.
// Nothing here talks to a server.
import { createJourney } from './journey.js';
import { music } from './music.js';
import { fitGame, sortGame, pathGame, waveScene } from './games.js';

const C = window.CONTENT;
const $ = (s, r = document) => r.querySelector(s);
const ui = $('#ui'), fx = $('#fx'), world = $('#world'), toastEl = $('#toast');
let gl = $('#gl');
const body = document.body, root = document.documentElement;
const params = new URLSearchParams(location.search);
const TEST = params.has('test');                       // ?test makes every activity 8 seconds long
const DUR = { game: TEST ? 8 : 180, game2: TEST ? 8 : 120, wave: TEST ? 8 : 180, move: TEST ? 8 : 120 };   // seconds

/* ---------- Saved on this phone: the plan and the settings. Nothing else. ---------- */
const KEY = 'komera.v1';
const defaults = () => ({
  lang: (navigator.language || 'en').toLowerCase().startsWith('rw') ? 'rw' : 'en',
  sound: false,
  reduced: matchMedia('(prefers-reduced-motion: reduce)').matches,
  voice: true, simple: false, skipGate: false, single: false, seen: false,
  plans: [], why: ''
});
function load() { try { return Object.assign(defaults(), JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { return defaults(); } }
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* private mode: keep going without saving */ } }
let S = load();

const L = (o) => (o ? o[S.lang] || o.en : '');
const t = (k) => L(C.ui[k]);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const forMe = (x) => !(S.single && x.partner);
const two = (n) => String(n).padStart(2, '0');
function remind() {                                   // a reminder, and the name of its voice recording
  const r = pick(C.reminders.filter(forMe)), single = S.single && r.single;
  return { text: L(single ? r.single : r), clip: `reminder-${two(C.reminders.indexOf(r) + 1)}${single ? '-single' : ''}` };
}
const reminder = () => remind().text;

/* ---------- Sound and music: off unless switched on (see js/music.js) ---------- */
const audio = () => music.unlock();
// The spoken voice. Recordings live in audio/<language>/ and are listed in audio/SCRIPT.md.
// A language with no recordings is simply silent.
const voiceThere = {}; let voiceGen = 0;
function say(ids, replace) {
  if (!S.sound || !S.voice || !music.ready()) return;
  const lang = S.lang, base = `audio/${lang}/`, g = voiceGen;
  voiceThere[lang] = voiceThere[lang] || music.has(base + 'gate.mp3');
  voiceThere[lang].then((ok) => { if (ok && g === voiceGen && lang === S.lang) music.say(ids.map((id) => base + id + '.mp3'), replace); });
}
const speak = (...ids) => say(ids, true);             // stop whatever is being said, then say this
const speakAfter = (...ids) => say(ids, false);        // say this when the current line is finished
const SCENE = { gate: 'gate', hub: 'void', end: 'end' };          // every other screen plays the void music quietly
addEventListener('pointerdown', () => { if (S.sound) music.enable(true); }, { once: true });

/* ---------- The scene: 3D if the phone can run it, simple 2D if not ---------- */
let scene3d = null, hold = 0, inVoid = false, sessionSimple = false;
function webglOK() { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; } }
function useFlat() {
  sessionSimple = true;
  if (scene3d) { try { scene3d.dispose(); } catch (e) { /* already gone */ } scene3d = null; }
  body.classList.remove('gl');
  const fresh = gl.cloneNode(); fresh.classList.remove('on'); gl.replaceWith(fresh); gl = fresh;   // a used-up canvas cannot be reused
}
async function load3d() {
  if (scene3d || S.simple || S.reduced || sessionSimple || params.has('simple') || !webglOK()) return;
  try {
    const m = await import('./scene3d.js');
    if (S.simple || S.reduced || sessionSimple) return;
    scene3d = m.create(gl, { onSlow: () => { if (!params.has('force3d')) useFlat(); } });
    if (inVoid) scene3d.toVoid(); else scene3d.setHold(hold);
    if (cur.name !== 'gate' && cur.name !== 'hub') scene3d.pause();
    body.classList.add('gl'); gl.classList.add('on');
    if (params.has('slow')) setTimeout(useFlat, 1200);         // ?slow pretends the phone is too slow
  } catch (e) { useFlat(); }
}
function applyMotion() {
  body.classList.toggle('still', S.reduced);
  if (S.reduced || S.simple) { const keep = sessionSimple; useFlat(); sessionSimple = keep; } else load3d();
}
function setHold(p) { hold = p; root.style.setProperty('--hold', p.toFixed(3)); scene3d && scene3d.setHold(p); }
function enterVoid() { inVoid = true; body.classList.add('open', 'void'); scene3d && scene3d.toVoid(); }
function openGate(done) {
  music.hit('open');
  body.classList.add('open');
  let called = false; const fin = () => { if (called) return; called = true; inVoid = true; body.classList.add('void'); done(); };
  if (S.reduced) { enterVoid(); return fin(); }
  setTimeout(() => body.classList.add('void'), scene3d ? 2600 : 1500);
  if (scene3d) scene3d.open(fin);
  setTimeout(() => { if (!called) { scene3d && scene3d.toVoid(); fin(); } }, scene3d ? 4600 : 2500);                       // also the safety net if 3D stops half-way
}

/* ---------- Small helpers for building screens ---------- */
let toastTimer = 0;
function toast(html, ms = 5200) { toastEl.innerHTML = html; toastEl.classList.add('on'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toastEl.classList.remove('on'), ms); }
const otherLang = () => (S.lang === 'en' ? 'Kinyarwanda' : 'English');
function top(o = {}) {
  return `<div class="top"><span>${o.back ? `<button data-a="go" data-to="${o.back}" aria-label="${esc(t('back'))}">‹ ${esc(t('back'))}</button>` : o.menu ? `<button data-a="go" data-to="menu" aria-label="${esc(t('menu'))}">☰ ${esc(t('menu'))}</button>` : ''}</span>
  <span><button data-a="sound" aria-pressed="${!!S.sound}" aria-label="${esc(t('setSound'))}: ${esc(t(S.sound ? 'on' : 'off'))}">${S.sound ? '♪' : '<s>♪</s>'} ${esc(t(S.sound ? 'on' : 'off'))}</button>
  <button data-a="lang" lang="${S.lang === 'en' ? 'rw' : 'en'}">${otherLang()}</button></span></div>`;
}
function sources(refs) {
  return `<ul class="src">${refs.map((n) => { const s = C.sources[n]; return s ? `<li><a href="${esc(s.u)}" target="_blank" rel="noopener noreferrer">${esc(s.t)}</a></li>` : ''; }).join('')}</ul>`;
}
function why(tool) { const w = C.whyTool[tool]; return `<details><summary>${esc(t('why'))}</summary><p>${esc(L(w))}</p>${sources(w.refs)}</details>`; }
const panel = (inner, o) => `${top(o)}<section class="panel"><div class="in">${inner}</div></section>`;
const para = (o) => `<p${o.verify ? ' class="verify"' : ''}>${esc(L(o))}</p>`;
const list = (a) => `<ul>${a.map((o) => `<li${o.verify ? ' class="verify"' : ''}>${esc(L(o))}</li>`).join('')}</ul>`;

/* ---------- Moving between screens ---------- */
let cur = { name: 'gate' }, journey = null, act = null, timers = [], motes = 0;
let gateRun = 0;
let walk = null;                       // where the walker is on the path. Kept for this visit only, never saved.
const later = (fn, ms) => { const id = setTimeout(fn, ms); timers.push(id); return id; };
function leave() {
  timers.forEach(clearTimeout); timers = [];
  if (act) { act.stop(); act = null; }
  if (journey) { walk.state = journey.snapshot(); journey.stop(); journey = null; }
  cancelAnimationFrame(motes); motes = 0; fx.getContext('2d').clearRect(0, 0, fx.width, fx.height);
  body.classList.remove('hub', 'busy', 'dawn', 'leaving'); scene3d && scene3d.setDawn(false);
  toastEl.classList.remove('on');
  voiceGen++; music.hush();
}
function go(name, arg) {
  leave();
  cur = { name, arg };
  if (name !== 'gate' && !inVoid) enterVoid();
  const live = name === 'gate' || name === 'hub';
  if (scene3d) live ? scene3d.resume() : scene3d.pause();
  music.scene(name === 'hub' && walk && walk.done && !S.reduced ? 'end' : SCENE[name] || 'quiet');
  views[name](arg);
  const p = $('.panel'); if (p) p.scrollTop = 0;
}
const rerender = () => { if (cur.name === 'hub' && journey) { hubChrome(); journey.relabel(); } else if (cur.name === 'hub' && walk && walk.done) finaleScreen(); else if (!act) views[cur.name](cur.arg); };

const views = {
  /* ----- The gate ----- */
  gate() {
    ui.innerHTML = `${top()}<section class="gate" id="gate">
      <h1>${esc(t('appName'))}</h1>
      <div class="line">${esc(t('gateLine'))}</div>
      <div class="ring"></div>
      <div class="hold">${esc(t('gateHold'))}</div>
      <div class="row"><button class="btn gold" data-a="rescue">${esc(t('rescueNow'))}</button>
      ${S.seen ? `<button class="btn" data-a="go" data-to="hub">${esc(t('skipGate'))}</button>` : ''}</div>
      <div class="legal">${esc(t('privacyLine'))} ${esc(t('notTherapy'))}</div></section>`;
    let holding = false, raf = 0, last = performance.now(), opened = false;
    const run = ++gateRun;                           // if the gate is drawn again (language or sound tapped), the older loop stops
    const gate = $('#gate');
    const tick = (now) => {
      if (cur.name !== 'gate' || opened || run !== gateRun) return;
      raf = requestAnimationFrame(tick);
      const dt = (now - last) / 1000; last = now;
      const next = Math.max(0, Math.min(1, hold + (holding ? dt / 2 : -dt / 1.2)));
      if (next !== hold) { setHold(next); sing(); }
      if (hold >= 1) {
        opened = true; S.seen = true; save();
        gate.style.transition = 'opacity .8s'; gate.style.opacity = 0; gate.style.pointerEvents = 'none';
        openGate(() => { setHold(0); if (cur.name === 'gate') go('hub'); });
      }
    };
    const on = (e) => { if (e.target.closest('button')) return; holding = true; audio(); };
    let spoke = false;
    const sing = () => { if (cur.name !== 'gate' || opened) return; music.hold(hold); if (!spoke && hold > .12) { spoke = true; speak('gate'); } };
    const off = () => { holding = false; };
    gate.addEventListener('pointerdown', on); gate.addEventListener('pointerup', off);
    gate.addEventListener('pointercancel', off); gate.addEventListener('pointerleave', off);
    gate.addEventListener('contextmenu', (e) => e.preventDefault());
    onkeydown = (e) => { if (cur.name === 'gate' && (e.key === ' ' || e.key === 'Enter') && !e.target.closest('button')) holding = true; };
    onkeyup = () => { holding = false; };
    raf = requestAnimationFrame(tick);
  },

  /* ----- The void: torch, path, threads, lanterns ----- */
  hub() {
    if (S.reduced) return views.menu(true);          // still scene: no walking, everything is simply open
    if (walk && walk.done) return finale(false);     // the path is already open on this visit
    body.classList.add('hub');
    hubChrome();
    walk = walk || { thoughts: C.thoughts.filter(forMe).sort(() => Math.random() - .5).slice(0, 3), state: null, done: false };
    journey = createJourney({
      canvas: fx, world, thoughts: walk.thoughts, resume: walk.state, L, t, reduced: false,
      label: (id) => t('nav' + id[0].toUpperCase() + id.slice(1)),
      onLantern: (id) => (id === 'rescue' ? startRescue() : go(id)),
      onReveal: (i) => { music.hit('reveal'); speak('truth-' + two(C.thoughts.indexOf(walk.thoughts[i]) + 1)); },
      onCut: () => { const r = remind(); music.hit('cut'); toast(`<small>${esc(t('reminder'))}</small>${esc(r.text)}`); speakAfter(r.clip); },
      onHint: (k) => { const h = $('.hint'); if (h && h.dataset.k !== k) { h.dataset.k = k; h.textContent = k === 'thread' ? t('threadHint') : k === 'torch' ? t('torchHint') : ''; } },
      onEnd: () => { const r = remind(); walk.done = true; walk.line = r.text; walk.clip = r.clip; arrive(); }
    });
    journey.start();
  },

  /* ----- Every part in one list (also the still version of the void) ----- */
  menu(still) {
    const item = (to, label) => `<button class="card" data-a="${to === 'rescue' ? 'rescue' : 'go'}" data-to="${to}"><b>${esc(label)}</b></button>`;
    ui.innerHTML = panel(`<h2>${esc(t('appName'))}</h2><p class="small">${esc(t('privacyLine'))} ${esc(t('notTherapy'))}</p>
      <div class="stack"><button class="btn gold wide" data-a="rescue">${esc(t('rescueNow'))}</button>
      ${item('plan', t('navPlan'))}${item('learn', t('navLearn'))}${item('practice', t('navPractice'))}${item('help', t('navHelp'))}${item('settings', t('navSettings'))}</div>`,
      still === true ? {} : { back: 'hub' });
  },

  /* ----- The 5-minute rescue ----- */
  rate(which) {
    speak(which === 1 ? 'rate-1' : 'rate-2');
    ui.innerHTML = panel(`<h2>${esc(t(which === 1 ? 'rateQ' : 'rateAgainQ'))}</h2>
      <div class="rate">${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => `<button data-a="rated" data-n="${n}">${n}</button>`).join('')}</div>
      <div class="scale"><span>1 · ${esc(t('rateLow'))}</span><span>${esc(t('rateHigh'))} · 10</span></div>`, { back: 'hub' });
  },
  choose(second) {
    speak(second ? 'still-strong' : 'strong');
    const games = [['fit', 'gameFit'], ['sort', 'gameSort'], ['path', 'gamePath']].filter(([k]) => !R.played.includes(k));
    ui.innerHTML = panel(`<h2>${esc(t(second ? 'stillStrong' : 'pathStrong'))}</h2><p class="small">${esc(t('chooseGame'))}</p><div class="stack">
      ${games.map(([k, s]) => `<button class="card" data-a="game" data-k="${k}"><b>${esc(t(s))}</b><span>${esc(t(s + 'How'))}</span></button>`).join('')}
      ${second ? `<button class="card" data-a="move"><b>${esc(t('moveGuide'))}</b></button>` : ''}</div>${why(second ? 'move' : 'game')}`, { back: 'hub' });
  },
  end() {
    const rem = remind(); speak('end', rem.clip);
    const plans = S.plans.map((p) => `<div class="plan">${esc(t('planIf'))} ${esc(p.i)}, ${esc(t('planThen'))} ${esc(p.t)}.</div>`).join('');
    ui.innerHTML = panel(`<h2>${esc(t('endTitle'))}</h2><p>${esc(t('endHonest'))}</p>
      ${R.last >= 7 ? `<p class="verify">${esc(t('stillAfter'))} <a href="#" data-a="go" data-to="help">${esc(t('navHelp'))}</a></p>` : ''}
      <div class="quote"><small>${esc(t('reminder'))}</small>${esc(rem.text)}</div>
      <h3>${esc(t('yourPlan'))}</h3>${plans || `<p class="small">${esc(t('noPlanYet'))}</p><button class="btn wide" data-a="go" data-to="plan">${esc(t('makePlan'))}</button>`}
      ${S.why ? `<h3>${esc(t('yourWhy'))}</h3><p>${esc(S.why)}</p>` : ''}
      <h3>${esc(t('oneChange'))}</h3><div class="plan"><span id="chg">${esc(L(pick(C.setting)))}</span>
      <div class="acts"><button data-a="chg">${esc(t('another'))}</button></div></div>
      ${why('setting')}
      <p><button class="btn gold wide" data-a="go" data-to="hub">${esc(t('finish'))}</button></p>
      <p class="small center">${esc(t('remindersNote'))}</p>`, {});
  },

  /* ----- My plan ----- */
  plan(editIdx) {
    const editing = editIdx != null ? S.plans[editIdx] : null, canAdd = editing || S.plans.length < 3;
    ui.innerHTML = panel(`<h2>${esc(t('navPlan'))}</h2><p>${esc(t('planIntro'))}</p>
      ${S.plans.map((p, i) => `<div class="plan"><b>${esc(t('planIf'))}</b> ${esc(p.i)}, <b>${esc(t('planThen'))}</b> ${esc(p.t)}.
        <div class="acts"><button data-a="pedit" data-i="${i}">${esc(t('edit'))}</button><button data-a="pdel" data-i="${i}">${esc(t('del'))}</button></div></div>`).join('')}
      ${canAdd ? `<label for="pi">${esc(t('planIf'))}…</label><input id="pi" type="text" maxlength="140" autocomplete="off" placeholder="${esc(t('planIfPh'))}" value="${editing ? esc(editing.i) : ''}">
        <label for="pt">${esc(t('planThen'))}…</label><input id="pt" type="text" maxlength="140" autocomplete="off" placeholder="${esc(t('planThenPh'))}" value="${editing ? esc(editing.t) : ''}">
        <p style="margin-top:14px"><button class="btn gold wide" data-a="psave" data-i="${editIdx != null ? editIdx : ''}">${esc(t('save'))}</button></p>
        <p class="small">${esc(t('planExamples'))}</p><div class="chips">${C.planExamples.map((x, i) => `<button data-a="pex" data-i="${i}">${esc(t('planIf'))} ${esc(L(x.i))}, ${esc(t('planThen'))} ${esc(L(x.t))}.</button>`).join('')}</div>`
        : `<p class="small">${esc(t('planFull'))}</p>`}
      <label for="why">${esc(t('whyLabel'))}</label><textarea id="why" maxlength="200" placeholder="${esc(t('whyPh'))}">${esc(S.why)}</textarea>
      <p style="margin-top:12px"><button class="btn wide" data-a="whysave">${esc(t('save'))}</button></p>
      ${why('plan')}
      <p><button class="btn danger wide" data-a="wipe">${esc(t('deleteAll'))}</button></p>`, { back: 'hub' });
  },

  /* ----- Learn ----- */
  learn() {
    ui.innerHTML = panel(`<h2>${esc(t('navLearn'))}</h2><p>${esc(t('learnIntro'))}</p><div class="stack">
      ${C.lessons.map((l, i) => `<button class="card" data-a="go" data-to="lesson" data-arg="${i}"><b>${esc(L(l.title))}</b></button>`).join('')}</div>
      <h3>${esc(t('reminders'))}</h3><p class="small">${esc(t('remindersNote'))}</p>
      <div class="quote" id="rq">${esc(reminder())}</div><button class="btn" data-a="rq">${esc(t('another'))}</button>
      ${why('thoughts')}`, { back: 'hub' });
  },
  lesson(i) {
    const l = C.lessons[i];
    ui.innerHTML = panel(`<h2>${esc(L(l.title))}</h2>${l.body[S.lang].map((p) => `<p>${esc(p)}</p>`).join('')}
      <h3>${esc(t('sources'))}</h3>${sources(l.refs)}
      <p><button class="btn wide" data-a="go" data-to="learn">${esc(t('lessons'))}</button></p>`, { back: 'learn' });
  },

  /* ----- Practice ----- */
  practice(done) {
    ui.innerHTML = panel(`<h2>${esc(t('navPractice'))}</h2><p>${esc(done ? t('practiceDone') : t('practiceIntro'))}</p>
      <p><button class="btn gold wide" data-a="practice">${esc(t('start'))}</button></p>${why('wave')}`, { back: 'hub' });
  },

  /* ----- Get help ----- */
  help() {
    const H = C.help;
    ui.innerHTML = panel(`<h2>${esc(t('navHelp'))}</h2>${para(H.intro)}
      <h3>${esc(L(H.urgentTitle))}</h3>${list(H.urgent)}
      <h3>${esc(L(H.whenTitle))}</h3>${list(H.when)}${para(H.moral)}${sources(H.moral.refs)}
      <h3>${esc(L(H.rwandaTitle))}</h3>${list(H.rwanda)}${para(H.elsewhere)}
      <h3>${esc(L(H.talkTitle))}</h3>${list(H.talk)}
      <p class="small">${esc(t('notTherapy'))}</p>`, { back: 'hub' });
  },

  /* ----- Settings ----- */
  settings() {
    const tg = (k, label) => `<button class="toggle" data-a="set" data-k="${k}" aria-pressed="${!!S[k]}"><span>${esc(label)}</span><i></i></button>`;
    ui.innerHTML = panel(`<h2>${esc(t('navSettings'))}</h2>
      <label>${esc(t('setLang'))}</label><div class="seg"><button data-a="setlang" data-l="en" aria-pressed="${S.lang === 'en'}">English</button><button data-a="setlang" data-l="rw" aria-pressed="${S.lang === 'rw'}">Kinyarwanda</button></div>
      <div style="margin-top:14px">${tg('sound', t('setSound'))}${tg('voice', t('setVoice'))}${tg('reduced', t('setMotion'))}${tg('simple', t('setSimple'))}${tg('skipGate', t('setSkipGate'))}${tg('single', t('setSingle'))}</div>
      <p class="small" style="margin-top:18px">${esc(t('setPrivacy'))} ${esc(t('offlineReady'))} <span id="ver"></span></p>
      <p><button class="btn danger wide" data-a="wipe">${esc(t('deleteAll'))}</button></p>`, { back: 'hub' });
    // Shows which saved version this is (the name set in sw.js), to check that an update arrived.
    if (window.caches) caches.keys().then((k) => { const v = $('#ver'), n = k.filter((x) => x.startsWith('komera-')).pop(); if (v && n) v.textContent = '· ' + n.replace('komera-', ''); }).catch(() => {});
  }
};

/* ----- The end of the path: the dark lifts and every lantern gathers ----- */
function finaleScreen() {
  const lamp = (id) => `<button class="lantern" data-a="${id === 'rescue' ? 'rescue' : 'go'}" data-to="${id}">${esc(t('nav' + id[0].toUpperCase() + id.slice(1)))}</button>`;
  ui.innerHTML = `${top({ menu: true })}<section class="finale"><div class="in">
    <h2>${esc(t('pathOpen'))}</h2><p>${esc(t('finaleLine'))}</p>
    <div class="quote"><small>${esc(t('reminder'))}</small>${esc(walk.line)}</div>
    <div class="ring">${['rescue', 'plan', 'learn', 'practice', 'help'].map(lamp).join('')}</div>
    <button class="btn ghost" data-a="rewalk">${esc(t('walkAgain'))}</button></div></section>`;
}
// Reaching the end: the light and the music begin at once, the path and the torch melt
// away while the dark lifts, and only then do the words and the lanterns rise.
function arrive() {
  body.classList.remove('hub'); body.classList.add('dawn', 'leaving'); toastEl.classList.remove('on');
  scene3d && scene3d.setDawn(true);
  music.hit('dawn'); music.scene('end');
  later(() => { if (cur.name === 'hub') finale(true); }, 1500);
}
function finale(arriving) {
  if (journey) { journey.stop(); journey = null; }
  body.classList.remove('hub', 'leaving'); body.classList.add('dawn'); toastEl.classList.remove('on');
  scene3d && scene3d.setDawn(true);
  if (arriving) later(() => speak('path-open', walk.clip), 600);
  finaleScreen();
  // Warm motes of light rise through the void.
  const g = fx.getContext('2d'), dpr = Math.min(window.devicePixelRatio || 1, 2);
  let W = 0, H = 0, last = performance.now();
  const size = () => { W = fx.clientWidth; H = fx.clientHeight; fx.width = W * dpr; fx.height = H * dpr; g.setTransform(dpr, 0, 0, dpr, 0, 0); };
  size();
  const pts = Array.from({ length: 46 }, () => ({ x: Math.random(), y: Math.random() * 1.2, r: 1 + Math.random() * 2.6, v: .02 + Math.random() * .05, p: Math.random() * 7 }));
  const loop = (now) => {
    motes = requestAnimationFrame(loop);
    if (fx.clientWidth !== W || fx.clientHeight !== H) size();
    const dt = Math.min(.05, (now - last) / 1000); last = now;
    g.clearRect(0, 0, W, H); g.globalCompositeOperation = 'lighter';
    for (const m of pts) {
      m.y -= m.v * dt; if (m.y < -.05) { m.y = 1.05; m.x = Math.random(); }
      const x = (m.x + Math.sin(now / 1400 + m.p) * .02) * W, y = m.y * H, r = m.r * 5;
      const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(255,226,170,${.5 * Math.min(1, m.y * 3)})`); gr.addColorStop(1, 'rgba(255,190,100,0)');
      g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2);
    }
    g.globalCompositeOperation = 'source-over';
  };
  motes = requestAnimationFrame(loop);
}

function hubChrome() {
  ui.innerHTML = `${top({ menu: true })}<div class="hint" data-k=""></div>
    <div class="hubbar"><button class="btn gold" data-a="rescue">${esc(t('rescueNow'))}</button></div>`;
}

/* ---------- The rescue: rate, 3 minutes, rate again, maybe once more, end ---------- */
let R = { round: 1, played: [], last: 0 };
function startRescue() { R = { round: 1, played: [], last: 0 }; go('rate', 1); }
function afterActivity() { music.hit('done'); go('rate', 2); }
function rated(n) {
  R.last = n; music.hit('tap');
  if (cur.arg === 1) return n >= 7 ? go('choose', false) : playWave(afterActivity);
  if (n >= 7 && R.round === 1) { R.round = 2; return go('choose', true); }
  go('end');
}
function activity(html) {
  leave(); cur = { name: 'act' };
  scene3d && scene3d.pause();
  body.classList.add('busy');
  ui.innerHTML = `<section class="act"><div class="bar"><i></i></div>${html}<button class="skip" data-a="skipact">${esc(t('skip'))}</button></section>`;
  const bar = $('.bar i');
  return (p) => { bar.style.width = Math.min(100, p * 100) + '%'; };
}
let onActEnd = null;
function playGame(k) {
  R.played.push(k); music.scene('game');
  const how = { fit: 'gameFitHow', sort: 'gameSortHow', path: 'gamePathHow' }[k];
  const tick = activity(`<div class="how">${esc(t(how))}</div>${k === 'fit' ? `<div class="pad"><button class="btn" data-a="turn" data-d="-1" aria-label="${esc(t('gameTurn'))} ‹">‹</button><button class="btn" data-a="drop">${esc(t('gameDrop'))}</button><button class="btn" data-a="turn" data-d="1" aria-label="${esc(t('gameTurn'))} ›">›</button></div>` : ''}`);
  later(() => { const h = $('.how'); if (h) h.style.opacity = 0; }, 7000);
  onActEnd = afterActivity;
  act = { fit: fitGame, sort: sortGame, path: pathGame }[k](fx, { duration: R.round === 2 ? DUR.game2 : DUR.game, onTick: tick, onEnd: () => { act = null; onActEnd(); } });
}
function playWave(done) {
  const tick = activity(`<div class="say"></div><div class="breath"></div>`);
  const line = $('.say'), br = $('.breath'); let shown = -1; music.scene('wave');
  onActEnd = done;
  act = waveScene(fx, {
    duration: DUR.wave, reduced: S.reduced,
    onBreath: (p) => { br.textContent = t(p === 'in' ? 'breatheIn' : 'breatheOut'); },
    onTick: (p) => {
      tick(p);
      const i = Math.min(C.wave.length - 1, Math.floor(p * C.wave.length));
      if (i !== shown) { shown = i; line.style.opacity = 0; later(() => { line.textContent = L(C.wave[i]); line.style.opacity = 1; speak('wave-' + two(i + 1)); }, shown ? 600 : 0); }
    },
    onEnd: () => { act = null; onActEnd(); }
  });
}
function playMove() {
  const tick = activity(`<div class="big"></div>`);
  const big = $('.big'), t0 = performance.now(); let shown = -1, raf = 0; music.scene('move');
  onActEnd = afterActivity;
  const loop = (now) => {
    const p = (now - t0) / 1000 / DUR.move; tick(p);
    const i = Math.min(C.move.length - 1, Math.floor(p * C.move.length));
    if (i !== shown) { shown = i; big.textContent = L(C.move[i]); speak('move-' + two(i + 1)); }
    if (p >= 1) { act = null; return onActEnd(); }
    raf = requestAnimationFrame(loop);
  };
  act = { stop: () => cancelAnimationFrame(raf) };
  raf = requestAnimationFrame(loop);
}

/* ---------- What each button does ---------- */
const actions = {
  go: (b) => go(b.dataset.to, b.dataset.arg != null ? +b.dataset.arg : undefined),
  rescue: () => startRescue(),
  rewalk: () => { walk = null; go('hub'); },
  lang: () => setLang(S.lang === 'en' ? 'rw' : 'en'),
  sound: () => { S.sound = !S.sound; save(); music.enable(S.sound); music.hit('tap'); rerender(); },
  setlang: (b) => setLang(b.dataset.l),
  rated: (b) => rated(+b.dataset.n),
  game: (b) => playGame(b.dataset.k),
  move: () => playMove(),
  skipact: () => { const f = onActEnd; if (act) { act.stop(); act = null; } f && f(); },
  turn: (b) => act && act.game && act.game.turn(+b.dataset.d),
  drop: () => act && act.game && act.game.drop(),
  practice: () => playWave(() => go('practice', true)),
  chg: () => { const e = $('#chg'); let n; do { n = L(pick(C.setting)); } while (n === e.textContent); e.textContent = n; },
  rq: () => { $('#rq').textContent = reminder(); },
  pex: (b) => { const x = C.planExamples[+b.dataset.i]; $('#pi').value = L(x.i); $('#pt').value = L(x.t); $('#pi').scrollIntoView({ block: 'center' }); },
  psave: (b) => {
    const i = $('#pi').value.trim(), th = $('#pt').value.trim();
    if (!i || !th) { $(i ? '#pt' : '#pi').focus(); return; }
    if (b.dataset.i !== '') S.plans[+b.dataset.i] = { i, t: th }; else if (S.plans.length < 3) S.plans.push({ i, t: th });
    S.why = $('#why').value.trim(); save(); go('plan'); toast(esc(t('saved')), 2200);
  },
  pedit: (b) => { go('plan', +b.dataset.i); $('#pi').focus(); },
  pdel: (b) => { S.plans.splice(+b.dataset.i, 1); save(); go('plan'); },
  whysave: () => { S.why = $('#why').value.trim(); save(); toast(esc(t('saved')), 2200); },
  wipe: () => {
    const lang = S.lang;
    try { localStorage.removeItem(KEY); } catch (e) { /* nothing was saved */ }
    S = defaults(); S.lang = lang; walk = null;                      // kept for this visit only, not saved
    music.enable(false); applyMotion(); go(cur.name === 'settings' ? 'settings' : 'plan'); toast(esc(t('deleted')), 3200);
  },
  set: (b) => {
    const k = b.dataset.k; S[k] = !S[k]; save();
    if (k === 'reduced' || k === 'simple') { if (!S.reduced && !S.simple) sessionSimple = false; applyMotion(); }
    if (k === 'sound') { music.enable(S.sound); music.hit('tap'); }
    if (k === 'voice' && !S.voice) music.hush();
    views.settings();
  }
};
function setLang(l) { S.lang = l; save(); root.lang = l; rerender(); }
ui.addEventListener('click', (e) => {
  const b = e.target.closest('[data-a]'); if (!b) return;
  if (b.tagName === 'A') e.preventDefault();
  actions[b.dataset.a](b);
});

if (TEST) window.__k = { get journey() { return journey; }, get state() { return S; }, get view() { return cur.name; }, get scene() { return scene3d; }, music };

/* ---------- Start ---------- */
root.lang = S.lang;
body.classList.toggle('still', S.reduced);
if (location.hash === '#rescue' || params.has('rescue')) startRescue();   // straight into the rescue
else if (S.skipGate && S.seen) go('hub');
else go('gate');
addEventListener('hashchange', () => { if (location.hash === '#rescue') startRescue(); });
load3d();
if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
  // When a newer version of the page has been saved, show it at once, but
  // only at the gate, so nobody is interrupted in the middle of a rescue.
  const had = !!navigator.serviceWorker.controller; let swapped = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => { if (had && !swapped && cur.name === 'gate') { swapped = true; location.reload(); } });
  navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' }).then((r) => r.update()).catch(() => { /* the page still works without it */ });
}
