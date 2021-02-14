/**
 * badRequest.js
 *
 * A custom response.
 *
 * Example usage:
 * ```
 *     return res.badRequest();
 *     // -or-
 *     return res.badRequest(err);
 * ```
 *
 * Or with actions2:
 * ```
 *     exits: {
 *       somethingHappened: {
 *         responseType: 'badRequest'
 *       }
 *     }
 * ```
 *
 * ```
 *     throw 'somethingHappened';
 *     // -or-
 *     throw { somethingHappened: err }
 * ```
 */

module.exports = function badRequest(err, msg) {
  // Get access to `req` and `res`
  var req = this.req;
  var res = this.res;

  const resData = {
    success: false,
    // error: err,
    errorType: "Bad Request",
    msg,
  };

  // Define the status code to send in the response.
  var statusCodeToSet = 400;

  res.status(statusCodeToSet).json(resData);
};
