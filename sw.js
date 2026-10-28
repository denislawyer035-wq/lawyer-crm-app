// Service worker: хранит файлы приложения на телефоне, чтобы оно открывалось без сети.
// Данные пользователя здесь не хранятся – они в IndexedDB.
const VERSION = 'mvrxcryi'
const CACHE = 'lawyer-crm-' + VERSION
const ASSETS = ["./","./assets/index-CBLlPEHV.js","./assets/index-Dl2YSZOd.css","./manifest.webmanifest","./icon-192.png","./icon-512.png","./apple-touch-icon.png"]

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()))
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') self.skipWaiting()
})

self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return
  if (req.mode === 'navigate') {
    // Страница: сначала сеть (чтобы видеть обновления), без сети – из кэша.
    event.respondWith(fetch(req).catch(() => caches.match('./', { ignoreSearch: true })))
    return
  }
  event.respondWith(caches.match(req, { ignoreSearch: true }).then((hit) => hit || fetch(req)))
})
