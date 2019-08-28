let cacheName = `restaurant-app-jen823-v2`;
let oldCacheName = `restaurant-app-jen823-v1`
let domain = (url) => url.split(`/`)[2];

self.addEventListener(`install`, event => {
  // Preload the styling, main pages, and main functionality
  let cacheURLS = [
    `${path}/`,
    `${path}/index.html`,
    `${path}/restaurant.html`,
    `${path}/js/dbhelper.js`,
    `${path}/js/main.js`,
    `${path}/js/restaurant_info.js`,
    `${path}/controller.js`,
    `${path}/settings.js`,
    `https://unpkg.com/leaflet@1.3.1/dist/leaflet.js`,
    `https://fonts.googleapis.com/css?family=Roboto|Lobster&display=swap`,
    `${path}/css/styles.css`,
    `${path}/css/restaurant_details.css`,
    `https://unpkg.com/leaflet@1.3.1/dist/leaflet.css`,
  ];
  event.waitUntil(
    caches.open(cacheName).then(cache =>
        cache.addAll(cacheURLS).catch(error => console.log(`Service worker initialization error\n`, error))
    )
  );
})

self.addEventListener(`activate`, event => caches.delete(oldCacheName));

self.addEventListener(`fetch`, function() {
  _path = path;
  return event => {

    var requestURL = new URL(event.request.url);

    if (requestURL.pathname == `${_path}/`) event.respondWith(caches.match(`${_path}/`));
    else if (requestURL.pathname == `${_path}/restaurant.html`) event.respondWith(caches.match(`${_path}/restaurant.html`))
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
  }
});

self.addEventListener(`message`, event => {
  if(event.data.refresh) self.skipWaiting();
})

self.addEventListener(`message`, function(event) {
  if (event.data.action == "skipWaiting") self.skipWaiting();
})
