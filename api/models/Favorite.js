/**
 * Favorite.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    productName: {
      type: "number",
    },

    product: {
      // one way association
      model: "product",
    },

    owner: {
      model: "user",
    },
  },
};
