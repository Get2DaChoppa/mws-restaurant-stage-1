(function() {
  'use strict';

//-----Cache the application shell-----//

    var filesToCache = [
        '/../.',
        '/../css/styles.css',
        '/../img/1.jpg',
        '/../img/2.jpg',
        '/../img/3.jpg',
        '/../img/4.jpg',
        '/../img/5.jpg',
        '/../img/6.jpg',
        '/../img/7.jpg',
        '/../img/8.jpg',
        '/../img/9.jpg',
        '/../index.html',
        '/../restaurant.html',
        '/../data/restaurants.json'
    ];


    var staticCacheName = 'mws-restaurant-v1';

    self.addEventListener('install', function(event) {
        console.log('Attempting to install service worker and cache static assets');
        event.waitUntil(
            caches.open(staticCacheName)
                .then(function(cache) {
                    return cache.addAll(filesToCache);
            })
        );
    });

//-----Serve files from the cache-----//

    self.addEventListener('fetch', function(event) {
        event.respondWith(
            caches.match(event.request).then(function(response) {
                if (response) return response;
                return fetch(event.request);
            })
        );
    });

//-----Update the static cache-----//
    self.addEventListener('activate', function(event) {
        var cacheWhitelist = [staticCacheName];
        event.waitUntil(
            caches.keys().then(function(cacheNames) {
                return Promise.all(
                    cacheNames.map(function(cacheName) {
                        if (cacheWhitelist.indexOf(cacheName) === -1) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
        );
    });

})();