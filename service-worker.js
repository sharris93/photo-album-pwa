self.addEventListener('install', e => e.waitUntil(
  caches.open('photo-widget').then(cache => cache.addAll([
    '/',
    '/index.html',
    '/style.css',
    '/app.js'
  ]))
));

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(resp => resp || fetch(e.request))
  );
});