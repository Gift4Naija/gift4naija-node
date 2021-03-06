/**
 * OrderController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  // for admin
  getAll: async (req, res) => {
    const { query } = req;

    if (!query.id) {
      query.id = "";
    }

    const search = {
      orderId: { contains: query.id },
    };

    const allOrders = await Order.find(search).populate("sender");

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
    const { query } = req;

    if (!query.id) {
      query.id = "";
    }

    const search = {
      orderId: { contains: query.id },
      sender: req.me.id,
    };
    const order = await Order.find(search);

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

  getClientToken: async (req, res) => {
    const clientToken = await sails.helpers
      .paymentGateway()
      .getClientToken(req.me ? req.me.id : 1);

    return res.json({
      success: true,
      data: clientToken,
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

    if (user.emailStatus !== "confirmed") {
      return res.badRequest(undefined, "User is not verified");
    }

    // get products from user cart,
    const orderCartItem = await CartItem.find({
      owner: user.id,
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
    body.sender = user.id;
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
    /*
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
          return res.negotiate(err);
        }
      );
    */

    const transactionResultObj = await sails.helpers
      .paymentGateway()
      .createTransaction(body.nonce, body.deviceData, body.amount, body.orderId)
      .catch((err) =>
        res.serverError(err, "An error occured while processing payment")
      );

    if (!transactionResultObj.success) {
      return res.serverError(
        undefined,
        "An error occured while processing payment"
      );
    }

    body.status = "processing";

    const newOrder = await Order.create(body)
      .fetch()
      .catch((err) => res.negotiate(err));

    if (!newOrder) {
      return res.serverError(
        undefined,
        "An error occured while creating order"
      );
    }

    // empty user cart
    // const itemsToRemove = orderProducts.map(({ id }) => id);
    await CartItem.destroy({ owner: user.id }).catch((err) =>
      res.negotiate(err)
    );

    const responseData = { order: newOrder, transaction: transactionResultObj };

    res.status(201).json({
      success: true,
      data: responseData,
      msg: "Successfully created an order",
    });

    await EmailService({
      to: user.emailAddress,
      subject: "Order confirmation",
      html: `Dear ${user.firstName} ${user.lastName}<br /> your order with order id ${newOrder.orderId} is being processed.

      Gift2Naija`,
    }).catch((err) => console.log(err));
  },

  cancel: async (req, res) => {
    const orderId = req.params.id;
    const orderTime = (await Order.findOne({ orderId })).createdAt;
    const threeDaysMillisec = 1000 * 60 * 60 * 24 * 3;
    if (Date.now() >= orderTime + threeDaysMillisec) {
      return res.badRequest(
        undefined,
        `You cannot cancel this order ${orderId}, check T&C`
      );
    }

    const newOrder = await Order.updateOne({
      orderId,
      sender: req.me.id,
    }).set({ status: "cancelled" });

    if (!newOrder) {
      return res.badRequest();
    }

    return res.json({
      success: true,
      data: newOrder,
      msg: "Successfully updated order status",
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

    res.json({
      success: true,
      data: newOrder,
      msg: "Successfully updated order status",
    });

    if (status === "completed") {
      await EmailService({
        to: user.emailAddress,
        subject: "Order completed",
        text: `Dear ${user.fullName} order id ${newOrder.orderId} has been completed`,
      }).catch((err) => console.log(err));
      // add to kpi
      // quantity,
      // price,
      // amount,
      // orderId,
      // category,
      // subCategory,
      // product

      newOrder.items.map(async (_prod) => {
        const { name: product, vendor } = await Product.findOne(
          { id: _prod.id },
          { vendor: true }
        );
        const { name: category } = await Category.findOne({
          id: _prod.category,
        });
        const { name: subCategory } = await SubCategory.findOne({
          id: _prod.subCategory,
        });

        const _kpi = {
          product,
          category,
          subCategory,
          orderId: newOrder.orderId,
          discount: _prod.discount,
          amount: _prod.amount,
          quantity: _prod.quantity,
          price: _prod.price,
          owner: vendor.id,
        };

        await Kpi.create(_kpi).catch((err) => console.log(err));
      });
    }
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
