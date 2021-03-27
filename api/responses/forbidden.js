/**
 * 403 (Forbidden) Handler
 *
 * Usage:
 * return res.forbidden();
 * return res.forbidden(err);
 * return res.forbidden(err, 'some/specific/forbidden/view');
 *
 * e.g.:
 * ```
 * return res.forbidden('Access denied.');
 * ```
 */

module.exports = function forbidden(data, options) {
  // Get access to `req`, `res`, & `sails`
  var res = this.res;

  const resData = {
    success: false,
    // error: err,
    errorType: "Forbidden",
    msg: data,
  };

  // Set status code
  return res.status(403).json(resData);
};
