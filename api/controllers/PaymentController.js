/**
 * PaymentTestController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  create: async (req, res) => {
    const item = [
      {
        name: "item",
        sku: "001",
        price: "1.00",
        currency: "USD",
        quantity: 1,
      },
      {
        name: "item",
        sku: "sku2",
        price: "1.00",
        currency: "USD",
        quantity: 2,
      },
    ];
    console.log("e reach");
    const totalAmount = 3;
    const payment = await PaymentService.create(item, totalAmount).catch(
      (err) => {
        console.log(err);
        return res.serverError(err);
      }
    );

    res.json({ success: true, data: payment });
  },

  execute: async (req, res) => {
    console.log(req.query);
    const { paymentId, payerId: payer_id } = req.body;

    const paymentJson = {
      payer_id,
      transactions: [
        {
          amount: {
            currency: "USD",
            total: "1.00",
          },
        },
      ],
    };

    const payment = await PaymentService.execute(paymentJson, paymentId).catch(
      (err) => {
        console.log(err);
        return res.serverError(err);
      }
    );

    res.json({ success: true, data: payment });
  },
};
