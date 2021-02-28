/**
 * Product.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    name: {
      type: "string",
      required: true,
      // unique: true,
    },

    price: {
      type: "number",
      required: true,
    },

    images: {
      type: "json",
    },

    size: {
      type: "string",
    },

    discount: {
      type: "number",
      defaultsTo: 1, // value ranges from 0 - 1
    },

    description: {
      type: "string",
    },

    // Assoc.
    category: {
      model: "category",
    },

    subCategory: {
      model: "subCategory",
    },

    vendor: {
      model: "user",
    },
  },
};
