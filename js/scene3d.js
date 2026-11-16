// The 3D scene: a heavy arched gate in a stone wall, lit by torches,
// and the void behind it. Loaded only when the phone can run it. If it
// runs slowly, app.js throws it away and shows pictures of this same gate
// instead (img/gate-closed.jpg and img/gate-open.jpg, made by
// tools/render-gate.js).
import * as THREE from '../vendor/three.module.min.js';

const LEAF = 1.7, SPRING = 3.4, RAD = 1.7;      // door leaf width, height where the arch starts, arch radius
export const VIEW_W = 5.7;                       // how much of the wall is visible, left to right
const TAN = Math.tan(25 * Math.PI / 180);
const rnd = (a, b) => a + Math.random() * (b - a);

/* ---------- textures, painted in code so nothing is downloaded ---------- */
function pair(w, h) {
  const mk = () => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
  const c = mk(), b = mk();
  return { c, b, g: c.getContext('2d'), h: b.getContext('2d') };
}
function tex(canvas, srgb) {
  const t = new THREE.CanvasTexture(canvas);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 4;
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
function mottle(g, w, h, n, size, alpha, light) {
  for (let i = 0; i < n; i++) {
    const v = light ? rnd(120, 255) : rnd(0, 60);
    g.fillStyle = `rgba(${v},${v * .95},${v * .9},${Math.random() * alpha})`;
    const s = rnd(1, size); g.fillRect(Math.random() * w, Math.random() * h, s, rnd(1, size));
  }
}
// Aged oak planks: colour, and a height map so the grain and gaps catch the light.
function woodTextures() {
  const W = 512, H = 1024, { c, b, g, h } = pair(W, H), planks = 4, pw = W / planks;
  h.fillStyle = '#8a8a8a'; h.fillRect(0, 0, W, H);
  for (let p = 0; p < planks; p++) {
    const x0 = p * pw, r = rnd(44, 68);
    g.fillStyle = `rgb(${r},${r * .72},${r * .52})`; g.fillRect(x0, 0, pw, H);
    for (let i = 0; i < 26; i++) { g.fillStyle = `rgba(${Math.random() < .5 ? 0 : 120},${Math.random() * 40},0,${Math.random() * .1})`; g.fillRect(x0 + Math.random() * pw, 0, rnd(4, 30), H); }
    for (let i = 0; i < 260; i++) {                      // grain
      const x = x0 + Math.random() * pw, y = rnd(-200, H), len = rnd(160, H), light = Math.random() < .35, a = rnd(.04, .17), lw = rnd(.4, 1.8);
      const path = (k) => { k.beginPath(); k.moveTo(x, y); k.bezierCurveTo(x + rnd(-6, 6), y + len * .33, x + rnd(-6, 6), y + len * .66, x + rnd(-4, 4), y + len); k.lineWidth = lw; k.stroke(); };
      g.strokeStyle = light ? `rgba(196,146,96,${a})` : `rgba(14,7,3,${a})`; path(g);
      h.strokeStyle = light ? `rgba(255,255,255,${a * .5})` : `rgba(0,0,0,${a})`; path(h);
    }
    for (let k = 0, n = Math.floor(rnd(0, 2.6)); k < n; k++) {   // knots
      const kx = x0 + rnd(pw * .25, pw * .75), ky = rnd(60, H - 60);
      for (let rr = 16; rr > 2; rr -= 2.5) { g.strokeStyle = `rgba(12,6,2,${.12 + (16 - rr) * .03})`; g.lineWidth = 1.2; g.beginPath(); g.ellipse(kx, ky, rr * .55, rr, 0, 0, 7); g.stroke(); h.strokeStyle = `rgba(0,0,0,${.06 + (16 - rr) * .02})`; h.beginPath(); h.ellipse(kx, ky, rr * .55, rr, 0, 0, 7); h.stroke(); }
    }
    for (const [k, col] of [[g, '0,0,0'], [h, '0,0,0']]) {       // rounded plank edges and the dark gap between planks
      for (const s of [0, 1]) { const gr = k.createLinearGradient(x0 + (s ? pw : 0), 0, x0 + (s ? pw - 14 : 14), 0); gr.addColorStop(0, `rgba(${col},.75)`); gr.addColorStop(1, `rgba(${col},0)`); k.fillStyle = gr; k.fillRect(x0 + (s ? pw - 14 : 0), 0, 14, H); }
      k.fillStyle = '#000'; k.fillRect(x0 - 2.5, 0, 5, H); if (p === 0) k.fillRect(W - 2.5, 0, 2.5, H);
    }
  }
  const damp = g.createLinearGradient(0, H * .72, 0, H); damp.addColorStop(0, 'rgba(0,0,0,0)'); damp.addColorStop(1, 'rgba(0,0,0,.55)'); g.fillStyle = damp; g.fillRect(0, 0, W, H);
  mottle(g, W, H, 900, 5, .22, false); mottle(g, W, H, 200, 3, .1, true);
  return { map: tex(c, true), bump: tex(b) };
}
// Stone: either coursed blocks with mortar joints (a wall, a floor) or one plain face (a carved block).
function stoneTextures(courses, tone) {
  const S = 512, { c, b, g, h } = pair(S, S);
  g.fillStyle = `rgb(${tone},${tone * .96},${tone * .93})`; g.fillRect(0, 0, S, S); h.fillStyle = '#9a9a9a'; h.fillRect(0, 0, S, S);
  if (courses) {
    const rh = S / courses;
    for (let r = 0; r < courses; r++) {
      let x = -rnd(0, 90);
      while (x < S) {
        const w = rnd(90, 200), v = tone + rnd(-20, 16);
        g.fillStyle = `rgb(${v},${v * .95},${v * .9})`; g.fillRect(x, r * rh, w, rh);
        g.fillStyle = 'rgba(8,6,6,.8)'; g.fillRect(x - 1.5 + rnd(-1, 1), r * rh, rnd(2, 3.5), rh); h.fillStyle = 'rgba(0,0,0,.85)'; h.fillRect(x - 2.5, r * rh, 5, rh);
        for (let k = 0; k < 5; k++) { g.fillStyle = `rgba(0,0,0,${rnd(.2, .6)})`; g.beginPath(); g.arc(x + rnd(-4, 4), r * rh + rnd(0, rh), rnd(2, 7), 0, 7); g.fill(); }
        h.fillStyle = `rgba(255,255,255,${rnd(0, .12)})`; h.fillRect(x + 3, r * rh + 3, w - 6, rh - 6);
        x += w;
      }
      g.fillStyle = 'rgba(8,6,6,.8)'; g.fillRect(0, r * rh - 1.5, S, 3); h.fillStyle = 'rgba(0,0,0,.85)'; h.fillRect(0, r * rh - 2.5, S, 5);
      for (let k = 0; k < 26; k++) { g.fillStyle = `rgba(0,0,0,${rnd(.15, .5)})`; g.beginPath(); g.arc(rnd(0, S), r * rh + rnd(-4, 4), rnd(2, 8), 0, 7); g.fill(); }
    }
  }
  mottle(g, S, S, 7000, 6, .34, false); mottle(g, S, S, 1800, 4, .12, true);
  for (let i = 0; i < 40; i++) { const x = rnd(0, S), y = rnd(0, S), rr = rnd(20, 70), gr = g.createRadialGradient(x, y, 0, x, y, rr); gr.addColorStop(0, `rgba(${Math.random() < .5 ? '0,0,0' : '60,70,40'},${rnd(.08, .22)})`); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(x - rr, y - rr, rr * 2, rr * 2); }   // stains and moss
  mottle(h, S, S, 2600, 4, .35, false); mottle(h, S, S, 900, 3, .25, true);
  for (let i = 0; i < 14; i++) { g.strokeStyle = `rgba(0,0,0,${rnd(.2, .5)})`; g.lineWidth = rnd(.5, 1.4); g.beginPath(); let x = Math.random() * S, y = Math.random() * S; g.moveTo(x, y); for (let k = 0; k < 6; k++) { x += rnd(-22, 22); y += rnd(4, 26); g.lineTo(x, y); } g.stroke(); }
  return { map: tex(c, true), bump: tex(b) };
}
function ironTextures() {
  const S = 256, { c, b, g, h } = pair(S, S);
  g.fillStyle = '#3a3836'; g.fillRect(0, 0, S, S); h.fillStyle = '#909090'; h.fillRect(0, 0, S, S);
  mottle(g, S, S, 2600, 4, .5, false); mottle(g, S, S, 500, 3, .12, true);
  for (let i = 0; i < 260; i++) { g.fillStyle = `rgba(${rnd(110, 150)},${rnd(50, 70)},${rnd(18, 30)},${rnd(.05, .3)})`; g.beginPath(); g.arc(Math.random() * S, Math.random() * S, rnd(1, 9), 0, 7); g.fill(); }   // rust
  mottle(h, S, S, 2200, 5, .5, false); mottle(h, S, S, 900, 4, .4, true);
  return { map: tex(c, true), bump: tex(b) };
}
function glowTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d');
  const r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(.3, 'rgba(255,255,255,.35)'); r.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = r; g.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(c);
}
function beyondTexture() {
  const c = document.createElement('canvas'); c.width = 128; c.height = 192; const g = c.getContext('2d');
  g.fillStyle = '#16062c'; g.fillRect(0, 0, 128, 192);
  const r = g.createRadialGradient(64, 112, 0, 64, 112, 120); r.addColorStop(0, '#fff4ff'); r.addColorStop(.22, '#e3b4ff'); r.addColorStop(.55, '#8a3fe0'); r.addColorStop(1, 'rgba(40,10,80,0)');
  g.fillStyle = r; g.fillRect(0, 0, 128, 192);
  for (let i = 0; i < 5; i++) { g.strokeStyle = `rgba(255,${150 + i * 20},${200 + i * 10},.08)`; g.lineWidth = 14 + i * 4; g.beginPath(); g.moveTo(-10, 40 + i * 30); g.bezierCurveTo(40, 10 + i * 34, 90, 90 + i * 22, 140, 50 + i * 28); g.stroke(); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
function beamTexture() {
  const c = document.createElement('canvas'); c.width = 64; c.height = 128; const g = c.getContext('2d');
  const v = g.createLinearGradient(0, 0, 0, 128); v.addColorStop(0, 'rgba(255,255,255,1)'); v.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = v; g.fillRect(0, 0, 64, 128);
  g.globalCompositeOperation = 'destination-in';
  const hgr = g.createLinearGradient(0, 0, 64, 0); hgr.addColorStop(0, 'rgba(0,0,0,0)'); hgr.addColorStop(.5, 'rgba(0,0,0,1)'); hgr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = hgr; g.fillRect(0, 0, 64, 128);
  return new THREE.CanvasTexture(c);
}
// A dim room for the metal to reflect: warm above, violet below.
function envTexture() {
  const c = document.createElement('canvas'); c.width = 256; c.height = 128; const g = c.getContext('2d');
  const v = g.createLinearGradient(0, 0, 0, 128); v.addColorStop(0, '#6a5a4a'); v.addColorStop(.45, '#1a1614'); v.addColorStop(1, '#0c0812'); g.fillStyle = v; g.fillRect(0, 0, 256, 128);
  for (const [x, col] of [[60, 'rgba(255,170,80,.9)'], [196, 'rgba(255,170,80,.9)'], [128, 'rgba(190,205,255,.7)']]) { const r = g.createRadialGradient(x, 44, 0, x, 44, 30); r.addColorStop(0, col); r.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = r; g.fillRect(x - 30, 14, 60, 60); }
  const t = new THREE.CanvasTexture(c); t.mapping = THREE.EquirectangularReflectionMapping; t.colorSpace = THREE.SRGBColorSpace; return t;
}

const RIBBON_VS = `
uniform float t; uniform float ph; varying vec2 vUv;
void main(){
  vUv = uv; vec3 p = position;
  float a = p.x * .32 + t * .22 + ph;
  p.y += sin(a) * 1.3 + sin(p.x * .85 - t * .17 + ph * 2.) * .4;
  p.z += cos(p.x * .38 + t * .19 + ph) * 1.6;
  p.y += (uv.y - .5) * sin(p.x * .55 + t * .15 + ph) * 1.4;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.);
}`;
const RIBBON_FS = `
uniform float t; uniform float ph; uniform float op; uniform vec3 ca; uniform vec3 cb; varying vec2 vUv;
void main(){
  float edge = smoothstep(0., .5, vUv.y) * smoothstep(1., .5, vUv.y);
  float ends = smoothstep(0., .18, vUv.x) * smoothstep(1., .82, vUv.x);
  float sheen = .5 + .5 * sin(vUv.x * 22. + t * .4 + vUv.y * 4. + ph);
  vec3 c = mix(ca, cb, clamp(vUv.y + .25 * sheen, 0., 1.));
  gl_FragColor = vec4(c, edge * ends * (.16 + .34 * sheen) * op);
}`;

export function create(canvas, opts = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: opts.capture ? 'default' : 'low-power' });
  renderer.setPixelRatio(opts.capture ? 1 : Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x030206);
  scene.fog = new THREE.FogExp2(0x030206, .034);
  const pm = new THREE.PMREMGenerator(renderer), envSrc = envTexture();
  scene.environment = pm.fromEquirectangular(envSrc).texture; envSrc.dispose(); pm.dispose();
  const cam = new THREE.PerspectiveCamera(50, 1, .1, 140);
  let camZ0 = 9, camY0 = 2.6;

  /* ----- the gate ----- */
  const gate = new THREE.Group(); scene.add(gate);
  const wd = woodTextures(), wallT = stoneTextures(5, 58), flagT = stoneTextures(3, 50), blockT = stoneTextures(0, 66), ir = ironTextures();
  wd.map.repeat.set(1 / 1.12, 1 / 5.2); wd.bump.repeat.copy(wd.map.repeat);
  wallT.map.repeat.set(.25, .25); wallT.bump.repeat.set(.25, .25);
  blockT.map.repeat.set(.5, .5); blockT.bump.repeat.set(.5, .5);
  flagT.map.repeat.set(7, 4); flagT.bump.repeat.set(7, 4);
  const woodMat = new THREE.MeshStandardMaterial({ map: wd.map, bumpMap: wd.bump, bumpScale: 3.2, roughness: .8, metalness: 0, envMapIntensity: .12 });
  const ironMat = new THREE.MeshStandardMaterial({ map: ir.map, bumpMap: ir.bump, bumpScale: 1.6, roughness: .55, metalness: .9, envMapIntensity: 1.3 });
  const wallMat = new THREE.MeshStandardMaterial({ map: wallT.map, bumpMap: wallT.bump, bumpScale: 3.2, roughness: .96, envMapIntensity: .06 });
  const blockMat = new THREE.MeshStandardMaterial({ map: blockT.map, bumpMap: blockT.bump, bumpScale: 4, roughness: .93, envMapIntensity: .07 });
  const flagMat = new THREE.MeshStandardMaterial({ map: flagT.map, bumpMap: flagT.bump, bumpScale: 5, roughness: .9, envMapIntensity: .08 });
  const solid = (geo, mat, parent, x = 0, y = 0, z = 0) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = m.receiveShadow = true; parent.add(m); return m; };
  const extrude = (shape, depth, bevel) => new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: !!bevel, bevelSize: bevel || 0, bevelThickness: bevel || 0, bevelSegments: 2, curveSegments: 20 });
  const studGeo = new THREE.SphereGeometry(.038, 10, 5, 0, Math.PI * 2, 0, Math.PI / 2); studGeo.rotateX(Math.PI / 2);

  function leaf(side) {                           // side -1 is the left leaf, +1 the right
    const d = -side, hinge = new THREE.Group(); hinge.position.set(side * LEAF, 0, 0);
    const s = new THREE.Shape(); s.moveTo(0, .015); s.lineTo(d * LEAF, .015); s.lineTo(d * LEAF, SPRING + RAD);
    s.absarc(d * LEAF, SPRING, RAD, Math.PI / 2, d > 0 ? Math.PI : 0, d < 0); s.closePath();
    const g = extrude(s, .2, .012); g.translate(0, 0, -.1); solid(g, woodMat, hinge);
    const studs = [];
    for (const y of [.55, 1.95, 3.25]) {          // strap hinges with spear tips
      const L = 1.34, st = new THREE.Shape();
      st.moveTo(0, -.095); st.lineTo(d * L * .8, -.055); st.lineTo(d * L * .86, -.115); st.lineTo(d * L, 0); st.lineTo(d * L * .86, .115); st.lineTo(d * L * .8, .055); st.lineTo(0, .095); st.closePath();
      solid(extrude(st, .03, .006), ironMat, hinge, 0, y, .112);
      solid(new THREE.CylinderGeometry(.065, .065, .34, 12), ironMat, hinge, -d * .01, y, .14);
      for (const f of [.12, .36, .6, .78]) studs.push([d * L * f, y, .15]);
    }
    for (const y of [1.25, 2.6, 4.02]) for (let k = 0; k < 6; k++) {   // rows of studs, one for each plank
      const x = d * (.14 + .28 * k);
      if (y > SPRING && Math.hypot(x - d * LEAF, y - SPRING) > RAD - .16) continue;
      studs.push([x, y, .112]);
    }
    const inst = new THREE.InstancedMesh(studGeo, ironMat, studs.length), m4 = new THREE.Matrix4();
    studs.forEach((p, i) => { m4.makeTranslation(p[0], p[1], p[2]); inst.setMatrixAt(i, m4); }); inst.castShadow = true; hinge.add(inst);
    const rx = d * (LEAF - .42), ry = 2.42;       // ring pull
    const plate = new THREE.CylinderGeometry(.13, .13, .03, 22); plate.rotateX(Math.PI / 2); solid(plate, ironMat, hinge, rx, ry, .125);
    solid(new THREE.SphereGeometry(.05, 12, 8), ironMat, hinge, rx, ry + .06, .16);
    const ring = solid(new THREE.TorusGeometry(.15, .022, 8, 26), ironMat, hinge, rx, ry - .09, .175); ring.rotation.x = .14;
    if (side > 0) {                               // the cover strip and the lock, on the right leaf
      solid(new THREE.BoxGeometry(.1, SPRING + RAD - .08, .05), ironMat, hinge, d * (LEAF - .05), (SPRING + RAD) / 2, .125);
      solid(new THREE.BoxGeometry(.17, .36, .025), ironMat, hinge, rx, 1.72, .118);
      const hole = new THREE.Mesh(new THREE.CircleGeometry(.026, 12), new THREE.MeshBasicMaterial({ color: 0x000000 })); hole.position.set(rx, 1.76, .132); hinge.add(hole);
      const slot = new THREE.Mesh(new THREE.PlaneGeometry(.022, .08), hole.material); slot.position.set(rx, 1.7, .132); hinge.add(slot);
    }
    gate.add(hinge); return hinge;
  }
  const doorL = leaf(-1), doorR = leaf(1);

  const A = LEAF + .04, ws = new THREE.Shape();   // the wall, with an arched opening
  ws.moveTo(-13, -1); ws.lineTo(13, -1); ws.lineTo(13, 17); ws.lineTo(-13, 17); ws.closePath();
  const hole = new THREE.Path(); hole.moveTo(-A, -.5); hole.lineTo(A, -.5); hole.lineTo(A, SPRING); hole.absarc(0, SPRING, A, 0, Math.PI, false); hole.lineTo(-A, -.5); ws.holes.push(hole);
  solid(extrude(ws, 1.5), wallMat, gate, 0, 0, -1.05);
  const N = 11;                                   // the stones of the arch, with a keystone
  for (let k = 0; k < N; k++) {
    const a0 = k * Math.PI / N + .012, a1 = (k + 1) * Math.PI / N - .012, key = k === (N - 1) / 2, ro = key ? 2.62 : 2.3 + (k % 2) * .08, v = new THREE.Shape();
    v.moveTo(A * Math.cos(a0), A * Math.sin(a0)); v.lineTo(ro * Math.cos(a0), ro * Math.sin(a0)); v.absarc(0, 0, ro, a0, a1, false);
    v.lineTo(A * Math.cos(a1), A * Math.sin(a1)); v.absarc(0, 0, A, a1, a0, true);
    solid(extrude(v, key ? .2 : rnd(.09, .13), .028), blockMat, gate, 0, SPRING, .45);
  }
  for (const sgn of [-1, 1]) for (let j = 0; j < 6; j++) {   // the stones down each side
    const hh = SPRING / 6, w = j % 2 ? .4 : .56;
    solid(new THREE.BoxGeometry(w, hh - .022, rnd(.2, .26)), blockMat, gate, sgn * (A + w / 2), j * hh + hh / 2, .45);
  }
  solid(new THREE.BoxGeometry(5.3, .2, 2.4), blockMat, gate, 0, -.1, .75);     // the step
  solid(new THREE.BoxGeometry(6.6, .1, 3.3), blockMat, gate, 0, -.15, 1.1);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(44, 24), flagMat); floor.rotation.x = -Math.PI / 2; floor.position.set(0, -.2, 12.2); floor.receiveShadow = true; gate.add(floor);

  const glowTex = glowTexture(), torches = [];
  for (const sgn of [-1, 1]) {                    // a torch on each side
    const x = sgn * 2.52, y = 2.75;
    solid(new THREE.BoxGeometry(.05, .46, .05), ironMat, gate, x, y - .2, .52);
    solid(new THREE.BoxGeometry(.05, .05, .3), ironMat, gate, x, y - .02, .66);
    solid(new THREE.CylinderGeometry(.085, .05, .17, 10), ironMat, gate, x, y + .05, .8);
    const light = new THREE.PointLight(0xff8a38, 30, 12, 1.6); light.position.set(x, y + .35, 1.15); gate.add(light);
    const fl = [[0xff7a1c, .62, .95, .75], [0xffd27a, .3, .5, 1]].map(([c, w, hgt, o]) => {
      const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: c, transparent: true, opacity: o, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }));
      sp.center.set(.5, .22); sp.position.set(x, y + .12, .82); sp.scale.set(w, hgt, 1); sp.userData = { w, hgt }; gate.add(sp); return sp;
    });
    torches.push({ light, fl, ph: sgn * 1.7 });
  }
  const moon = new THREE.SpotLight(0xb8c4ee, 110, 46, .3, .9, 1.5);   // cold light from high up; it casts the shadows
  moon.position.set(3.4, 12.5, 9.5); moon.target.position.set(0, 2.4, 0); moon.castShadow = true;
  moon.shadow.mapSize.set(1024, 1024); moon.shadow.camera.near = 4; moon.shadow.camera.far = 30; moon.shadow.bias = -.0006; moon.shadow.normalBias = .03;
  gate.add(moon, moon.target);
  scene.add(new THREE.AmbientLight(0x1c1a22, .1));
  const fill = new THREE.PointLight(0xff9a50, 9, 16, 1.5); fill.position.set(0, 1.2, 6.5); gate.add(fill);   // a little warmth on the steps
  const back = new THREE.PointLight(0xc070ff, 0, 22, 1.4); back.position.set(0, 2.4, -1.4); scene.add(back);
  const beyond = new THREE.Mesh(new THREE.PlaneGeometry(3.6, SPRING + RAD + .2), new THREE.MeshBasicMaterial({ map: beyondTexture(), transparent: true, opacity: 0, fog: false, toneMapped: false }));
  beyond.position.set(0, (SPRING + RAD) / 2, -.6); gate.add(beyond);
  const add = (color, w, hgt, map) => new THREE.Mesh(new THREE.PlaneGeometry(w, hgt), new THREE.MeshBasicMaterial({ color, map, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }));
  const seam = add(0xf0d2ff, .016, SPRING + RAD - .1); seam.position.set(0, (SPRING + RAD) / 2, .125); gate.add(seam);     // light between the leaves
  const sill = add(0xe6c0ff, LEAF * 2, .035); sill.position.set(0, .02, .125); gate.add(sill);                          // light under the leaves
  const beam = add(0xb46cff, 1, 2.1, beamTexture()); beam.rotation.x = -Math.PI / 2; beam.position.set(0, .012, 1.15); gate.add(beam);   // light spilling on the step
  const MN = 110, mp = new Float32Array(MN * 3);
  for (let i = 0; i < MN; i++) { mp[i * 3] = rnd(-2.7, 2.7); mp[i * 3 + 1] = rnd(0, 6); mp[i * 3 + 2] = rnd(.5, 4); }
  const mg = new THREE.BufferGeometry(); mg.setAttribute('position', new THREE.BufferAttribute(mp, 3));
  const motes = new THREE.Points(mg, new THREE.PointsMaterial({ map: glowTex, size: .05, color: 0xffd9a8, transparent: true, opacity: .5, depthWrite: false, blending: THREE.AdditiveBlending })); gate.add(motes);

  /* ----- the void ----- */
  const voidG = new THREE.Group(); voidG.position.set(0, 2.2, -18); scene.add(voidG);
  const ribbons = [];
  const palette = [[0xff4f9a, 0x7a3cff], [0x9a6bff, 0xffc77a], [0xff7ab8, 0x3c2a9a], [0x6a4cff, 0xff5d9e], [0xffb46a, 0xb44cff]];
  palette.forEach(([a, b], i) => {
    const mat = new THREE.ShaderMaterial({
      uniforms: { t: { value: 0 }, ph: { value: i * 1.7 }, op: { value: 1 }, ca: { value: new THREE.Color(a) }, cb: { value: new THREE.Color(b) } },
      vertexShader: RIBBON_VS, fragmentShader: RIBBON_FS, transparent: true, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending
    });
    const m = new THREE.Mesh(new THREE.PlaneGeometry(34, 2.2 + i * .5, 90, 1), mat);
    m.position.set((i - 2) * 1.2, (i - 2) * 2.6, -i * 2.6 + 4);
    m.rotation.set(.3 * (i % 2 ? 1 : -1), 0, (i - 2) * .28);
    voidG.add(m); ribbons.push(mat);
  });
  const DN = 420, pos = new Float32Array(DN * 3);
  for (let i = 0; i < DN; i++) { pos[i * 3] = rnd(-20, 20); pos[i * 3 + 1] = rnd(-15, 15); pos[i * 3 + 2] = rnd(-15, 15); }
  const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const dust = new THREE.Points(pg, new THREE.PointsMaterial({ map: glowTex, size: .22, color: 0xffd9f0, transparent: true, opacity: .75, depthWrite: false, blending: THREE.AdditiveBlending }));
  voidG.add(dust);
  const glows = [[0xb44cff, -5, 3, -8, 16], [0xff5d9e, 6, -4, -12, 20], [0xffc77a, 0, 0, -20, 12]].map(([c, x, y, z, s]) => {
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: c, transparent: true, opacity: .32, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }));
    sp.position.set(x, y, z); sp.scale.setScalar(s); voidG.add(sp); return sp;
  });
  const sun = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: 0xffd9a0, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }));
  sun.position.set(0, -7, -14); sun.scale.set(46, 26, 1); voidG.add(sun);      // the light that rises when the path is open

  /* ----- state ----- */
  let hold = 0, mode = 'gate', openT = 0, openDone = null, running = true, raf = 0, still = !!opts.still, dawnTo = 0, dawn = 0;
  let last = performance.now(), time = 0, frames = 0, phase0 = 0, checked = false, slowTold = false;
  const ease = (x) => { x = Math.max(0, Math.min(1, x)); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };

  function resize() {
    const w = opts.capture ? opts.capture[0] : canvas.clientWidth || innerWidth, h = opts.capture ? opts.capture[1] : canvas.clientHeight || innerHeight;
    renderer.setSize(w, h, false);
    cam.aspect = w / h; cam.updateProjectionMatrix();
    camZ0 = Math.max(8.2, VIEW_W / (2 * TAN * cam.aspect));   // far enough to see the whole doorway
    camY0 = .6 * camZ0 * TAN;                                // the foot of the door sits 80% of the way down the screen
    if (!raf) draw(0);
  }
  function gateLook(open) {
    seam.material.opacity = Math.min(.9, hold * 1.1) * (1 - open); seam.scale.x = 1 + hold * 1.4;
    sill.material.opacity = hold * .9 * (1 - open);
    beam.material.opacity = Math.max(hold * .5, open * .8) ; beam.scale.x = .12 + hold * .35 + open * 3.4;
    beyond.material.opacity = .12 + hold * .88;
  }

  function draw(dt) {
    time += dt;
    if (mode !== 'void') {
      torches.forEach((tc) => {                   // fire is never still
        const f = 1 + .16 * Math.sin(time * 11 + tc.ph) + .1 * Math.sin(time * 23.7 + tc.ph * 2) + .06 * Math.sin(time * 41.3);
        tc.light.intensity = 30 * f;
        tc.fl.forEach((sp, i) => sp.scale.set(sp.userData.w * (1 + .08 * Math.sin(time * 17 + i + tc.ph)), sp.userData.hgt * (.9 + .22 * f * (i ? .8 : 1)), 1));
      });
      motes.position.y = Math.sin(time * .13) * .25; motes.rotation.y = Math.sin(time * .06) * .08;
    }
    if (mode === 'gate') {
      const sh = hold * hold * .014;
      cam.position.set(Math.sin(time * 47) * sh, camY0 + Math.sin(time * .35) * .03 + Math.cos(time * 53) * sh, camZ0 - hold * .5 + Math.sin(time * .22) * .06);
      cam.lookAt(cam.position.x * .5, camY0, 0);
      doorL.rotation.y = hold * .045; doorR.rotation.y = -hold * .04;
      back.intensity = 2 + hold * 70; gateLook(0);
    } else if (mode === 'opening') {
      openT = Math.min(1, openT + dt / 3.6);
      const sL = ease((openT - .06) / .62), sR = ease((openT - .12) / .62), c = ease((openT - .3) / .7);
      const sh = (1 - sL) * .012 * (openT < .25 ? 1 : 0);     // the leaves give way with a shudder
      doorL.rotation.y = .045 + sL * 1.72; doorR.rotation.y = -.04 - sR * 1.7;
      cam.position.set(Math.sin(time * 61) * sh, camY0 + (2.2 - camY0) * c + Math.cos(time * 57) * sh, camZ0 - .5 - c * (camZ0 + 5.5));
      cam.lookAt(0, camY0 + (2.2 - camY0) * c, cam.position.z - 10);
      back.intensity = 74 * (1 - c * .65); gateLook(sL); beyond.material.opacity = 1 - sL;
      if (openT >= 1) { toVoid(); const d = openDone; openDone = null; d && d(); }
    } else {
      cam.position.set(Math.sin(time * .11) * .5, 2.2 + Math.sin(time * .15) * .35, -6);
      cam.lookAt(Math.sin(time * .07) * .6, 2.2 + dawn * .6, -18);
      back.intensity = 26;
      dawn += (dawnTo - dawn) * Math.min(1, dt * .7 + (raf ? 0 : 1));
      renderer.toneMappingExposure = 1.05 + dawn * .35; sun.material.opacity = dawn * .55; sun.position.y = -7 + dawn * 5;
    }
    for (const r of ribbons) { r.uniforms.t.value = time; r.uniforms.op.value = 1 + dawn * 1.1; }
    dust.rotation.y = time * .012; dust.rotation.x = Math.sin(time * .05) * .1;
    glows.forEach((g, i) => { g.material.opacity = (.26 + .1 * Math.sin(time * .3 + i * 2)) * (1 + dawn * .8); });
    renderer.render(scene, cam);
  }
  function toVoid() { mode = 'void'; gate.visible = false; moon.castShadow = false; renderer.shadowMap.enabled = false; frames = 0; checked = false; }

  function loop(now) {
    raf = requestAnimationFrame(loop);
    const dt = Math.min(.1, (now - last) / 1000); last = now;
    draw(dt);
    // Measure real speed for the first seconds of the gate and of the void.
    // Very slow phones are caught after one second, the rest after 2.5.
    if (!slowTold && mode !== 'opening') {
      if (!frames) phase0 = now;
      frames++;
      const el = (now - phase0) / 1000, fps = (frames - 1) / el;
      if ((el > 1 && fps < 9) || (el > 2.5 && !checked && fps < 24)) { slowTold = true; opts.onSlow && opts.onSlow(fps); }
      if (el > 2.5) checked = true;
    }
  }
  function start() { if (raf || still || opts.capture) return; last = performance.now(); raf = requestAnimationFrame(loop); }
  function stop() { cancelAnimationFrame(raf); raf = 0; }

  resize();
  addEventListener('resize', resize);
  draw(0);
  start();

  return {
    setHold(p) { hold = p; if (!raf) draw(0); },
    open(done) { if (still) { toVoid(); draw(0); done && done(); return; } mode = 'opening'; openT = 0; openDone = done; },
    toVoid() { toVoid(); cam.position.set(0, 2.2, -6); if (!raf) draw(0); },
    setDawn(on) { dawnTo = on ? 1 : 0; if (!raf) draw(0); },
    pause() { running = false; stop(); },
    resume() { running = true; start(); },
    // Used by tools/render-gate.js to make the pictures for slow phones.
    picture(kind) {
      hold = 0; mode = 'gate'; time = 0; draw(0);
      if (kind === 'open') { doorL.visible = doorR.visible = false; seam.visible = sill.visible = false; beyond.material.opacity = 1; back.intensity = 60; beam.material.opacity = .8; beam.scale.x = 3.4; renderer.render(scene, cam); }
      const url = canvas.toDataURL('image/jpeg', .84);
      doorL.visible = doorR.visible = seam.visible = sill.visible = true; return url;
    },
    dispose() {
      stop(); removeEventListener('resize', resize);
      scene.traverse((o) => { o.geometry && o.geometry.dispose(); if (o.material) { for (const k of ['map', 'bumpMap']) o.material[k] && o.material[k].dispose(); o.material.dispose(); } });
      scene.environment && scene.environment.dispose(); renderer.dispose();
      const ext = renderer.getContext().getExtension('WEBGL_lose_context'); ext && ext.loseContext();
    }
  };
}
