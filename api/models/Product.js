/**
* Product.js
*
* @description :: A model definition represents a database table/collection.
* @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
*/

module.exports = {
    attributes: {
        id: {
            type: 'string',
            required: true,
            unique: true
        },
        store: {
            type: 'string',
            required: true
        },
        category: {
            type: 'string',
            required: true
        },
        description: {
            type: 'string',
            required: true
        },
        url: {
            type: 'string',
            required: true
        },
        imageFilename: {
            type: 'string',
            required: true
        },
        imageFilenameP: {
            type: 'string',
            required: true
        },
        imageUrl: {
            type: 'string',
            required: true
        },
        price: {
            type: 'number',
            required: true
        },
        r1: {
            type: 'number',
            required: true
        },
        r2: {
            type: 'number',
            required: true
        },
        r3: {
            type: 'number',
            required: true
        },
        g1: {
            type: 'number',
            required: true
        },
        g2: {
            type: 'number',
            required: true
        },
        g3: {
            type: 'number',
            required: true
        },
        b1: {
            type: 'number',
            required: true
        },
        b2: {
            type: 'number',
            required: true
        },
        b3: {
            type: 'number',
            required: true
        }
    },
    // retrieves a random record from the database
    random: function(cb) {
        var self = this;
        this.count(function(err, num) {
            if(err)
            return cb(err, false);

            var randm = Math.floor((Math.random() * num));

            if(randm < 0) randm = 0;

            self.find({skip: randm, limit: 1}).exec(function(err, image) {
                return cb(err, image);
            });
        });

    }
};
