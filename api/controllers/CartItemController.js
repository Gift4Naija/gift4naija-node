/**
 * CartItemController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  getAll: async (req, res) => {
    const allCartItems = await CartItem.find();
    const cartItemsJsonData = await allCartItems.map((user) => user.toJSON());

    return res.json({
      success: true,
      data: cartItemsJsonData,
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

    const cartItemJsonData = cartItem.toJSON();
    return res.json({
      success: true,
      data: orderJsonData,
    });
  },

  update: async (req, res) => {},
  remove: async (req, res) => {},
};
