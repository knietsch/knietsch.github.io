const version = "1.02",
    preCache = "PRECACHE-" + version,
    dynamicCache = "DYNAMIC-" + version,
    urlsToPrefetch  = [
      "/",
      "favicon.ico",
      "https://cdn.glitch.com/ab32e95c-829a-4087-a8b6-6fbec2987176%2Fandroid-icon-144x144.png?v=1600113438131",
      "https://cdn.glitch.com/ab32e95c-829a-4087-a8b6-6fbec2987176%2Fandroid-icon-72x72.png?v=1600112810528",
      "https://cdn.jsdelivr.net/npm/brython@3.8.10/brython.min.js",
      "https://cdn.jsdelivr.net/npm/brython@3.8.10/brython_stdlib.js"
    ];


self.addEventListener( "install", event => {
    self.skipWaiting();
    console.log( "installing precache files" );
    caches.open( preCache ).then( cache => {
        return cache.addAll( urlsToPrefetch.map(function(urlToPrefetch) {
           return new Request(urlToPrefetch, { mode: 'no-cors' });
        })).then(function() {
          console.log('All resources have been fetched and cached.');
        }); 

    } );

} );


self.addEventListener( "activate", event => {

    event.waitUntil(

        caches.keys().then( cacheNames => {
            cacheNames.forEach( value => {

                if ( value.indexOf( version ) < 0 ) {
                    caches.delete( value );
                }

            } );

            console.log( "service worker activated" );

            return;

        } )

    );

} );


self.addEventListener( "fetch", event => {

    event.respondWith(

        caches.match( event.request ).then( response => {

            if ( !response ) {

                //fall back to the network fetch
                return fetch( event.request )
                    .then( response => {

                        if ( response ) {

                            if ( event.request.url.indexOf( "manifest.json" ) === -1 ) {

                                let copy = response.clone();

                                caches.open( dynamicCache )
                                    .then( cache => {

                                        cache.put( event.request, copy );

                                    } );

                            }

                            return response;
                        }

                    } );

            }

            return response;

        } )

    )

} );