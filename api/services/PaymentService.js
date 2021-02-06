const paypal = require("paypal-rest-sdk");

const configurationOption = {
  mode: "sandbox", //sandbox or live
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
};
paypal.configure(configurationOption);

async function create(orderItemsArray, totalAmount, description = "") {
  const paymentJson = {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      return_url: "http://localhost:1337/api/v1/payment/success", // client success endpoint for payment execution
      cancel_url: "http://localhost:1337/api/v1/payment/cancel", // client route for order cancelation
    },
    transactions: [
      {
        item_list: {
          items: orderItemsArray,
          /*[{
                "name": "item",
                "sku": "item",
                "price": "1.00",
                "currency": "USD",
                "quantity": 1
            }]*/
        },
        amount: {
          currency: "USD",
          total: totalAmount,
        },
        description: description,
      },
    ],
  };
  let create_payment_json = JSON.stringify(paymentJson);

  return new Promise(function (resolve, reject) {
    paypal.payment.create(create_payment_json, function (error, payment) {
      if (error) {
        console.log(error.response.details);
        return reject(error);
      } else {
        console.log("Create Payment Response");
        console.log(payment);
        for (let link of payment.links) {
          //Redirect user to this endpoint for redirect url
          if (link.rel === "approval_url") {
            console.log(link.href);
            return resolve(link.href);
          }
        }
      }
    });
  });
}

async function execute(paymentJson, paymentId) {
  let execute_payment_json = JSON.stringify(paymentJson);
  /*{
    payer_id: "Appended to redirect url",
    transactions: [
      {
        amount: {
          currency: "USD",
          total: "1.00",
        },
      },
    ],
  };*/

  // "PAYMENT id created in previous step";

  return new Promise(function (resolve, reject) {
    paypal.payment.execute(
      paymentId,
      execute_payment_json,
      function (error, payment) {
        if (error) {
          console.log(error.response);
          return reject(error);
        } else {
          console.log("Get Payment Response");
          console.log(payment);
          return resolve(payment);
        }
      }
    );
  });
}

module.exports = {
  create,
  execute,
};
