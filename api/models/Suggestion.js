/**
 * Suggestion.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
      productId1: {
          type: 'string',
          required: true
      },
      productId2: {
          type: 'string',
          required: true
      },
      matches: {
          type: 'number',
          required: true
      }
  }
};
