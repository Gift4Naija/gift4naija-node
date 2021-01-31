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

  /*
   * {Number} userID
   * {Array} product - an array of product IDs
   */
  create: async (req, res) => {
    const { body } = req;
    // find products from array,
    const orderProducts = await Product.find({
      id: req.body.products,
    }).catch((err) => req.negotiate(err));

    body.items = orderProducts;

    const newOrder = await Order.create(body)
      .fetch()
      .catch((err) => req.negotiate(err));

    if (!newOrder) {
      return res.status(402).json({ success: false, msg: "Bad Request" });
    }

    return res.status(201).json({
      success: true,
      data: newOrder,
      msg: "Successfully created a product",
    });
  },

  update: async (req, res) => {
    const newOrder = await Order.updateOne({ id: req.params.id }).set(req.body);

    if (!newOrder) {
      return res.status(400).json({ success: false, msg: "Bad Request" });
    }

    return res.json({
      success: true,
      data: newOrder,
      msg: "Successfully updated a product",
    });
  },

  remove: async (req, res) => {
    const removedOrder = await Order.destroyOne({ id: req.params.id });

    if (!removedOrder) {
      return res.status(400).json({ success: false, msg: "Bad Request" });
    }

    return res.json({
      success: true,
      data: removedOrder,
      msg: "Successfully removed a product",
    });
  },
};
