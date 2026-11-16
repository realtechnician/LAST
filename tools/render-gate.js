// Makes img/gate-closed.jpg and img/gate-open.jpg from the 3D gate, for
// phones that are too slow for 3D. Run it again only if you change the
// gate in js/scene3d.js. Needs Node.js with Playwright, and the page
// being served on your computer (see README):
//   node tools/render-gate.js http://localhost:8000
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
(async () => {
  const base = process.argv[2] || 'http://localhost:8000';
  const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const p = await b.newPage({ viewport: { width: 720, height: 1280 } });
  p.on('pageerror', (e) => console.log('error:', e.message));
  await p.goto(base + '/tools/capture.html');
  await p.waitForFunction(() => window.pictures, null, { timeout: 120000 });
  const pics = await p.evaluate(() => window.pictures);
  for (const k of ['closed', 'open']) {
    const file = path.join(__dirname, '..', 'img', `gate-${k}.jpg`);
    fs.writeFileSync(file, Buffer.from(pics[k].split(',')[1], 'base64'));
    console.log('wrote', file, Math.round(fs.statSync(file).size / 1024) + ' KB');
  }
  await b.close();
})();
