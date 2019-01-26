/**
* User.js
*
* @description :: A model definition represents a database table/collection.
* @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
*/

var md5 = require('MD5');

module.exports = {
    attributes: {
        email: {
            type: 'string',
            required: true,
            unique: true
        },
        password: {
            type: 'string',
            required: true
        },
        password: {
            type: 'string',
            required: true
        }
    },
    customToJSON: function() {
        return _.omit(this, ['password'])
    },
    beforeCreate: function(user, cb) {
        user.password = md5(user.password);
        cb();
    }
 };
