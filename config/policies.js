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

  UserController: {
    getAll: "is-admin",
    getOne: "is-admin",
    promoteUser: "is-admin",
  },

  ProductController: {
    getAll: true,
    getOne: true,
    create: "is-admin-vendor",
    update: "is-admin-vendor",
    remove: "is-admin-vendor",
    viewProductImages: true,
    uploadProductImage: "is-admin-vendor",
    removeProductImage: "is-admin-vendor",
  },

  CategoryController: {
    getAll: true,
    getOne: true,
    create: "is-admin",
    update: "is-admin",
    remove: "is-admin",
  },

  PaymentController: {
    intent: true,
  },

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
