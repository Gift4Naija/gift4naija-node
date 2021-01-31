/**
 * negotiate.js
 *
 * A custom response.
 *
 * Example usage:
 * ```
 *     return res.negotiate();
 *     // -or-
 *     return res.negotiate(optionalData);
 * ```
 *
 * Or with actions2:
 * ```
 *     exits: {
 *       somethingHappened: {
 *         responseType: 'negotiate'
 *       }
 *     }
 * ```
 *
 * ```
 *     throw 'somethingHappened';
 *     // -or-
 *     throw { somethingHappened: optionalData }
 * ```
 */

module.exports = function negotiate(optionalData) {
  // Get access to `req` and `res`
  var req = this.req;
  var res = this.res;

  const resData = {
    success: false,
  };

  // Define the status code to send in the response.
  var statusCodeToSet = 400;

  res.status(statusCodeToSet);

  // If no data was provided, use res.sendStatus().
  if (optionalData === undefined) {
    sails.log.info("Ran custom response: res.negotiate()");
    return res.json(resData);
  }
  // Else if the provided data is an Error instance, if it has
  // a toJSON() function, then always run it and use it as the
  // response body to send.  Otherwise, send down its `.stack`,
  // except in production use res.sendStatus().
  else if (_.isError(optionalData)) {
    sails.log.info(
      "Custom response `res.negotiate()` called with an Error:",
      optionalData
    );
    resData.error = optionalData;
    return res.json(resData);

    // If the error doesn't have a custom .toJSON(), use its `stack` instead--
    // otherwise res.json() would turn it into an empty dictionary.
    // (If this is production, don't send a response body at all.)
    /*    if (!_.isFunction(optionalData.toJSON)) {
      if (process.env.NODE_ENV === 'production') {
        return res.sendStatus(statusCodeToSet);
      }
      else {
        return res.status(statusCodeToSet).send(optionalData.stack);
      }
    }*/
  }
  // Set status code and send response data.
  else {
    resData.msg = optionalData;
    return res.json(resData);
  }
};
