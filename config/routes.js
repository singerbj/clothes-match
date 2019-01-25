/**
* Route Mappings
* (sails.config.routes)
*
* Your routes tell Sails what to do each time it receives a request.
*
* For more information on configuring custom routes, check out:
* https://sailsjs.com/anatomy/config/routes-js
*/

module.exports.routes = {
    '/*': {
        controller: 'IndexController',
        action: 'render',
        skipAssets: true
    },
    'POST /register': {controller: 'PassportController', action: 'register'},
    'POST /login':    {controller: 'PassportController', action: 'login'},
    'POST /logout':  {controller: 'PassportController', action: 'logout'},
    'GET  /test':     {controller: 'UserController', action: 'session'},
    'GET  /session':     {controller: 'UserController', action: 'session'},

};
