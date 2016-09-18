this.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('learn-memory').then(function(cache) {
      return cache.addAll([
        '/',
        '/stylesheets/styles.css',
        '/views/lessons-list.html',
        '/views/lessons-id.html',
        '/javascripts/scripts.js',
        '/langs/locale-en.json'
      ]);
    })
  );
});

this.addEventListener('fetch', function(event) {
  if (event.request.method !== 'GET' || /authenticated/.test(event.request.url)) {
    return;
  }
  event.respondWith(
    caches
      .match(event.request)
      .then(function(cached) {

        // Get the latest updates from API
        if (/api/.test(event.request.url)) {
          return fetch(event.request).then(function(response) {
            return caches.open('learn-memory').then(function(cache) {
              cache.put(event.request, response.clone());
              return response;
            });
          }).catch(function () {
            return cached;
          });
        }

        return cached;

      })
      .catch(function() {
        return fetch(event.request).then(function(response) {
          return caches.open('learn-memory').then(function(cache) {
            cache.put(event.request, response.clone());
            return response;
          });
        });
     })
  );
});
