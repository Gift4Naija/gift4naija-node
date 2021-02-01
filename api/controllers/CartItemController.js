/**
 * CartItemController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  getAll: async (req, res) => {
    const allCartItems = await CartItem.find({
      owner: req.me.id,
    }); /*.populate(
      "item"
    )*/
    const productIds = allCartItems.map(({ item }) => item);

    const products = await Product.find({ id: productIds }).populate(
      "category"
    );

    const itemsWithCategory = allCartItems.map((cartItem) => {
      const cartProduct = products.find((elt) => elt.id === cartItem.item);
      // slice out cartProduct for optimization

      cartItem.item = cartProduct;
      return cartItem;
    });

    return res.json({
      success: true,
      data: itemsWithCategory,
    });
  },

  //  not yet in use
  getOne: async (req, res) => {
    const queryID = req.params.id;
    const cartItem = await CartItem.findOne().where({ id: queryID });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        msg: "NotFound",
      });
    }

    // const cartItemJsonData = cartItem.toJSON();
    return res.json({
      success: true,
      data: cartItem,
    });
  },

  /*
   * productId - req.body.product
   * userId - req.user.id
   */
  create: async (req, res) => {
    const productId = req.body.product;
    const userId = req.me.id;
    const data = { owner: userId, item: productId };

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
    });
  },

  update: async (req, res) => {
    const cartItemUpdate = await CartItem.updateOne({ id: req.params.id })
      .set(req.body)
      .catch((err) => res.badRequest(err));

    if (!cartItemUpdate) {
      return res.badRequest();
    }

    return res.json({
      success: true,
      data: cartItemUpdate,
      msg: "Successfully updated a cart item",
    });
  },

  remove: async (req, res) => {
    const removedCartItem = await CartItem.destroyOne({
      id: req.params.id,
    }).catch((err) => res.badRequest(err));

    if (!removedCartItem) {
      return res.badRequest();
    }

    return res.json({
      success: true,
      data: removedCartItem,
      msg: "Successfully removed a cart item",
    });
  },
};
