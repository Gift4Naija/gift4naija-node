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
      data: cartItemJsonData,
    });
  },

  update: async (req, res) => {
    const cartItemUpdate = await CartItem.updateOne({ id: req.params.id }).set(
      req.body
    );

    if (!cartItemUpdate) {
      return res.status(402).json({ success: false, msg: "Bad Request" });
    }

    return res.json({
      success: true,
      data: cartItemUpdate,
      msg: "Successfully updated a cart item",
    });
  },

  remove: async (req, res) => {
    const removedCartItem = await CartItem.destroyOne({ id: req.params.id });

    if (!removedCartItem) {
      return res.status(402).json({ success: false, msg: "Bad Request" });
    }

    return res.json({
      success: true,
      data: removedCartItem,
      msg: "Successfully removed a cart item",
    });
  },

  create: async (req, res) => {
    const newCartItem = await CartItem.create(req.body).fetch();

    if (!newCartItem) {
      return res.status(402).json({ success: false, msg: "Bad Request" });
    }

    return res.status(201).json({
      success: true,
      data: newCartItem,
      msg: "Successfully created a cart item",
    });
  },
};
