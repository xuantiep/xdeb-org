/**
 * @file
 * PWA service worker
 * From http://www.pwabuilder.com/generator.
 */

'use strict';

// Set this to something unique.
var cachename = 'xdeb-org-offline';

// Install stage sets up the index page (home page) in the cache and opens a new cache.
self.addEventListener('install', function(event) {
  var indexPage = new Request('index.html');
  event.waitUntil(
    fetch(indexPage).then(function(response) {
      return caches.open(cachename).then(function(cache) {
        return cache.put(indexPage, response);
      });
  }));
});

// If any fetch fails, it will look for the request in the cache and serve it from there first.
self.addEventListener('fetch', function(event) {
  var updateCache = function(request) {
    return caches.open(cachename).then(function (cache) {
      return fetch(request).then(function (response) {
        return cache.put(request, response);
      });
    });
  };

  event.waitUntil(updateCache(event.request));

  event.respondWith(
    fetch(event.request).catch(function(error) {
      // Check to see if you have it in the cache.
      // Return response.
      // If not in the cache, then return error page.
      return caches.open(cachename).then(function (cache) {
        return cache.match(event.request).then(function (matching) {
          var report = !matching || matching.status == 404?Promise.reject('no-match'): matching;
          return report
        });
      });
    })
  );
})
