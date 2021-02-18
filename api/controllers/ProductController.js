/**
 * ProductController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const path = require("path");

module.exports = {
  getAll: async (req, res) => {
    const { query } = req;

    if (!query.name) {
      query.name = ""; // product name
    }

    if (!query.size) {
      query.size = ""; // product size
    }

    if (!query.loc) {
      query.loc = ""; // product size
    }

    if (!query.category) {
      query.category = true; // category
    } else {
      const text = query.category;
      query.category = { name: { contains: text } };
    }

    const search = {
      name: { contains: query.name },
      size: { contains: query.size },
    };

    const allProducts = await Product.find(search, {
      category: query.category,
      vendor: true, // vendors location [ABJ, LAG, PH]
    });

    const filtedByLocation = allProducts.filter(({ vendor }) =>
      vendor.city.includes(query.loc.toLowerCase())
    );

    return res.json({
      success: true,
      data: filtedByLocation,
    });
  },

  getOne: async (req, res) => {
    const queryID = req.params.id;
    const productData = await Product.findOne(
      { id: queryID },
      {
        category: true,
        vendor: true,
      }
    );

    if (!productData) {
      return res.status(404).json({
        success: false,
        msg: "NotFound",
      });
    }

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
    const { me } = req;

    if (me.role === "vendor") {
      // vendors can only update products associated with them
      var newProduct = await Product.updateOne({
        id: req.params.id,
        vendor: me.id,
      })
        .set(req.body)
        .catch((err) => res.negotiate(err));
    } else if (me.role === "admin") {
      // vendors can update any product
      var newProduct = await Product.updateOne({ id: req.params.id })
        .set(req.body)
        .catch((err) => res.negotiate(err));
    }

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
    const { me } = req;

    if (me.role === "vendor") {
      // vendors can only remove products associated with them
      var removedProduct = await Product.destroyOne({
        id: req.params.id,
        vendor: me.id,
      }).catch((err) => res.negotiate(err));
    } else if (me.role === "admin") {
      // vendors can remove any product
      var removedProduct = await Product.destroyOne({
        id: req.params.id,
      }).catch((err) => res.negotiate(err));
    }

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
   * @vendorId - association for product vendor
   */
  create: async (req, res) => {
    // check if category is missing
    const { body, me } = req;
    if (!body.categoryId) {
      return res.badRequest(undefined, "Product category is required");
    }

    // parse categoryID as INT
    const categoryId = parseInt(body.categoryId);

    // find category
    const group = await Category.findOne().where({ id: categoryId }); // handle error

    // check if category exist
    if (!group) {
      return res.badRequest(undefined, "Invalid category");
    }

    // attach categoryID as category attribute
    body.category = categoryId;

    // attach vendor
    if (me.role === "vendor") {
      var vendorId = me.id;
    } else if (me.role === "admin") {
      var vendorId = body.vendorId;
    }

    body.vendor = parseInt(body.vendorId);

    // create new product with category
    const newProduct = await Product.create(body)
      .fetch()
      .catch((err) => res.negotiate(err));

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
