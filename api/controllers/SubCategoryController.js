/**
 * SubCategoryController
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

    const allCategories = await SubCategory.find(search, {
      items: query.products,
    });

    if (query.products) {
      allCategories.forEach((category) => {
        category.total = category.items.length;
      });
    }

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

    const category = await SubCategory.findOne(
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

    if (query.products) {
      category.total = category.items.length;
    }

    // const cartItemJsonData = cartItem.toJSON();
    return res.json({
      success: true,
      data: category,
    });
  },

  update: async (req, res) => {
    const categoryUpdate = await SubCategory.updateOne({
      id: req.params.id,
    }).set(req.body);

    if (!categoryUpdate) {
      return res.badRequest(undefined, "Sub-category does not exist");
    }

    return res.json({
      success: true,
      data: categoryUpdate,
      msg: "Successfully updated a sub-category",
    });
  },

  remove: async (req, res) => {
    const removedCategory = await SubCategory.destroyOne({ id: req.params.id });

    if (!removedCategory) {
      return res.badRequest(undefined, "Sub-category does not exist");
    }

    return res.json({
      success: true,
      data: removedCategory,
      msg: "Successfully removed a sub-category",
    });
  },

  create: async (req, res) => {
    const { category } = req.body;

    if (!category) {
      return res.badRequest(undefined, "Category is required");
    }

    const categoryFound = await Category.findOne({ where: { id: category } });

    if (!categoryFound) {
      return res.badRequest(undefined, "Invalid category");
    }

    const newSubCategory = await SubCategory.create(req.body)
      .fetch()
      .catch((err) => res.badRequest(err));

    if (!newSubCategory) {
      return res.badRequest(); // use server error
    }

    return res.status(201).json({
      success: true,
      data: newSubCategory,
      msg: "Successfully created a category",
    });
  },
};
