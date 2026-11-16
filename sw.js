// Service worker: keeps a copy of every file on the phone so the page
// opens without internet. It never sends anything anywhere.
// Change VERSION whenever you change any file, so phones fetch the new copy.
const VERSION = 'komera-v3';
const FILES = [
  './', 'index.html', 'css/style.css', 'manifest.webmanifest', 'icon.svg',
  'js/content.js', 'js/app.js', 'js/journey.js', 'js/games.js', 'js/music.js', 'js/scene3d.js',
  'vendor/three.module.min.js', 'img/gate-closed.jpg', 'img/gate-open.jpg', 'research/REPORT.md'
];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;   // links to studies go straight to the web
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then((hit) => hit || fetch(e.request)));
});
