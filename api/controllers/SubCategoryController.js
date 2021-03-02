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

    const allSubCategories = await SubCategory.find(search, {
      items: query.products,
    });

    if (query.products) {
      allSubCategories.forEach((sub) => {
        sub.total = sub.items.length;
      });
    }

    return res.json({
      success: true,
      data: allSubCategories,
      total: allSubCategories.length,
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

    const subCategory = await SubCategory.findOne(
      { where: { id: queryID } },
      {
        items: query.products,
      }
    );

    if (!subCategory) {
      return res.status(404).json({
        success: false,
        msg: "NotFound",
      });
    }

    if (query.products) {
      subCategory.total = subCategory.items.length;
    }

    return res.json({
      success: true,
      data: subCategory,
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

  // @params category
  // @body name
  create: async (req, res) => {
    const { category } = req.params;
    if (!category) {
      return res.badRequest(undefined, "Category is required");
    }

    const categoryFound = await Category.findOne({ where: { id: category } });

    if (!categoryFound) {
      return res.badRequest(undefined, "Invalid category");
    }

    // attach @params to body
    req.body.category = category;

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
