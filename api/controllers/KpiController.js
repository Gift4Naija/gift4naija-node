/**
 * KpiController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  getAll: async (req, res) => {
    const { query } = req;

    /*if (!query.name) {
      query.name = "";
    }

    if (query.products === "on") {
      query.products = true;
    } else {
      query.products = false;
    }*/

    const search = {
      // name: { contains: query.name },
    };

    const allKpis = await Kpi.find(search, {
      owner: true,
    });

    /*    if (query.products) {
      allKpis.forEach((category) => {
        category.total = category.items.length;
      });
    }*/

    return res.json({
      success: true,
      data: allKpis,
    });
  },

  //  not yet in use
  getOne: async (req, res) => {
    const queryID = req.params.id;
    const kpi = await Kpi.findOne(
      {
        id: queryID,
        // owner: req.me.id,
      },
      { owner: true }
    );

    if (!kpi) {
      return res.notFound();
    }

    return res.json({
      success: true,
      data: kpi,
    });
  },

  /*
   * productId - req.body.product
   * quantity - req.body.quantity
   * userId - req.me.id
   */
  create: async (req, res) => {
    /*    // grab <productId> and <quantity>
    const { product: productId, quantity } = req.body;
    // grab <userId>
    const userId = req.me.id;

    // get user cart with items
    let cartItemArray = await CartItem.find()
      .where({ owner: userId })
      .populate("item");

    // check if <product> already exist in cart
    // by matching <item> to productID
    cartItemArray = cartItemArray.filter(({ item }) => {
      return item.id === parseInt(productId);
    });

    if (cartItemArray.length >= 1) {
      return res.badRequest(undefined, "Item already in cart");
    }

    // find product
    const _product = await Product.findOne(productId);

    // check if product exist in DB
    if (!_product) {
      return res.badRequest(undefined, "Invalid Item");
    }

    // check if product exist in DB
    if (!quantity) {
      return res.badRequest(undefined, "Quantity must be specified");
    }

    // calculate price
    const amount = parseFloat(quantity * _product.price);

    // check if amount is valid
    if (!amount) {
      return res.badRequest();
    }

    // set cartItem <owner> and cartItem <item>
    const data = { owner: userId, item: productId, amount, quantity };

    // create cart-item
    const newCartItem = await CartItem.create(data)
      .fetch()
      .catch((err) => res.badRequest(err));

    if (!newCartItem) {
      return res.badRequest();
    }

    return res.status(201).json({
      success: true,
      data: newCartItem,
      msg: "Successfully created a cart item",
    });*/
  },

  update: async (req, res) => {
    /*const { quantity } = req.body;
    const { id } = req.params;

    // find cartItem with product and recalculate amount
    const cartItem = await CartItem.findOne()
      .where({ id: id, owner: req.me.id })
      .populate("item");

    // check if cartItem exist in DB
    if (!cartItem) {
      return res.badRequest();
    }

    const amount = parseFloat(quantity * cartItem.price);

    const cartItemUpdate = await CartItem.updateOne({ id })
      .set({ quantity, amount })
      .catch((err) => res.badRequest(err));

    if (!cartItemUpdate) {
      return res.badRequest();
    }

    return res.json({
      success: true,
      data: cartItemUpdate,
      msg: "Successfully updated a cart item",
    });*/
  },

  remove: async (req, res) => {
    /*const removedCartItem = await CartItem.destroyOne({
      id: req.params.id,
      owner: req.me.id,
    }).catch((err) => res.badRequest(err));

    if (!removedCartItem) {
      return res.badRequest();
    }

    return res.json({
      success: true,
      data: removedCartItem,
      msg: "Successfully removed a cart item",
    });*/
  },
};
