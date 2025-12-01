// Names for caches
const CACHE_VERSION = 'v1';
const APP_SHELL = 'app-shell-' + CACHE_VERSION;
const RUNTIME_CACHE = 'runtime-' + CACHE_VERSION;

// Core files you always want cached
const APP_SHELL_FILES = [
  '/',
  '/index.html',
  '/style.css',
  '/manifest.json'
];

// Install: Precache app shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(APP_SHELL).then(cache => cache.addAll(APP_SHELL_FILES))
  );
  self.skipWaiting();
});

// Activate: Clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== APP_SHELL && key !== RUNTIME_CACHE)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch handler
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);

  // 1️⃣ If request is inside /photos/ → cache images dynamically
  if (url.pathname.startsWith('/photos/')) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // 2️⃣ If request is inside /photoswipe/ → cache JS files dynamically
  if (url.pathname.startsWith('/photoswipe/')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // 3️⃣ Default behavior for app shell requests
  if (APP_SHELL_FILES.includes(url.pathname)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // 4️⃣ Everything else (e.g. external CDN assets)
  event.respondWith(networkFirst(request));
});

// ----- Cache Strategies -----

// Cache-first: best for images
async function cacheFirst(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  cache.put(request, response.clone());
  return response;
}

// Network-first: better for JS updates
async function networkFirst(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  try {
    const response = await fetch(request);
    cache.put(request, response.clone());
    return response;
  } catch {
    return cache.match(request);
  }
}
