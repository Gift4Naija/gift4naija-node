/**
 * OrderController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  // for admin
  getAll: async (req, res) => {
    const allOrders = await Order.find().populate("sender");

    return res.json({
      success: true,
      data: allOrders,
    });
  },

  // for admin
  getOne: async (req, res) => {
    const queryID = parseInt(req.params.id);
    const order = await Order.findOne()
      .where({ id: queryID })
      .populate("sender");

    if (!order) {
      return res.status(404).json({
        success: false,
        errorType: "NotFound",
        msg: "Not Found",
      });
    }

    return res.json({
      success: true,
      data: order,
    });
  },

  // for users
  getUserAll: async (req, res) => {
    const order = await Order.findOne().where({
      sender: req.me.id,
    });

    return res.json({
      success: true,
      data: order,
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

    return res.json({
      success: true,
      data: order,
    });
  },

  // for user
  // get preview of order from cart
  preview: async (req, res) => {
    const body = {};
    body.status = "pending";

    // get products from user cart,
    const orderCartItem = await CartItem.find({
      owner: req.me.id,
    })
      .populate("item")
      .catch((err) => res.negotiate(err));

    // check for items in cart
    if (orderCartItem.length <= 0) {
      return res.badRequest(undefined, "No item in cart");
    }

    // extract items from cart with quantity and amount property
    const orderProducts = orderCartItem.map((cart) => {
      const { item } = cart;
      item.quantity = cart.quantity;
      item.amount = cart.amount;
      return item;
    });

    // calculate order total amount
    const amount = orderCartItem.reduce((a, b) => a + b.amount, 0);

    // generate order id
    body.orderId = await sails.helpers.genOrderId();
    body.items = orderProducts;
    body.sender = req.me.id;
    body.amount = amount;

    return res.status(201).json({
      success: true,
      data: body,
      msg: "Order preview",
    });
  },

  /*
   *
   */
  create: async (req, res) => {
    const { body } = req;
    const { me: user } = req;

    // get products from user cart,
    const orderCartItem = await CartItem.find({
      owner: req.me.id,
    })
      .populate("item")
      .catch((err) => res.negotiate(err));

    // check for items in cart
    if (orderCartItem.length <= 0) {
      return res.badRequest(undefined, "No item in cart");
    }

    // extract items from cart with quantity and amount property
    const orderProducts = orderCartItem.map((cart) => {
      const { item } = cart;
      item.quantity = cart.quantity;
      item.amount = cart.amount;
      return item;
    });

    // calculate order total amount
    const amount = orderCartItem.reduce((a, b) => a + b.amount, 0);

    /*
     * set order properties
     * @orderId
     * @items
     * @sender
     * @amount
     */
    body.orderId = await sails.helpers.genOrderId(); // generate order id
    body.items = orderProducts;
    body.sender = req.me.id;
    body.amount = amount;

    /*
     * validate receivers information
     * @email
     * @phone number
     * @fullname
     * @state
     * @city
     */
    const { email, phoneNumber, fullname, state, city } = body;

    if (!(email && phoneNumber && fullname && state && city)) {
      return res.badRequest(undefined, "Receivers information is required");
    }

    body.receiver = { email, phoneNumber, fullname, state, city };

    /*
     * process payment
     * @payerId => @payer_id
     * @paymentId
     */
    const { paymentId, payerId: payer_id } = body;
    const paymentJson = {
      payer_id,
      transactions: [
        {
          amount: {
            currency: "USD",
            total: amount,
          },
        },
      ],
    };

    const payment = await PaymentService.execute(paymentJson, paymentId).catch(
      (err) => {
        console.log(err);
        return res.negotiate(err);
      }
    );

    body.status = "processing";

    const newOrder = await Order.create(body)
      .fetch()
      .catch((err) => res.negotiate(err));

    if (!newOrder) {
      return res.badRequest(undefined, "You cannot order from an empty cart");
    }

    // empty user cart
    const itemsToRemove = orderProducts.map(({ id }) => id);
    await CartItem.destroy({ owner: user.id }).catch((err) =>
      res.negotiate(err)
    );

    await EmailService({
      to: user.emailAddress,
      subject: "Order confirmation",
      text: `Order confirmation - Dear ${user.fullName} order id ${newOrder.orderId}`,
    }).catch((err) => console.log(err));

    return res.status(201).json({
      success: true,
      data: newOrder,
      msg: "Successfully created an order",
    });
  },

  updateStatus: async (req, res) => {
    const { status } = req.body;
    const newOrder = await Order.updateOne({
      id: req.params.id,
      // sender: req.me.id,
    }).set({ status: status });

    if (!newOrder) {
      return res.status(400).json({ success: false, msg: "Bad Request" });
    }

    return res.json({
      success: true,
      data: newOrder,
      msg: "Successfully updated order status",
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
