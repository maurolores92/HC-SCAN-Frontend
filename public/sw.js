// HelpCopies ERP - Progressive Web App Service Worker
const CACHE_NAME = 'helpcopies-pwa-v1';

// Recursos mínimos del cascarón de la app (App Shell)
const PRECACHE_ASSETS = [
  '/',
  '/manifest.json',
  '/images/pwa/icon-192x192.png',
  '/images/pwa/icon-512x512.png',
  '/images/pwa/apple-touch-icon.png',
];

// Instalación: precachea recursos estáticos mínimos y activa inmediatamente
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(PRECACHE_ASSETS).catch(err => {
        console.warn('[SW] Pre-caching asset error:', err);
      });
    })
  );
});

// Activación: limpia cachés antiguas y toma el control de los clientes abiertos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches
      .keys()
      .then(keys => {
        return Promise.all(
          keys.map(key => {
            if (key !== CACHE_NAME) {
              return caches.delete(key);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Interceptor de peticiones (Fetch)
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // 1. NUNCA interceptar ni cachear:
  // - Peticiones no GET (POST, PUT, DELETE, PATCH)
  // - Rutas de API (/api/, /socket.io/)
  // - Protocolos que no sean HTTP/HTTPS (extensiones de chrome, websockets)
  if (
    request.method !== 'GET' ||
    url.pathname.startsWith('/api') ||
    url.pathname.includes('/socket.io') ||
    !url.protocol.startsWith('http')
  ) {
    return; // Pasa directo a la red sin intervenir
  }

  // 2. Estrategia Network-First con fallback a caché para navegación y estáticos
  event.respondWith(
    fetch(request)
      .then(networkResponse => {
        // Si la respuesta de red es válida y es de nuestro mismo origen o CDN de fuentes/estáticos
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          (url.origin === self.location.origin ||
            url.hostname.includes('fonts.googleapis.com') ||
            url.hostname.includes('fonts.gstatic.com'))
        ) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(async () => {
        // Si falla la red (offline): intentar responder desde caché si ya existe
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
          return cachedResponse;
        }

        // Si es navegación HTML de página y no hay red, servir la raíz en caché si existe
        if (request.mode === 'navigate') {
          const rootCached = await caches.match('/');
          if (rootCached) return rootCached;
        }

        // Si no está en caché, la promesa rechaza y el navegador dispara el evento de error de red
        return new Response('Sin conexión a internet', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: new Headers({ 'Content-Type': 'text/plain; charset=utf-8' }),
        });
      })
  );
});

// ============================================================
// 3. Manejador de Notificaciones Push en Segundo Plano (Web Push)
// ============================================================
self.addEventListener('push', event => {
  let data = {
    title: 'HelpCopies ERP',
    body: 'Tienes una nueva notificación en el sistema',
    icon: '/images/pwa/icon-192x192.png',
    badge: '/images/pwa/icon-192x192.png',
    data: { url: '/' },
  };

  try {
    if (event.data) {
      const payload = event.data.json();
      data = { ...data, ...payload };
    }
  } catch (err) {
    if (event.data) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || '/images/pwa/icon-192x192.png',
    badge: data.badge || '/images/pwa/icon-192x192.png',
    vibrate: [200, 100, 200],
    data: data.data || { url: '/' },
    tag: data.tag || 'helpcopies-push',
    renotify: true,
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// ============================================================
// 4. Clic en Notificación Push (Enfoca o Abre la Aplicación)
// ============================================================
self.addEventListener('notificationclick', event => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then(clientList => {
        // Si hay una ventana abierta de HelpCopies, enfocar y navegar
        for (const client of clientList) {
          if ('focus' in client) {
            client.focus();
            if ('navigate' in client && targetUrl !== '/') {
              client.navigate(targetUrl);
            }
            return;
          }
        }
        // Si la aplicación o navegador estaban cerrados, abrir nueva ventana
        if (self.clients.openWindow) {
          return self.clients.openWindow(targetUrl);
        }
      })
  );
});
