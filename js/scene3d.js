// The 3D scene: a heavy gate in darkness, and the void behind it.
// Loaded only when the phone can run it. If it runs slowly, app.js
// throws it away and uses the simple 2D scene from css/style.css.
import * as THREE from '../vendor/three.module.min.js';

function noiseTexture(w, h, paint) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  paint(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

function woodPaint(g, w, h) {
  g.fillStyle = '#3a2c26'; g.fillRect(0, 0, w, h);
  const planks = 4, pw = w / planks;
  for (let p = 0; p < planks; p++) {
    const tone = 34 + Math.random() * 20;
    g.fillStyle = `rgb(${tone + 16},${tone + 2},${tone - 6})`;
    g.fillRect(p * pw, 0, pw, h);
    for (let i = 0; i < 70; i++) {            // grain
      g.strokeStyle = `rgba(${Math.random() < .5 ? 0 : 150},${Math.random() * 60},40,${.05 + Math.random() * .1})`;
      g.lineWidth = .5 + Math.random() * 1.5;
      const x = p * pw + Math.random() * pw;
      g.beginPath(); g.moveTo(x, 0);
      g.bezierCurveTo(x + 6, h * .3, x - 6, h * .6, x + 3, h); g.stroke();
    }
    g.fillStyle = 'rgba(0,0,0,.75)'; g.fillRect(p * pw, 0, 3, h);   // gap between planks
  }
  for (let i = 0; i < 500; i++) {             // wear
    g.fillStyle = `rgba(0,0,0,${Math.random() * .25})`;
    g.fillRect(Math.random() * w, Math.random() * h, 1 + Math.random() * 3, 1 + Math.random() * 8);
  }
}

function stonePaint(g, w, h) {
  g.fillStyle = '#2b2830'; g.fillRect(0, 0, w, h);
  for (let i = 0; i < 2600; i++) {
    const v = 20 + Math.random() * 50;
    g.fillStyle = `rgba(${v},${v - 3},${v + 6},${Math.random() * .5})`;
    g.fillRect(Math.random() * w, Math.random() * h, 1 + Math.random() * 4, 1 + Math.random() * 4);
  }
  g.strokeStyle = 'rgba(0,0,0,.8)'; g.lineWidth = 3;
  const rows = 6, rh = h / rows;
  for (let r = 0; r < rows; r++) {
    g.beginPath(); g.moveTo(0, r * rh); g.lineTo(w, r * rh); g.stroke();
    for (let x = (r % 2) * w / 6; x < w; x += w / 3) { g.beginPath(); g.moveTo(x, r * rh); g.lineTo(x, r * rh + rh); g.stroke(); }
  }
}

function glowTexture() {
  return noiseTexture(128, 128, (g, w) => {
    const r = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2);
    r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(.3, 'rgba(255,255,255,.35)'); r.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = r; g.fillRect(0, 0, w, w);
  });
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

export function create(canvas, opts) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x030206);
  scene.fog = new THREE.FogExp2(0x030206, .04);
  const cam = new THREE.PerspectiveCamera(50, 1, .1, 120);
  let camZ0 = 8;

  /* ----- gate ----- */
  const gate = new THREE.Group(); scene.add(gate);
  const wood = noiseTexture(256, 512, woodPaint); wood.colorSpace = THREE.SRGBColorSpace;
  const stone = noiseTexture(256, 256, stonePaint); stone.colorSpace = THREE.SRGBColorSpace;
  const woodMat = new THREE.MeshStandardMaterial({ color: 0xa89a94, map: wood, bumpMap: wood, bumpScale: 3, roughness: .82, metalness: .1 });
  const ironMat = new THREE.MeshStandardMaterial({ color: 0x6b655f, roughness: .45, metalness: .85 });
  const stoneMat = new THREE.MeshStandardMaterial({ map: stone, bumpMap: stone, bumpScale: 4, roughness: .95 });
  const DW = 1.55, DH = 4.6;

  function door(side) {
    const hinge = new THREE.Group(); hinge.position.set(side * DW, 0, 0);
    const slab = new THREE.Mesh(new THREE.BoxGeometry(DW, DH, .22), woodMat);
    slab.position.set(-side * DW / 2, DH / 2, 0); hinge.add(slab);
    for (const y of [.9, 2.3, 3.7]) {
      const band = new THREE.Mesh(new THREE.BoxGeometry(DW + .02, .26, .3), ironMat);
      band.position.set(-side * DW / 2, y, 0); hinge.add(band);
      for (let i = 0; i < 5; i++) {
        const rivet = new THREE.Mesh(new THREE.SphereGeometry(.045, 8, 6), ironMat);
        rivet.position.set(-side * (DW * (.1 + i * .2)), y, .16); hinge.add(rivet);
      }
    }
    const ring = new THREE.Mesh(new THREE.TorusGeometry(.2, .035, 8, 20), ironMat);
    ring.position.set(-side * (DW - .32), 2.3, .2); hinge.add(ring);
    gate.add(hinge); return hinge;
  }
  const doorL = door(-1), doorR = door(1);

  const wallGeo = [[-6.6, 4, 10, 12], [6.6, 4, 10, 12], [0, 8.75, 3.4, 7.9]];   // x, y, w, h
  for (const [x, y, w, h] of wallGeo) {
    const m = stoneMat.clone(); m.map = stone.clone(); m.map.repeat.set(w / 3, h / 3); m.map.needsUpdate = true; m.bumpMap = m.map;
    const wall = new THREE.Mesh(new THREE.BoxGeometry(w, h, 1.2), m);
    wall.position.set(x, y, -.2); gate.add(wall);
  }
  const lintel = new THREE.Mesh(new THREE.BoxGeometry(3.9, .5, 1.5), stoneMat);
  lintel.position.set(0, DH + .28, -.1); gate.add(lintel);
  for (const s of [-1, 1]) {
    const post = new THREE.Mesh(new THREE.BoxGeometry(.4, DH + .1, 1.5), stoneMat);
    post.position.set(s * (DW + .2), DH / 2, -.1); gate.add(post);
  }
  const fm = stoneMat.clone(); fm.map = stone.clone(); fm.map.repeat.set(5, 5); fm.map.needsUpdate = true; fm.bumpMap = fm.map;
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(30, 16), fm);
  floor.rotation.x = -Math.PI / 2; floor.position.z = 7.4; gate.add(floor);

  const key = new THREE.SpotLight(0xffd6a0, 420, 40, .34, .85, 1.6);
  key.position.set(.8, 10, 6); key.target.position.set(0, 2.6, 0); gate.add(key, key.target);
  const fill = new THREE.PointLight(0x5a6cff, 7, 18, 1.8); fill.position.set(-4, 2, 5); gate.add(fill);
  scene.add(new THREE.AmbientLight(0x2a2233, .35));
  const back = new THREE.PointLight(0xc070ff, 0, 22, 1.4); back.position.set(0, 2.2, -1.6); scene.add(back);
  const crack = new THREE.Mesh(new THREE.PlaneGeometry(3.2, DH), new THREE.MeshBasicMaterial({ color: 0xd9a6ff, transparent: true, opacity: 0, fog: false }));
  crack.position.set(0, DH / 2, -.5); gate.add(crack);

  /* ----- void ----- */
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
  const N = 420, pos = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) { pos[i * 3] = (Math.random() - .5) * 40; pos[i * 3 + 1] = (Math.random() - .5) * 30; pos[i * 3 + 2] = (Math.random() - .5) * 30; }
  const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const glowTex = glowTexture();
  const dust = new THREE.Points(pg, new THREE.PointsMaterial({ map: glowTex, size: .22, color: 0xffd9f0, transparent: true, opacity: .75, depthWrite: false, blending: THREE.AdditiveBlending }));
  voidG.add(dust);
  const glows = [[0xb44cff, -5, 3, -8, 16], [0xff5d9e, 6, -4, -12, 20], [0xffc77a, 0, 0, -20, 12]].map(([c, x, y, z, s]) => {
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: c, transparent: true, opacity: .32, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }));
    sp.position.set(x, y, z); sp.scale.setScalar(s); voidG.add(sp); return sp;
  });

  /* ----- state ----- */
  let hold = 0, mode = 'gate', openT = 0, openDone = null, running = true, raf = 0, still = !!opts.still;
  let last = performance.now(), time = 0, frames = 0, fpsT = 0, slowTold = false;

  function resize() {
    const w = canvas.clientWidth || innerWidth, h = canvas.clientHeight || innerHeight;
    renderer.setSize(w, h, false);
    cam.aspect = w / h; cam.updateProjectionMatrix();
    camZ0 = Math.max(8, 4.6 / cam.aspect);
    if (!running || still) draw(0);
  }

  function draw(dt) {
    time += dt;
    if (mode === 'gate') {
      const sh = hold * hold * .012;
      cam.position.set(Math.sin(time * 47) * sh, 2.1 + Math.sin(time * .4) * .04 + Math.cos(time * 53) * sh, camZ0 - hold * .6);
      cam.lookAt(0, 2.3, 0);
      doorL.rotation.y = hold * .07; doorR.rotation.y = -hold * .07;
      back.intensity = 6 + hold * 90; crack.material.opacity = .15 + hold * .85;
    } else if (mode === 'opening') {
      openT = Math.min(1, openT + dt / 2.8);
      const e = openT < .5 ? 4 * openT ** 3 : 1 - (-2 * openT + 2) ** 3 / 2;
      const sw = Math.min(1, e * 1.5);
      doorL.rotation.y = .07 + sw * 1.75; doorR.rotation.y = -.07 - sw * 1.75;
      cam.position.set(0, 2.1 + e * .1, camZ0 - .6 - e * (camZ0 + 5.4));
      cam.lookAt(0, 2.2, cam.position.z - 10);
      back.intensity = 96 * (1 - e * .7); crack.material.opacity = 1 - sw;
      if (openT >= 1) { mode = 'void'; gate.visible = false; frames = 0; fpsT = 0; const d = openDone; openDone = null; d && d(); }
    } else {
      cam.position.set(Math.sin(time * .11) * .5, 2.2 + Math.sin(time * .15) * .35, -6);
      cam.lookAt(Math.sin(time * .07) * .6, 2.2, -18);
      back.intensity = 26;
    }
    for (const r of ribbons) r.uniforms.t.value = time;
    dust.rotation.y = time * .012; dust.rotation.x = Math.sin(time * .05) * .1;
    glows.forEach((g, i) => { g.material.opacity = .26 + .1 * Math.sin(time * .3 + i * 2); });
    renderer.render(scene, cam);
  }

  function loop(now) {
    raf = requestAnimationFrame(loop);
    const dt = Math.min(.05, (now - last) / 1000); last = now;
    draw(dt);
    // Measure speed for the first seconds of the gate and of the void.
    if (!slowTold && mode !== 'opening') {
      frames++; fpsT += dt;
      if (fpsT > 2.5 && fpsT < 2.6 + dt) {
        const fps = frames / fpsT;
        if (fps < 24) { slowTold = true; opts.onSlow && opts.onSlow(fps); }
      }
    }
  }
  function start() { if (raf || still) return; last = performance.now(); raf = requestAnimationFrame(loop); }
  function stop() { cancelAnimationFrame(raf); raf = 0; }

  resize();
  addEventListener('resize', resize);
  draw(0);
  start();

  return {
    setHold(p) { hold = p; if (still) draw(0); },
    open(done) {
      if (still) { this.toVoid(); done && done(); return; }
      mode = 'opening'; openT = 0; openDone = done;
    },
    toVoid() { mode = 'void'; gate.visible = false; cam.position.set(0, 2.2, -6); frames = 0; fpsT = 0; if (still || !raf) draw(0); },
    pause() { running = false; stop(); },
    resume() { running = true; start(); },
    setStill(s) { still = s; if (s) { stop(); draw(0); } else if (running) start(); },
    dispose() {
      stop(); removeEventListener('resize', resize);
      scene.traverse((o) => { o.geometry && o.geometry.dispose(); if (o.material) { o.material.map && o.material.map.dispose(); o.material.dispose(); } });
      renderer.dispose();
      const ext = renderer.getContext().getExtension('WEBGL_lose_context'); ext && ext.loseContext();
    }
  };
}
