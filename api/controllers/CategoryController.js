/**
 * CategoryController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  getAll: async (req, res) => {
    const allCategories = await Category.find();
    // const cartItemsJsonData = await allCategories.map((user) => user.toJSON());

    return res.json({
      success: true,
      data: allCategories,
    });
  },

  getOne: async (req, res) => {
    const queryID = req.params.id;
    const category = await Category.findOne().where({ id: queryID });

    if (!category) {
      return res.status(404).json({
        success: false,
        msg: "NotFound",
      });
    }

    // const cartItemJsonData = cartItem.toJSON();
    return res.json({
      success: true,
      data: category,
    });
  },

  update: async (req, res) => {
    const categoryUpdate = await Category.updateOne({ id: req.params.id }).set(
      req.body
    );

    if (!categoryUpdate) {
      return res.status(402).json({ success: false, msg: "Bad Request" });
    }

    return res.json({
      success: true,
      data: categoryUpdate,
      msg: "Successfully updated a category",
    });
  },

  remove: async (req, res) => {
    const removedCategory = await Category.destroyOne({ id: req.params.id });

    if (!removedCategory) {
      return res.status(402).json({ success: false, msg: "Bad Request" });
    }

    return res.json({
      success: true,
      data: removedCategory,
      msg: "Successfully removed a category",
    });
  },

  create: async (req, res) => {
    const newCategory = await Category.create(req.body).fetch();

    if (!newCategory) {
      return res.status(402).json({ success: false, msg: "Bad Request" });
    }

    return res.status(201).json({
      success: true,
      data: newCategory,
      msg: "Successfully created a category",
    });
  },
};
