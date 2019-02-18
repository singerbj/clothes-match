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
    'POST /api/register': {controller: 'PassportController', action: 'register'},
    'POST /api/login': {controller: 'PassportController', action: 'login'},
    'POST /api/logout': {controller: 'PassportController', action: 'logout'},
    'GET  /api/session': {controller: 'UserController', action: 'session'},

    'GET  /api/products': {controller: 'ProductController', action: 'getAll'},
    'GET  /api/two_random_products': {controller: 'ProductController', action: 'getTwoRandom'},

    'GET  /api/preferences': {controller: 'PreferenceController', action: 'getAll'},
    'POST /api/preference': {controller: 'PreferenceController', action: 'savePreference'}
};
