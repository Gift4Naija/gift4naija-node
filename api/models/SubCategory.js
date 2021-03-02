/**
 * SubCategory.js
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

    //Assoc.
    category: {
      model: "category",
    },

    items: {
      collection: "product",
      via: "subCategory",
    },
  },
};
