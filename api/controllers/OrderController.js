/**
 * OrderController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  // for admin
  getAll: async (req, res) => {
    const allOrders = await Order.find();

    return res.json({
      success: true,
      data: allOrders,
    });
  },

  // for admin
  getOne: async (req, res) => {
    const queryID = req.params.id;
    const order = await Order.findOne().where({ id: queryID });

    if (!order) {
      return res.status(404).json({
        success: false,
        errorType: "NotFound",
        msg: "Not Found",
      });
    }

    const orderJsonData = order.toJSON();
    return res.json({
      success: true,
      data: orderJsonData,
    });
  },

  // for users
  getUserAll: async (req, res) => {
    const queryID = req.params.id;
    const order = await Order.findOne().where({
      sender: req.me.id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        errorType: "NotFound",
        msg: "Not Found",
      });
    }

    const orderJsonData = order.toJSON();
    return res.json({
      success: true,
      data: orderJsonData,
    });
  },

  // for users
  getUserOne: async (req, res) => {
    const queryID = req.params.id;
    const order = await Order.findOne().where({
      id: queryID,
      sender: req.me.id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        errorType: "NotFound",
        msg: "Not Found",
      });
    }

    const orderJsonData = order.toJSON();
    return res.json({
      success: true,
      data: orderJsonData,
    });
  },

  /*
   *
   */
  create: async (req, res) => {
    const { body } = req;

    // get products from user cart,
    const orderCartItem = await CartItem.find({
      owner: req.me.id,
    })
      .populate("item")
      .catch((err) => res.negotiate(err));

    const orderProducts = orderCartItem.map(({ item }) => item);

    const amount = orderProducts.reduce((a, b) => {
      return a + b.price;
    }, 0);
    // generate order id
    body.orderId = await sails.helpers.genOrderId();
    body.items = orderProducts;
    body.sender = req.me.id;
    body.amount = amount;

    // validate receivers information

    const newOrder = await Order.create(body)
      .fetch()
      .catch((err) => res.negotiate(err));

    if (!newOrder) {
      return res.badRequest();
    }

    // empty user cart
    const itemsToRemove = orderProducts.map(({ id }) => id);
    await CartItem.destroy({ id: { in: itemsToRemove } }).catch((err) =>
      res.negotiate(err)
    );

    return res.status(201).json({
      success: true,
      data: newOrder,
      msg: "Successfully created an order",
    });
  },

  update: async (req, res) => {
    const newOrder = await Order.updateOne({
      id: req.params.id,
      sender: req.me.id,
    }).set(req.body);

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
    const removedOrder = await Order.destroyOne({
      id: req.params.id,
      sender: req.me.id,
    });

    if (!removedOrder) {
      return res.status(400).json({ success: false, msg: "Bad Request" });
    }

    return res.json({
      success: true,
      data: removedOrder,
      msg: "Successfully removed an order",
    });
  },
};
