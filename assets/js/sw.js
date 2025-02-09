const CACHE_VERSION = '2';
const CACHE_NAME = `orbiting-cache-v${CACHE_VERSION}`;

// Assets that should always be cached
const PRECACHE_ASSETS = [
  '/',
  '/css/orbiting.css',
  '/js/orbiting.js',
  '/manifest.json',
  '/imgs/logo/orbiting-icon-192x192.png'
];

// Assets that should be cached as they're used
const DYNAMIC_CACHE = 'orbiting-dynamic-v1';

// Maximum number of items in dynamic cache
const DYNAMIC_CACHE_LIMIT = 50;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});


self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      // Clean up old cache versions
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME && cacheName !== DYNAMIC_CACHE) {
              console.log('[ServiceWorker] Removing old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Clean up oversized dynamic cache
      caches.open(DYNAMIC_CACHE).then(cache => {
        return cache.keys().then(keys => {
          if (keys.length > DYNAMIC_CACHE_LIMIT) {
            return Promise.all(
              keys.slice(0, keys.length - DYNAMIC_CACHE_LIMIT).map(key => {
                return cache.delete(key);
              })
            );
          }
        });
      }),
      // Claim clients
      self.clients.claim()
    ])
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Return cached response if found
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request)
          .then(response => {
            // Don't cache if not a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            // Determine which cache to use
            const cacheKey = PRECACHE_ASSETS.includes(event.request.url) 
              ? CACHE_NAME 
              : DYNAMIC_CACHE;

            // Store in appropriate cache
            caches.open(cacheKey)
              .then(cache => {
                cache.put(event.request, responseToCache);
              })
              .catch(err => {
                console.error('[ServiceWorker] Cache write failed:', err);
              });

            return response;
          })
          .catch(err => {
            console.error('[ServiceWorker] Fetch failed:', err);
            // Return a custom offline page/response here if needed
            return new Response('Offline content here');
          });
      })
  );
});

// Handle push notifications
self.addEventListener('push', (event) => {
  const title = 'Orbiting';
  const options = {
    body: event.data.text(),
    icon: '/imgs/logo/orbiting-icon-192x192.png',
    badge: '/imgs/logo/orbiting-icon-192x192.png'
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.openWindow('https://orbiting.com')
  );
});
