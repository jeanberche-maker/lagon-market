/* Lagon Market — service worker (offline friendly, catalogue toujours frais)
   Règle spéciale Lot 9 : products.json est network-first — la donnée produits
   ne peut pas rester figée dans le cache ; le cache n'est qu'un secours hors-ligne. */
const CACHE = 'lagon-v10';
const ASSETS = ['./', './index.html', './admin.html', './manifest.json', './icons/icon-192.png', './icons/icon-512.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;

  /* products.json : réseau d'abord → cache en secours (données fraîches) */
  if (url.pathname.endsWith('products.json')) {
    e.respondWith(
      fetch(e.request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy));
          return res;
        })
        .catch(() => caches.match(e.request))
    );
    return;
  }

  /* Tuiles OpenStreetMap (Lot 11) : cache-first borné à ~80 tuiles */
  if (url.hostname === 'tile.openstreetmap.org') {
    e.respondWith(
      caches.match(e.request).then((hit) => {
        if (hit) return hit;
        return fetch(e.request).then((res) => {
          const copy = res.clone();
          caches.open('lagon-tiles').then((c) => {
            c.put(e.request, copy);
            c.keys().then((keys) => {
              const over = keys.length - 80;
              for (let i = 0; i < over; i++) c.delete(keys[i]);
            });
          });
          return res;
        });
      })
    );
    return;
  }

  /* Pages HTML (index/admin) : stale-while-revalidate — réponse instantanée du
     cache, mise à jour silencieuse en arrière-plan (l'app se met à jour seule). */
  if (e.request.mode === 'navigate' || url.pathname.endsWith('.html')) {
    e.respondWith(
      caches.match(e.request).then((hit) => {
        const net = fetch(e.request)
          .then((res) => {
            caches.open(CACHE).then((c) => c.put(e.request, res.clone()));
            return res;
          })
          .catch(() => hit);
        return hit || net;
      })
    );
    return;
  }

  /* le reste : cache-first (app shell immuable) */
  e.respondWith(
    caches.match(e.request).then(
      (hit) =>
        hit ||
        fetch(e.request)
          .then((res) => {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(e.request, copy));
            return res;
          })
          .catch(() => caches.match('./index.html'))
    )
  );
});
