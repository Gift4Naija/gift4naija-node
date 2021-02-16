/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {
  "*": "is-logged-in",
  OrderController: {
    getAll: "is-admin",
    getOne: "is-admin",
    updateStatus: "is-admin",
  },

  UserController: { getAll: "is-admin", getOne: "is-admin" },

  ProductController: {
    create: "is-admin-vendor",
    update: "is-admin-vendor",
    remove: "is-admin-vendor",
    uploadProductImage: "is-admin-vendor",
    removeProductImage: "is-admin-vendor",
  },

  CategoryController: {
    create: "is-admin",
    update: "is-admin",
    remove: "is-admin",
  },

  //for dev purpose
  EmailTestController: { "*": true },
  PaymentController: { "*": true },

  // Bypass the `is-logged-in` policy for:
  "entrance/*": true,
  "security/grant-csrf-token": true,
  "account/logout": true,
  "view-homepage-or-redirect": true,
  "view-faq": true,
  "view-contact": true,
  "legal/view-terms": true,
  "legal/view-privacy": true,
  "deliver-contact-form-message": true,
  // "deliver-contact-form-message": true,
};
