const CACHE_NAME = "workpulse-v3";
const STATIC_ASSETS = [
  "/WorkPulse/",
  "/WorkPulse/index.html",
  "/WorkPulse/login.html",
  "/WorkPulse/dashboard.html",
  "/WorkPulse/company-admin.html",
  "/WorkPulse/super.html",
  "/WorkPulse/manifest.json",
  "/WorkPulse/js/auth.js",
  "/WorkPulse/js/config.js"
];

// Install — cache static assets
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS).catch(() => {});
    })
  );
  self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — network first, fallback to cache
self.addEventListener("fetch", event => {
  // Skip Supabase API calls — always network
  if (event.request.url.includes("supabase.co")) return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Cache successful GET responses
        if (event.request.method === "GET" && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
