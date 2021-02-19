module.exports = function negotiate(err) {
  // Get access to request (`req`), response (`res`), and Sails app (`sails`).
  var req = this.req;
  var res = this.res;
  var sails = req._sails;

  sails.log.debug(
    "`res.negotiate` is deprecated.  Use a custom response instead (see http://sailsjs.com/docs/concepts/custom-responses).\n"
  );

  var statusCode = 500;
  var body = err;

  try {
    statusCode = err.status || 500;

    // Set the status
    // (should be taken care of by res.* methods, but this sets a default just in case)
    res.status(statusCode);
  } catch (unusedErr) {}

  // Respond using the appropriate custom response
  if (statusCode === 403) {
    return res.forbidden(body);
  }
  if (statusCode === 404) {
    return res.notFound(body);
  }
  if (statusCode >= 400 && statusCode < 500) {
    return res.badRequest(body);
  }
  return res.serverError(body);
};
