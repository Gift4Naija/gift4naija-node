module.exports = async function decodeJwtAuthorization(req) {
  if (!(req.header("authorization") || req.header("Authorization"))) {
    return;
  }

  const token =
    req.header("authorization").split("Bearer ")[1] ||
    req.header("Authorization").split("Bearer ")[1];

  if (!token) {
    return;
  }

  /*  const { verify } = sails.helpers.jwt();
  let payload = await verify(token).catch((err) => new Error(err));*/

  const payload = await sails.helpers
    .jwt()
    .verify(token)
    .catch((err) => new Error(err));

  if (!(payload && payload.token)) {
    return;
  }

  const user = await User.findOne({
    id: payload.token,
  });

  req.user = user;
  return;
};
