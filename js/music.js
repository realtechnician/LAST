// The music. Nothing is downloaded: every sound is made by the phone
// itself (Web Audio), so it works offline and adds almost nothing to the
// page size. Each step of the journey has its own piece:
//   gate  - a low drone and a slow drum, swelling as the gate is held
//   void  - slow, wide chords with distant bells
//   game  - a driving pulse that grows
//   wave  - calm major chords, one chord for each breath
//   move  - a bright, walking rhythm
//   end   - a warm resolution
const hz = (m) => 440 * Math.pow(2, (m - 69) / 12);
let ctx = null, master = null, verb = null, level = null, on = false, want = 'gate';
let cur = null, timer = 0, riser = null, comp = null;
const clips = new Map(); let talking = null, queue = [], gen = 0, voiceOut = null;

function impulse(seconds) {
  const n = Math.floor(ctx.sampleRate * seconds), b = ctx.createBuffer(2, n, ctx.sampleRate);
  for (let c = 0; c < 2; c++) { const d = b.getChannelData(c); for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 2.6); }
  return b;
}
function init() {
  if (ctx) return true;
  try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return false; }
  master = ctx.createGain(); master.gain.value = 0;
  comp = ctx.createDynamicsCompressor(); comp.threshold.value = -16; comp.ratio.value = 4;
  level = ctx.createAnalyser(); level.fftSize = 256;
  master.connect(comp); comp.connect(level); level.connect(ctx.destination);
  verb = ctx.createConvolver(); verb.buffer = impulse(3.4);            // a large hall
  const wet = ctx.createGain(); wet.gain.value = .55; verb.connect(wet).connect(master);
  voiceOut = ctx.createGain(); voiceOut.gain.value = 1.5; voiceOut.connect(comp);          // the voice is not turned down with the music
  const air = ctx.createGain(); air.gain.value = .1; voiceOut.connect(air).connect(verb);   // a little of the hall on the voice
  return true;
}
function bus(vol) {
  const g = ctx.createGain(); g.gain.value = 0; g.connect(master); g.connect(verb);
  g.gain.setTargetAtTime(vol, ctx.currentTime, .7); return g;
}

/* ---------- instruments ---------- */
function env(t, dur, vol, attack, out) {
  const g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + attack);
  g.gain.setValueAtTime(vol, t + Math.max(attack, dur * .6)); g.gain.linearRampToValueAtTime(0, t + dur); g.connect(out); return g;
}
function strings(out, t, notes, dur, vol, bright) {           // slow, wide chord
  const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = bright; f.Q.value = .4;
  f.connect(env(t, dur, vol / notes.length, dur * .3, out));
  for (const m of notes) for (const d of [-7, 7]) { const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = hz(m); o.detune.value = d; o.connect(f); o.start(t); o.stop(t + dur + .1); }
}
function brass(out, t, notes, dur, vol) {                     // a swell that opens
  const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.setValueAtTime(250, t);
  f.frequency.exponentialRampToValueAtTime(2600, t + dur * .35); f.frequency.exponentialRampToValueAtTime(700, t + dur);
  f.connect(env(t, dur, vol / notes.length, dur * .25, out));
  for (const m of notes) { const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = hz(m); o.connect(f); o.start(t); o.stop(t + dur + .1); }
}
function bass(out, t, m, dur, vol) {
  const g = env(t, dur, vol, .08, out);
  const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = hz(m); o.connect(g); o.start(t); o.stop(t + dur + .1);
  const o2 = ctx.createOscillator(), f = ctx.createBiquadFilter(), g2 = ctx.createGain(); o2.type = 'sawtooth'; o2.frequency.value = hz(m);
  f.type = 'lowpass'; f.frequency.value = 220; g2.gain.value = .35; o2.connect(f).connect(g2).connect(g); o2.start(t); o2.stop(t + dur + .1);
}
function bell(out, t, m, vol) {
  for (const [mult, v, d] of [[1, 1, 2.8], [2.76, .25, 1.4], [5.4, .1, .7]]) {
    const o = ctx.createOscillator(), g = ctx.createGain(); o.type = 'sine'; o.frequency.value = hz(m) * mult;
    g.gain.setValueAtTime(vol * v, t); g.gain.exponentialRampToValueAtTime(.0001, t + d); o.connect(g).connect(out); o.start(t); o.stop(t + d + .05);
  }
}
function pluck(out, t, m, vol) {
  const o = ctx.createOscillator(), f = ctx.createBiquadFilter(), g = ctx.createGain(); o.type = 'triangle'; o.frequency.value = hz(m);
  f.type = 'lowpass'; f.frequency.setValueAtTime(3000, t); f.frequency.exponentialRampToValueAtTime(500, t + .3);
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0001, t + .5); o.connect(f).connect(g).connect(out); o.start(t); o.stop(t + .55);
}
function noise(out, t, dur, vol, from, to, rise) {
  const n = Math.floor(ctx.sampleRate * dur), b = ctx.createBuffer(1, n, ctx.sampleRate), d = b.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
  const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain(); s.buffer = b;
  f.type = 'bandpass'; f.Q.value = .6; f.frequency.setValueAtTime(from, t); f.frequency.exponentialRampToValueAtTime(to, t + dur);
  if (rise) { g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + dur * .8); g.gain.linearRampToValueAtTime(0, t + dur); }
  else { g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0001, t + dur); }
  s.connect(f).connect(g).connect(out); s.start(t);
}
function drum(out, t, m, vol) {                               // a deep kettle drum
  const o = ctx.createOscillator(), g = ctx.createGain(); o.type = 'sine';
  o.frequency.setValueAtTime(hz(m) * 1.6, t); o.frequency.exponentialRampToValueAtTime(hz(m), t + .09);
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0001, t + 1.1); o.connect(g).connect(out); o.start(t); o.stop(t + 1.2);
  noise(out, t, .12, vol * .3, 400, 120, false);
}

