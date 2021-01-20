/**
 * OrderController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  getAll: async (req, res) => {
    const allOrders = await Order.find();
    const ordersJsonData = await allOrders.map((user) => user.toJSON());

    return res.json({
      success: true,
      data: ordersJsonData,
    });
  },

  getOne: async (req, res) => {
    const queryID = req.params.id;
    const order = await Order.findOne().where({ id: queryID });

    if (!order) {
      return res.status(404).json({
        success: false,
        msg: "NotFound",
      });
    }

    const orderJsonData = order.toJSON();
    return res.json({
      success: true,
      data: orderJsonData,
    });
  },

  update: async (req, res) => {},
  remove: async (req, res) => {},
};
