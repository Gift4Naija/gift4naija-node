/**
 * ProductController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  getAll: async (req, res) => {
    const allProducts = await Product.find();
    // const productsJsonData = await allProducts.map((goods) => goods.toJSON());

    return res.json({
      success: true,
      data: allProducts,
    });
  },

  getOne: async (req, res) => {
    const queryID = req.params.id;
    const productData = await Product.findOne().where({ id: queryID });

    if (!productData) {
      return res.status(404).json({
        success: false,
        msg: "NotFound",
      });
    }

    // const productJsonData = productData.toJSON();
    return res.json({
      success: true,
      data: productData,
    });
  },

  update: async (req, res) => {
    const newProduct = await Product.updateOne({ id: req.params.id })
      .set(req.body)
      .catch((err) => res.badRequest(err));

    if (!newProduct) {
      return res.badRequest();
    }

    return res.json({
      success: true,
      data: newProduct,
      msg: "Successfully updated a product",
    });
  },

  remove: async (req, res) => {
    const removedProduct = await Product.destroyOne({
      id: req.params.id,
    }).catch((err) => res.badRequest(err));

    if (!removedProduct) {
      return res.badRequest();
    }

    return res.json({
      success: true,
      data: removedProduct,
      msg: "Successfully removed a product",
    });
  },

  /*
   * @categoryId - association for product category
   */
  create: async (req, res) => {
    // check if category is missing
    if (!req.body.categoryId) {
      return res.badRequest(undefined, "Product category is required");
    }

    // parse categoryID as INT
    const categoryId = parseInt(req.body.categoryId);

    // attach categoryID as category attribute
    req.body.category = categoryId;

    // find category
    const group = await Category.findOne().where({ id: categoryId }); // handle error

    // check if category exist
    if (!group) {
      return res.badRequest(undefined, "Invalid category");
    }

    // create new product with category
    const newProduct = await Product.create(req.body)
      .fetch()
      .catch((err) => res.badRequest(err));

    // check for error
    if (!newProduct) {
      return res.badRequest();
    }

    // send success response
    return res.status(201).json({
      success: true,
      data: newProduct,
      msg: "Successfully created a product",
    });
  },
};
