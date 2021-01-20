/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  getAll: async (req, res) => {
    const allUsers = await User.find();
    const usersPublicInfo = await allUsers.map((user) => user.toJSON());

    return res.json({
      success: true,
      data: usersPublicInfo,
    });
  },

  getOne: async (req, res) => {
    const queryID = req.params.id;
    const user = await User.findOne().where({ id: queryID });

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
