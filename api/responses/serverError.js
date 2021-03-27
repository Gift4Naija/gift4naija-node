/**
 * 500 (Server Error) Response
 *
 * Usage:
 * return res.serverError();
 * return res.serverError(err);
 * return res.serverError(err, 'some/specific/error/view');
 *
 * NOTE:
 * If something throws in a policy or controller, or an internal
 * error is encountered, Sails will call `res.serverError()`
 * automatically.
 */

module.exports = function serverError(err, msg) {
  // Get access to `req` and `res`
  var res = this.res;

  console.log(err);

  // Set status code
  res.status(500);

  return res.json({
    status: false,
    errorType: "Server Error",
    error: err,
    msg: msg,
  });
};
