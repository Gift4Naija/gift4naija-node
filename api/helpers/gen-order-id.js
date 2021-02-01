module.exports = { fn: genOrderId };

async function genOrderId() {
  const { nanoid } = sails.config.globals.nanoid;
  const id = await nanoid();

  const order = await Order.find({ orderId: id });

  if (order.length) return genOrderId();

  return id;
}
