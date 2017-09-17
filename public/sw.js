this.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('learn-memory-1505632133421').then(function(cache) {
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
  var get = function () {
    return fetch(event.request).then(function(response) {
      return caches.open('learn-memory').then(function(cache) {
        cache.put(event.request, response.clone());
        return response;
      });
    });
  };

  event.respondWith(
    caches
      .match(event.request)
      .then(function(cached) {
        // get the latest updates from API
        if (/api/.test(event.request.url)) {
          return get().catch(function () {
            return cached;
          });
        }

        // the cached value could be undefined
        if (typeof cached == 'undefined') {
      	  return get();
      	}

        return cached;
      })
      .catch(get)
  );
});

this.addEventListener('activate', function(event) {
  var cacheWhitelist = ['learn-memory-1505632133421'];

  event.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (cacheWhitelist.indexOf(key) === -1) {
          return caches.delete(key);
        }
      }));
    })
  );
});
