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
      isIn: ["cancled", "pending", "processing", "completed"],
      defaultsTo: "processing",
    },

    items: {
      type: "json",
      columnType: "array",
    },

    amount: {
      type: "number",
      required: true,
    },

    receiver: {
      // model: "user",
      type: "json",
    },

    // Assoc.
    sender: {
      model: "user",
    },
  },
};
