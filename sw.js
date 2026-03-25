const CACHE_NAME = 'guaguatime-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/css/style.css',
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

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            );
        })
    );
});