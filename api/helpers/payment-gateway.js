const braintree = require("braintree");

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: "useYourMerchantId",
  publicKey: "useYourPublicKey",
  privateKey: "useYourPrivateKey",
});

async function getClientToken(customerId) {
  const response = await gateway.clientToken.generate({
    customerId: customerId,
  });

  console.log("getClientToken response: ", response);
  const { clientToken } = response;
  return clientToken;
}

async function createTransaction(nonce, deviceData, amount, orderId) {
  const transactionResultObj = await gateway.transaction.sale({
    amount: amount,
    orderId: orderId,
    paymentMethodNonce: nonce,
    deviceData: deviceData,
    options: {
      submitForSettlement: true,
    },
  });

  return transactionResultObj;
}

function paymentGateway() {
  return {
    gateway: gateway,
    getClientToken: getClientToken,
    createTransaction: createTransaction,
  };
}

module.exports.sync = true;
module.exports.fn = paymentGateway;