/* ---------- the pieces ---------- */
const DM = [[50, 57, 60, 64, 65], [46, 53, 57, 62, 65], [43, 50, 58, 62, 69], [45, 52, 57, 62, 64]];   // Dm9, Bbmaj7, Gm9, Asus
const EPIC = [[50, 57, 62, 65], [46, 53, 58, 62], [41, 48, 53, 57], [48, 55, 60, 64]];                 // Dm, Bb, F, C
const MAJ = [[50, 57, 62, 66], [43, 50, 59, 62], [47, 54, 59, 62], [45, 52, 57, 61]];                 // D, G, Bm, A
const HOME = [[50, 57, 62, 66], [49, 57, 61, 64], [47, 54, 59, 62], [43, 50, 59, 62]];                // D, A/C#, Bm, G
const SKY = [74, 77, 79, 81, 84, 86];
const pieces = {
  gate: { step: 1.5, play(i, t, o) {
    if (i % 4 === 0) bass(o, t, 26, 6.4, .5);
    if (i % 2 === 0) drum(o, t, 38, i % 4 === 0 ? .5 : .28);
    if (i % 8 === 4) strings(o, t, [38, 45, 50, 53], 8, .22, 420);
  } },
  void: { step: 2, play(i, t, o) {
    const c = DM[Math.floor(i / 4) % 4];
    if (i % 4 === 0) { strings(o, t, c, 9.5, .34, 950); bass(o, t, c[0] - 12, 8, .32); }
    if (Math.random() < .55) bell(o, t + Math.random(), SKY[Math.floor(Math.random() * SKY.length)], .07);
    if (i % 16 === 12) brass(o, t, [c[0], c[1], c[2]], 7, .1);
  } },
  game: { step: .3, play(i, t, o) {
    const bar = Math.floor(i / 8), c = EPIC[Math.floor(bar / 2) % 4], s = i % 8;
    if (i % 16 === 0) strings(o, t, c, 5.2, .26, 1300 + Math.min(900, bar * 20));
    if (s === 0 || s === 5) bass(o, t, c[0] - 12, .5, .5);
    pluck(o, t, c[[0, 1, 2, 3, 2, 1, 2, 3][s]] + 12, .13);
    if (bar >= 12 && s % 2) pluck(o, t, c[[3, 2, 1, 0][(s - 1) / 2]] + 24, .07);
    if (i % 16 === 0) drum(o, t, 38, .45);
    if (bar >= 6 && i % 16 === 14) drum(o, t, 33, .25);
    if (bar >= 16 && i % 32 === 0) brass(o, t, [c[0] + 12, c[2] + 12, c[3] + 12], 4.6, .16);
  } },
  wave: { step: 2.5, play(i, t, o) {
    const c = MAJ[Math.floor(i / 4) % 4];
    if (i % 4 === 0) { strings(o, t, c, 11.5, .34, 720); bass(o, t, c[0] - 12, 10, .28); }
    if (i % 4 === 2) bell(o, t, c[2] + 24, .05);
  } },
  move: { step: .27, play(i, t, o) {
    const c = MAJ[[0, 1, 3, 2][Math.floor(i / 8) % 4]], s = i % 8;
    if (s === 0) { strings(o, t, c, 2.4, .24, 1700); drum(o, t, 38, .45); bass(o, t, c[0] - 12, .5, .45); }
    if (s === 4) { drum(o, t, 45, .3); bass(o, t, c[0] - 12, .4, .35); }
    if (s % 2 === 0) pluck(o, t, c[s / 2] + 12, .13); else pluck(o, t, c[3] + 24, .05);
  } },
  end: { step: 2, play(i, t, o) {
    const c = HOME[Math.floor(i / 4) % 4];
    if (i === 0) { drum(o, t, 26, .6); noise(o, t, 3, .1, 6000, 2500, false); }
    if (i % 4 === 0) { strings(o, t, c, 9.5, .34, 1200); bass(o, t, c[0] - 12, 8, .34); brass(o, t, [c[1], c[2], c[3]], 8, i < 16 ? .14 : .07); }
    if (i % 2 === 1) bell(o, t, c[(i >> 1) % 4] + 24, .08);
  } }
};
// Which piece plays on which screen, and how loud.
const scenes = { gate: ['gate', .9], void: ['void', .85], quiet: ['void', .4], game: ['game', .75], wave: ['wave', .85], move: ['move', .75], end: ['end', .9] };

