// Service Worker Implementation

const CACHE_NAME = 'v1';

/**
 * Saves a request / response pair in the cache
 */
async function cache(request, response) {
  if (response.type === "error" || response.type === "opaque") {
    return Promise.resolve(); // do not put in cache network errors
  }

  return caches
    .open(CACHE_NAME)
    .then(cache => cache.put(request, response.clone()));
}

/**
 * Sends the request over the network and caches the response
 */
async function update(request) {
  return fetch(request.url)
    .then(response => cache(request, response)
      .then(() => response)
    );
}

/**
 * Parses the response from the server (as JSON) and sends
 * a message to all clients saying what data as updated
 */
function refresh(response) {
  return response
    .json()
    .then(json => {
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          // report and send new data to the client
          client.postMessage(
            JSON.stringify({
              type: 'state-update',
              url: response.url,
              data: json
            })
          );
        });
      });

      return response.data;
    });
}

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([
        '/index.html',
        '/favicon.png',
        '/app.js',
        '/bundle.css'
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  if (event.request.url.includes("/api")) {
    // try the network first, to ensure we have the mostup-to-date data in the system
    event.respondWith(
      fetch(event.request)
        .then(response => cache(event.request, response).then(() => response))  // on success, put data in cache
        .catch(() => caches.match(event.request)));
      
    // response to API requests, cache-update-refresh strategy
    //event.respondWith(caches.match(event.request));
    //event.waitUntil(update(event.request).then(refresh));
  } else {
    event.respondWith(
      caches
        .match(event.request)   // check if the request has already been cached
        .then(cached => cached || fetch(event.request)) // either return cached response or fetch it
        .then(response => cache(event.request, response).then(() => response)) // put response in cache
    );
  }
});
