const { nanoid } = require("nanoid/async");

async function genOrderId() {
  const id = await nanoid();
  const order = await Order.find({ orderId: id });

  // check for existing orders
  if (order.length) {
    return genOrderId();
  }

  // return new id
  return id;
}

module.exports = { fn: genOrderId };
