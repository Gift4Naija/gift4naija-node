/**
 * CartItem.js
 *
 * @description :: A model definition represents a database table/collection.
 * Only quantity can be updated by user
 * amount is calculated in controller
 */

module.exports = {
  attributes: {
    quantity: {
      type: "number",
      defaultsTo: 1,
    },

    // cartItem total amount
    // quantity * item.price
    amount: {
      type: "number",
      required: true,
    },

    item: {
      // one way association
      model: "product",
    },

    owner: {
      model: "user",
    },
  },
};
