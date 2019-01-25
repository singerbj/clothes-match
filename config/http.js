/**
* HTTP Server Settings
* (sails.config.http)
*
* Configuration for the underlying HTTP server in Sails.
* (for additional recommended settings, see `config/env/production.js`)
*
* For more information on configuration, check out:
* https://sailsjs.com/config/http
*/

module.exports.http = {

    /****************************************************************************
    *                                                                           *
    * Sails/Express middleware to run for every HTTP request.                   *
    * (Only applies to HTTP requests -- not virtual WebSocket requests.)        *
    *                                                                           *
    * https://sailsjs.com/documentation/concepts/middleware                     *
    *                                                                           *
    ****************************************************************************/

   middleware: {

       passportInit    : require('passport').initialize(),
       passportSession : require('passport').session(),

       order: [
            'cookieParser',
            'session',
            'passportInit',            // <==== If you're using "passport", you'll want to have its two
            'passportSession',         // <==== middleware functions run after "session".
            'bodyParser',
            'compress',
            'poweredBy',
            'router',
            'www',
            'favicon'
       ]
   }

};
