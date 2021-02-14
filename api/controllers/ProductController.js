/**
 * ProductController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const path = require("path");

module.exports = {
  getAll: async (req, res) => {
    const allProducts = await Product.find().populate("category");
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

  removeProductImage: async (req, res) => {
    const { id } = req.params;
    const { image } = req.body;
    const productData = await Product.findOne().where({ id: id });

    if (!productData) {
      return res.badRequest(undefined, "Invalid product update");
    }

    // remove image
    const fd = path.resolve(`assets/uploads/${image}`);
    const rmFile = await sails.rm(fd);

    // pluk removed image from array
    const newImages = productData.images;
    const index = newImages.indexOf(image);
    newImages.splice(index, 1);

    // update product with updated image array
    const newProduct = await Product.updateOne({ id: id })
      .set({ images: newImages })
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

  uploadProductImage: async (req, res) => {
    const queryID = req.params.id;
    const productData = await Product.findOne().where({ id: queryID });

    if (!productData) {
      return res.badRequest(
        undefined,
        "Upload to an invalid/non-existing product"
      );
    }

    if (productData.images && productData.images.length >= 6) {
      return res.badRequest(
        undefined,
        "The maximum number of 6 images has been uploaded"
      );
    }

    // check for image upload
    const uploadedFile = await sails.upload(req.file("image")).catch((err) =>
      res.status(500).json({
        status: false,
        error: err,
        msg: "An error occured while uploading image",
      })
    );

    if (uploadedFile.length <= 0) {
      return res.badRequest(undefined, "No file was uploaded");
    }

    // get base name of all files
    const filesBaseName = uploadedFile.map((file) => path.parse(file.fd).base);

    let productImages = productData.images;

    // check if product images is empty
    if (!productImages || productImages === null) {
      productImages = [];
    }

    // check for duplicate image names
    filesBaseName.forEach((item) => {
      if (productImages.includes(item)) {
        return;
      }
      productImages.push(item);
    });

    // update product with new images array
    const productUpdate = await Product.updateOne({ id: productData.id })
      .set({ images: productImages })
      // catch update error
      .catch((err) =>
        res.status(500).json({
          status: false,
          error: err,
          msg: "An error occured while uploading image",
        })
      ); // 500

    return res.json({
      success: true,
      data: productUpdate,
      msg: "Successfully uploaded product image(s)",
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
