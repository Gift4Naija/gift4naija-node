/**
 * PaymentTestController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const stripe = require("stripe")(process.env.STRIPE_KEY);

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

module.exports.intent = async function (req, res) {
  const intentData = {
    amount: req.body.amount,
    currency: "usd",
    setup_future_usage: "off_session",
  };

  if (!req.body.amount) {
    return res.badRequest(undefined, "Amount must be specified");
  }

  const intent = await stripe.paymentIntents.create(intentData).catch((err) => {
    return res.serverError(err, "An error occured while processing payment");
  });

  return res.json({
    success: true,
    data: intent,
  });
};
