/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  getAll: async (req, res) => {
    const { query } = req;

    if (!query.with) {
      query.with = [];
    }

    const populate = {
      products: query.with.includes("products"),
    };

    if (req.me.role === "admin") {
      populate.orders = query.with.includes("orders");
    }

    const allUsers = await User.find({}, populate).catch((err) =>
      res.negotiate(err)
    );

    return res.json({
      success: true,
      data: allUsers,
    });
  },

  getOne: async (req, res) => {
    const { query } = req;
    const queryID = req.params.id;

    if (!query.with) {
      query.with = [];
    }

    const populate = {
      orders: query.with.includes("orders"),
      products: query.with.includes("products"),
    };

    let user = await User.findOne({ id: queryID }, populate).catch((err) =>
      res.negotiate(err)
    );

    /*if (req.query.pick) {
      user = await user;
    }*/
    // limit
    // skip
    // sort

    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "NotFound",
      });
    }

    // const userPub = user.toJSON();
    return res.json({
      success: true,
      data: user,
    });
  },

  /*
   * promote user
   *  @private admin
   *
   * @role - ["admin", "vendor", "buyer"]
   */
  promoteUser: async (req, res) => {
    const { role } = req.body;
    const promotedUser = await User.updateOne({ id: req.params.id })
      .set({ role })
      .catch((err) => res.negotiate(err));

    if (!promotedUser) {
      return res.badRequest();
    }

    return res.json({
      success: true,
      data: promotedUser,
    });
  },
};
