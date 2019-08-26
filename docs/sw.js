let cacheName = `restaurant-app-jen823-v2`;
let oldCacheName = 'restaurant-app-jen823-v1'
let domain = (url) => url.split('/')[2];

self.addEventListener('install', event => {
  // Preload the styling, main pages, and main functionality
  let cacheURLS = [
    '/',
    '/index.html',
    'restaurant.html',
    'js/dbhelper.js',
    'js/main.js',
    'js/restaurant_info.js',
    '/controller.js',
    'https://unpkg.com/leaflet@1.3.1/dist/leaflet.js',
    'https://fonts.googleapis.com/css?family=Roboto|Lobster&display=swap',
    'css/styles.css',
    'css/restaurant_details.css',
    'https://unpkg.com/leaflet@1.3.1/dist/leaflet.css',
  ];
  event.waitUntil(
    caches.open(cacheName).then(cache =>
        cache.addAll(cacheURLS).catch(error => console.log('Service worker initialization error\n', error))
    )
  );
})

self.addEventListener('activate', event => caches.delete(oldCacheName));

self.addEventListener('fetch', event => {

  var requestURL = new URL(event.request.url);

  if (requestURL.pathname == '/') event.respondWith(caches.match('/'));
  else if (requestURL.pathname == '/restaurant.html') event.respondWith(caches.match('/restaurant.html'))
  else if (requestURL.pathname.includes('browser-sync')); // do not cache anything with browser sync
  else if (requestURL.hostname == self.location.hostname){ // cache anything on our this site
    event.respondWith(
      caches.match(event.request)                     // check if in cache
      .then(response => {
        if(response && response.ok) return response;  // if in cache, return
        else {                                        // else fetch from web, cache, then return
            return Promise.all([caches.open(cacheName), fetch(event.request.url)])
            .then( values => {
              [cache, response] = values;
              return cache.put(event.request.url, response.clone())
              .catch(err => console.log(err))
              .then( _ => response)
            })
        }})
    );
  }
});

self.addEventListener('message', event => {
  if(event.data.refresh) self.skipWaiting();
})

self.addEventListener('message', function(event) {
  if (event.data.action == "skipWaiting") self.skipWaiting();
})
