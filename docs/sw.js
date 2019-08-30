let cacheName = `restaurant-app-jen823-v2`;
let oldCacheName = `restaurant-app-jen823-v1`
let domain = (url) => url.split(`/`)[2];

self.addEventListener(`install`, event => {
  // Preload the styling, main pages, and main functionality
  let cacheURLS = [
    `/Restaurant-App/`,
    `/Restaurant-App/index.html`,
    `/Restaurant-App/restaurant.html`,
    `/Restaurant-App/js/dbhelper.js`,
    `/Restaurant-App/js/main.js`,
    `/Restaurant-App/js/restaurant_info.js`,
    `/Restaurant-App/controller.js`,
    `https://unpkg.com/leaflet@1.3.1/dist/leaflet.js`,
    `https://fonts.googleapis.com/css?family=Roboto|Lobster&display=swap`,
    `/Restaurant-App/css/styles.css`,
    `/Restaurant-App/css/restaurant_details.css`,
    `https://unpkg.com/leaflet@1.3.1/dist/leaflet.css`,
  ];
  event.waitUntil(
    caches.open(cacheName).then(cache => {
      cache.addAll(cacheURLS).catch(error => console.log(`Service worker initialization error\n`, error))
    })
  );
})

self.addEventListener(`activate`, event => caches.delete(oldCacheName));

self.addEventListener(`fetch`, event => {

  var requestURL = new URL(event.request.url);

  if (requestURL.pathname == `/Restaurant-App/`) event.respondWith(caches.match(`/Restaurant-App/`));
  else if (requestURL.pathname == `/Restaurant-App/restaurant.html`) event.respondWith(caches.match(`/Restaurant-App/restaurant.html`))
  else if (requestURL.pathname.includes(`browser-sync`)); // do not cache anything with browser sync
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

self.addEventListener(`message`, event => {

  if(event.data.action == 'skipWaiting') {
    console.log(`reloading!`)
    self.skipWaiting();
  } else {console.log('NO REFRESH MESSAGE')}
})
////////////////
self.addEventListener(`message`, function(event) {
  if (event.data.action == "skipWaiting") self.skipWaiting();
})
