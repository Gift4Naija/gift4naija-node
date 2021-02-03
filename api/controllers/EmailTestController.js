/**
 * EmailTestController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  test: async (req, res) => {
    await EmailService({
      to: "dev@gift2naija.com",
      subject: "Please test email server",
      text: `Testing email server - Dear user we are test our email server on you `,
    }).catch((err) => res.serverError(err));

    res.json({
      success: true,
      msg: "Done",
    });
  },
};
