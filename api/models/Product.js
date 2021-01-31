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
    },

    quantity: {
      type: "number",
      required: true,
    },

    price: {
      type: "number",
      required: true,
    },
    /*
    subCategory: {
      type: "json",
      columnType: "array",
    },
*/
    image: {
      type: "json",
      columnType: "array",
    },

    size: {
      type: "string",
    },

    category: {
      model: "category",
    },
  },
};
