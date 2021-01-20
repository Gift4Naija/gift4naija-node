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
    const newProduct = await Product.update(req.params.id, req.body).fetch();

    return res.json({ success: true, data: newProduct });
  },
  remove: async (req, res) => {},
  create: async (req, res) => {
    const newProduct = await Product.create(req.body).fetch();

    return res.status(201).json({ success: true, data: newProduct });
  },
};