function tick() {
  if (!cur || !ctx) return;
  while (cur.next < ctx.currentTime + .3) { cur.def.play(cur.i++, cur.next, cur.out); cur.next += cur.def.step; }
}
function apply() {
  if (!on || !ctx) return;
  const [name, vol] = scenes[want] || scenes.void, def = pieces[name];
  if (cur && cur.def === def) { cur.out.gain.setTargetAtTime(vol, ctx.currentTime, .6); return; }
  if (cur) { const old = cur.out; old.gain.setTargetAtTime(0, ctx.currentTime, .5); setTimeout(() => old.disconnect(), 6000); }
  cur = { def, out: bus(vol), i: 0, next: ctx.currentTime + .08 };
}
function dropRiser() { if (!riser) return; const r = riser; riser = null; r.g.gain.setTargetAtTime(0, ctx.currentTime, .4); setTimeout(() => { r.osc.forEach((o) => o.stop()); r.g.disconnect(); }, 3000); }

/* ---------- the spoken voice: recordings in audio/<language>/ (see audio/SCRIPT.md) ---------- */
async function clip(url) {
  if (clips.has(url)) return clips.get(url);
  let buf = null;
  try { const r = await fetch(url); if (r.ok) buf = await ctx.decodeAudioData(await r.arrayBuffer()); } catch (e) { /* no recording for this line: stay silent */ }
  clips.set(url, buf); return buf;
}
function lift() { if (on && ctx) master.gain.setTargetAtTime(.8, ctx.currentTime, .6); }
function speakNext() {
  if (talking || !queue.length || !on) return;
  const url = queue.shift(), g = gen; talking = true;
  clip(url).then((buf) => {
    if (g !== gen) return;
    if (!buf || !on) { talking = null; if (!queue.length) lift(); return speakNext(); }
    const s = ctx.createBufferSource(); s.buffer = buf; s.connect(voiceOut);
    master.gain.setTargetAtTime(.28, ctx.currentTime, .15);                // music steps back while the voice speaks
    s.onended = () => { if (talking !== s) return; talking = null; if (!queue.length) lift(); speakNext(); };
    talking = s; s.start(); music.said.push(url);
  });
}

