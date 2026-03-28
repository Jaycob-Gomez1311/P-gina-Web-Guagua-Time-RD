const CACHE_NAME = 'guaguatime-v4';

const urlsToCache = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/js/main.js',
    '/js/dataLoader.js',
    '/js/routeCalculator.js',
    '/js/ui.js',
    '/js/storage.js',
    '/js/i18n.js',
    '/js/map.js',
    '/js/debounce.js',
    '/data/sectors.json',
    '/data/routes.json',
    '/data/conditions.json',
    '/data/translations.json',
    '/manifest.json'
];

// 🚀 INSTALL (forzar nueva versión)
self.addEventListener('install', event => {
    self.skipWaiting(); // importante

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
});

// 🚀 ACTIVATE (limpiar viejo cache)
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.map(key => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        }).then(() => self.clients.claim()) // importante
    );
});

// 🚀 FETCH (estrategia inteligente)
self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request)
            .then(response => {
                // Guarda copia en cache
                const responseClone = response.clone();
                caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, responseClone);
                });
                return response;
            })
            .catch(() => {
                // Si no hay internet → usa cache
                return caches.match(event.request);
            })
    );
});
