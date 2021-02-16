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
  const { me } = req;
  if (!me) {
    return res.unauthorized();
  } //•

  // Then check that this user is an "admin".
  const isAdminOrVendor =
    me.role === "admin" || me.role === "vendor" || me.isSuperAdmin;
  if (!isAdminOrVendor) {
    return res.forbidden("Access requires elevated privilage");
  } //•

  // IWMIH, we've got ourselves an "admin".
  return proceed();
};
