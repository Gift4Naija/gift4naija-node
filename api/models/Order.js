/**
 * Order.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    orderId: {
      type: "string",
      unique: true,
      required: true,
    },

    status: {
      type: "string",
      isIn: ["cancled", "pending", "complete"],
      defaultsTo: "pending",
    },

    items: {
      type: "json",
      columnType: "array",
    },

    buyer: {
      model: "user",
    },
  },
};
