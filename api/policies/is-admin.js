/**
 * is-admin
 *
 * A simple policy that blocks requests from non-admins.
 *
 * For more about how to use policies, see:
 *   https://sailsjs.com/config/policies
 *   https://sailsjs.com/docs/concepts/policies
 *   https://sailsjs.com/docs/concepts/policies/access-control-and-permissions
 */
module.exports = async function (req, res, proceed) {
  // First, check whether the request comes from a logged-in user.
  // > For more about where `req.me` comes from, check out this app's
  // > custom hook (`api/hooks/custom/index.js`).
  if (!req.me) {
    return res.unauthorized();
  } //•

  // Then check that this user is an "admin".
  if (req.me.role !== "admin") {
    return res.forbidden("Access requires elevated privilage");
  } //•

  // IWMIH, we've got ourselves an "admin".
  return proceed();
};
