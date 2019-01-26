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
        colors: {
            type: 'json',
            required: true
        }
    }
};
