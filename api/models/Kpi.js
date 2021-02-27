/**
 * Kpi.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    quantity: { type: "number" },
    price: { type: "string" },
    amount: { type: "string" },
    orderId: { type: "string" },
    category: { type: "string" },
    subCategory: { type: "string" },
    product: {
      type: "string",
    },
  },
};
