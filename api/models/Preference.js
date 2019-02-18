/**
 * Preference.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
      userId: {
          type: 'number',
          required: true
      },
      productId1: {
          type: 'string',
          required: true
      },
      productId2: {
          type: 'string',
          required: true
      },
      like: {
          type: 'boolean',
          required: true
      }
  }
};