export const music = {
  said: [],                                   // the clips played so far (used by the automatic test)
  ready: () => !!(on && ctx),
  has: (url) => clip(url).then((b) => !!b),
  say(urls, replace) { if (!on || !ctx) return; if (replace) this.hush(); queue.push(...urls); speakNext(); },
  hush() { gen++; queue = []; const s = talking; talking = null; if (s && s.stop) { try { s.stop(); } catch (e) { /* already ended */ } } lift(); },
  // Called on a tap, because browsers only allow sound after one.
  enable(yes) {
    on = yes;
    if (!yes) { if (ctx) { this.hush(); master.gain.setTargetAtTime(0, ctx.currentTime, .15); dropRiser(); } clearInterval(timer); timer = 0; return; }
    if (!init()) return;
    if (ctx.state === 'suspended') ctx.resume();
    master.gain.setTargetAtTime(.8, ctx.currentTime, .3);
    if (!timer) timer = setInterval(tick, 90);
    apply();
  },
  unlock() { if (on) this.enable(true); },
  scene(name) { want = name; apply(); },
  // While the gate is held: a chord that rises and opens with the hold.
  hold(p) {
    if (!on || !ctx) return;
    if (p <= 0) return dropRiser();
    if (!riser) {
      const g = ctx.createGain(), f = ctx.createBiquadFilter(); g.gain.value = 0; f.type = 'lowpass'; f.frequency.value = 200; f.connect(g); g.connect(master); g.connect(verb);
      const osc = [38, 45, 50, 53, 57, 62].flatMap((m) => [-8, 8].map((d) => { const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = hz(m); o.detune.value = d; o.connect(f); o.start(); return o; }));
      riser = { g, f, osc };
    }
    riser.g.gain.setTargetAtTime(p * .09, ctx.currentTime, .08);
    riser.f.frequency.setTargetAtTime(180 + p * p * 3200, ctx.currentTime, .08);
  },
  hit(kind) {
    if (!on || !ctx) return;
    const t = ctx.currentTime + .02, o = bus(.9); setTimeout(() => o.disconnect(), 12000);
    if (kind === 'open') {                    // the gate gives way
      dropRiser(); drum(o, t, 26, .9); drum(o, t + .12, 38, .6); noise(o, t, 2.6, .35, 300, 60, false); noise(o, t, 4, .12, 7000, 2500, false);
      brass(o, t, [50, 57, 62, 66, 69], 6, .5); strings(o, t, [38, 50, 57, 62, 66, 74], 8, .5, 1800);
      [74, 78, 81, 86].forEach((m, k) => bell(o, t + .5 + k * .22, m, .12));
    } else if (kind === 'dawn') {             // the end of the path: light breaks
      drum(o, t, 26, .8); drum(o, t + 1.5, 26, .5); noise(o, t, 5, .1, 5000, 9000, true);
      brass(o, t, [50, 57, 62, 66, 69, 74], 8, .55); strings(o, t, [38, 50, 57, 62, 66, 74, 78], 10, .55, 2200);
      [62, 66, 69, 74, 78, 81, 86].forEach((m, k) => bell(o, t + .9 + k * .26, m, .13));
    } else if (kind === 'reveal') {           // the truth shows behind a thread
      strings(o, t, [57, 62, 65], 2.6, .22, 1400); bell(o, t, 81, .09);
    } else if (kind === 'cut') {              // a thread is cut
      noise(o, t, .25, .2, 6000, 900, false); [62, 66, 69, 74, 78, 81].forEach((m, k) => pluck(o, t + .06 + k * .07, m, .16));
      brass(o, t + .1, [50, 57, 62, 66], 3.4, .26); drum(o, t, 38, .5);
    } else if (kind === 'done') {             // an activity is finished
      [62, 69, 74].forEach((m, k) => bell(o, t + k * .18, m, .12)); strings(o, t, [50, 57, 62, 66], 3, .22, 1200);
    } else pluck(o, t, 74, .12);              // a small tap
  },
  // Used only by the automatic test, to confirm that sound is really produced.
  loudness() { if (!level) return 0; const d = new Uint8Array(level.fftSize); level.getByteTimeDomainData(d); let m = 0; for (const v of d) m = Math.max(m, Math.abs(v - 128)); return m; }
};
document.addEventListener('visibilitychange', () => { if (!ctx) return; if (document.hidden) ctx.suspend(); else if (on) ctx.resume(); });
