const braintree = require("braintree");

const { Sandbox, Production } = braintree.Environment;
const codeEnv = process.env.NODE_ENV === "development" ? Sandbox : Production;

const gateway = new braintree.BraintreeGateway({
  environment: codeEnv,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
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
