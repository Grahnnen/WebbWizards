const CACHE_VERSION = 'v4';
const CACHE_NAME = `app-cache-${CACHE_VERSION}`;

const ASSETS = [
  '/index.html',
  '/css/style.css',
  '/js/app.js',
  '/offline.html'
];

// Install
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
    )
  );
  self.clients.claim();
});

// Fetch
self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  if (req.method !== 'GET') return;

  // Network-first for HTML navigation
  if (req.mode === 'navigate') {
    event.respondWith(networkFirstHTML(req));
    return;
  }

  // Network-first for same-origin assets (CSS/JS/images)
  if (url.origin === self.location.origin) {
    event.respondWith(networkFirstAsset(req));
    return;
  }
});

async function networkFirstHTML(req) {
  const cache = await caches.open(CACHE_NAME);

  try {
    const res = await fetch(req);

    if (res && res.ok) {
      cache.put(req, res.clone());
      return res;
    }

    const cached = await cache.match(req);
    return cached || (await cache.match('/offline.html')) || res;
  } catch {
    const cached = await cache.match(req);
    return cached || (await cache.match('/offline.html')) || new Response('Offline', { status: 503 });
  }
}

async function networkFirstAsset(req) {
  const cache = await caches.open(CACHE_NAME);

  try {
    const res = await fetch(req);
    if (res && res.ok) cache.put(req, res.clone());
    return res;
  } catch {
    const cached = await cache.match(req);
    return cached || new Response('Offline', { status: 503 });
  }
}
