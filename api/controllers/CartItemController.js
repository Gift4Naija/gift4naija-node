/**
 * CartItemController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  getAll: async (req, res) => {
    const allCartItems = await CartItem.find();
    // const cartItemsJsonData = await allCartItems.map((user) => user.toJSON());

    return res.json({
      success: true,
      data: allCartItems,
    });
  },

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
    const userId = req.user.id;
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
