/**
 * CategoryController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  getAll: async (req, res) => {
    const { query } = req;

    if (!query.name) {
      query.name = "";
    }

    if (query.products === "on") {
      query.products = true;
    } else {
      query.products = false;
    }

    const search = {
      name: { contains: query.name },
    };

    const allCategories = await Category.find(search, {
      items: query.products,
    });

    return res.json({
      success: true,
      data: allCategories,
    });
  },

  getOne: async (req, res) => {
    const queryID = req.params.id;
    const { query } = req;

    if (query.products === "on") {
      query.products = true;
    } else {
      query.products = false;
    }

    const category = await Category.findOne(
      { where: { id: queryID } },
      {
        items: query.products,
      }
    );

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
      return res.badRequest(undefined, "Category does not exist");
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
      return res.badRequest(undefined, "Category does not exist");
    }

    return res.json({
      success: true,
      data: removedCategory,
      msg: "Successfully removed a category",
    });
  },

  create: async (req, res) => {
    const newCategory = await Category.create(req.body)
      .fetch()
      .catch((err) => res.badRequest(err));

    if (!newCategory) {
      return res.badRequest(); // use server error
    }

    return res.status(201).json({
      success: true,
      data: newCategory,
      msg: "Successfully created a category",
    });
  },
};
