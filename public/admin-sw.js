// Service Worker for OferteMutare Admin Dashboard PWA
// Scope: /admin/ only - does NOT affect the public site

const CACHE_NAME = "om-admin-v1";
const SHELL_ASSETS = [
  "/admin",
  "/android-chrome-192x192.webp",
  "/android-chrome-512x512.webp",
];

// Install: pre-cache the admin shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_ASSETS))
  );
  // Activate immediately without waiting for old SW to finish
  self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key.startsWith("om-admin-") && key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  // Claim all admin tabs immediately
  self.clients.claim();
});

// Fetch: network-first for API/data, cache-first for static assets
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET requests (POST, PUT, DELETE for API calls)
  if (event.request.method !== "GET") return;

  // Skip Firebase/external requests - let them pass through
  if (url.origin !== self.location.origin) return;

  // API routes: network-only (always fresh data)
  if (url.pathname.startsWith("/api/")) return;

  // Static assets (_next/static): cache-first (immutable hashed files)
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      caches.match(event.request).then(
        (cached) =>
          cached ||
          fetch(event.request).then((response) => {
            if (response.ok) {
              const clone = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
            }
            return response;
          })
      )
    );
    return;
  }

  // Admin pages: network-first with cache fallback (stale-while-revalidate)
  if (url.pathname.startsWith("/admin")) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }
});
