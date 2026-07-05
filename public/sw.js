// Minimal hand-rolled service worker (replaces vite-plugin-pwa/workbox).
// - App shell precached so navigations work offline.
// - Hashed build assets + CDN Tailwind/fonts cached stale-while-revalidate.
// No build step, no Node/OS requirements.
const CACHE = 'deany-v3';
const SHELL = [
  '/', '/index.html', '/manifest.webmanifest',
  '/apple-touch-icon.png', '/favicon-64.png',
  '/pwa-192x192.png', '/pwa-512x512.png', '/pwa-maskable-512x512.png',
];

const CDN = [
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Navigations: network-first, fall back to the cached app shell offline.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(() => caches.match('/index.html').then((r) => r || caches.match('/')))
    );
    return;
  }

  // Same-origin assets and known CDNs: stale-while-revalidate.
  const sameOrigin = url.origin === self.location.origin;
  if (sameOrigin || CDN.includes(url.origin)) {
    event.respondWith(
      caches.open(CACHE).then((cache) =>
        cache.match(req).then((cached) => {
          const network = fetch(req)
            .then((res) => { if (res && res.status === 200) cache.put(req, res.clone()); return res; })
            .catch(() => cached);
          return cached || network;
        })
      )
    );
  }
});
