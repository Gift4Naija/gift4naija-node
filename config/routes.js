/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {
  "/api/v1/account/logout": { action: "account/logout" },
  "GET /api/v1/test/email": "EmailTestController.test",

  // account
  "PUT   /api/v1/account/update-password": {
    action: "account/update-password",
  },
  "PUT   /api/v1/account/update-profile": { action: "account/update-profile" },
  "PUT   /api/v1/account/update-billing-card": {
    action: "account/update-billing-card",
  },

  // entrance
  "PUT   /api/v1/entrance/login": { action: "entrance/login" },
  "PUT   /api/v1/entrance/confirm-email": { action: "entrance/confirm-email" },
  "POST  /api/v1/entrance/signup": { action: "entrance/signup" },
  "POST  /api/v1/entrance/send-password-recovery-email": {
    action: "entrance/send-password-recovery-email",
  },
  "POST  /api/v1/entrance/send-email-confirmation": {
    action: "entrance/send-email-confirmation",
  },
  "POST  /api/v1/entrance/update-password-and-login": {
    action: "entrance/update-password-and-login",
  },

  // contact
  "POST  /api/v1/deliver-contact-form-message": {
    action: "deliver-contact-form-message",
  },

  "POST  /api/v1/observe-my-session": {
    action: "observe-my-session",
    hasSocketFeatures: true,
  },

  // csurf
  "GET /grant/csrf-token": { action: "security/grant-csrf-token" },

  // user
  "GET /api/v1/users": "UserController.getAll",
  "GET /api/v1/user/:id": "UserController.getOne",
  "PUT /api/v1/user/:id/level-up": "UserController.promoteUser",

  // product
  "GET /api/v1/products": "ProductController.getAll",
  "GET /api/v1/product/:id": "ProductController.getOne",
  "POST /api/v1/product": "ProductController.create",
  "PUT /api/v1/product/:id": "ProductController.update",
  "GET /api/v1/product/image/:image/view":
    "ProductController.viewProductImages",
  "PUT /api/v1/product/:id/image/upload":
    "ProductController.uploadProductImage",
  "DELETE /api/v1/product/:id/image/": "ProductController.removeProductImage",
  "DELETE /api/v1/product/:id": "ProductController.remove",

  // cart item
  "GET /api/v1/cart-items": "CartItemController.getAll",
  "GET /api/v1/cart-item/:id": "CartItemController.getOne",
  "POST /api/v1/cart-item": "CartItemController.create",
  "PUT /api/v1/cart-item/:id": "CartItemController.update",
  "DELETE /api/v1/cart-item/:id": "CartItemController.remove",

  // category
  "GET /api/v1/categories": "CategoryController.getAll",
  "GET /api/v1/category/:id": "CategoryController.getOne",
  "POST /api/v1/category": "CategoryController.create",
  "PUT /api/v1/category/:id": "CategoryController.update",
  "DELETE /api/v1/category/:id": "CategoryController.remove",

  // sub-category
  "GET /api/v1/category/:category/sub": "SubCategoryController.getAll",
  "GET /api/v1/category/:category/sub/:id": "SubCategoryController.getOne",
  "POST /api/v1/category/:category/sub": "SubCategoryController.create",
  "PUT /api/v1/category/:category/sub/:id": "SubCategoryController.update",
  "DELETE /api/v1/category/:category/sub/:id": "SubCategoryController.remove",

  // order
  // @admins
  "GET /api/v1/orders/level-up": "OrderController.getAll",
  "GET /api/v1/order/:id/level-up": "OrderController.getOne",

  // @users
  "GET /api/v1/orders": "OrderController.getUserAll",
  "GET /api/v1/order/:id": "OrderController.getUserOne",
  "GET /api/v1/order/preview": "OrderController.preview",

  "POST /api/v1/order": "OrderController.create",
  "PUT /api/v1/order/:id/status-change": "OrderController.updateStatus",
  "DELETE /api/v1/order/:id": "OrderController.remove",

  // kpi
  "GET /api/v1/kpis": "KpiController.getAll",
  "GET /api/v1/kpi/:id": "KpiController.getOne",

  // payment test
  // "/api/v1/payment/checkout": "PaymentController.execute",
  // "/api/v1/payment/success": "PaymentController.execute",
};
