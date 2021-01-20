/**
 * CartItem.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    // cart total amount
    totalAmount: {
      type: "number",
    },

    item: {
      collection: "product",
    },

    owner: {
      model: "user",
    },
  },
};
