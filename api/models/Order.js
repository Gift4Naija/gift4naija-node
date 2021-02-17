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
      isIn: [
        "pending", // pending => not paid
        "processing", // processing => paid, delivery in progress
        "cancelled", // cancelled => cancel or aborted
        "completed", // completed => payment and delivery completed
      ],
      defaultsTo: "pending",
    },

    items: {
      type: "json",
      // columnType: "array",
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
