/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  getAll: async (req, res) => {
    const allUsers = await User.find()
      // .populate(req.query.with)
      .catch((err) => res.negotiate(err));

    return res.json({
      success: true,
      data: allUsers,
    });
  },

  getOne: async (req, res) => {
    const queryID = req.params.id;
    let user = await User.findOne()
      .where({ id: queryID })
      // .populate(req.query.with)
      .catch((err) => res.negotiate(err));

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

    const userPub = user.toJSON();
    return res.json({
      success: true,
      data: userPub,
    });
  },
};
