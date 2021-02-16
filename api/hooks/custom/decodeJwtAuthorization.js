module.exports = async function decodeJwtAuthorization(req) {
  const authorization =
    req.header("authorization") || req.header("Authorization");

  if (!authorization) {
    return;
  }

  const token = authorization.split("Bearer ")[1];

  if (!token) {
    return;
  }

  const payload = await sails.helpers
    .jwt()
    .verify(token)
    .catch((err) => new Error(err));

  if (!(payload && payload.token)) {
    return;
  }

  req.userId = payload.token;
  return;
};
