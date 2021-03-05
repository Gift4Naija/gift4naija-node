module.exports = {
  friendlyName: "Update profile",

  description: "Update the profile for the logged-in user.",

  inputs: {
    fullName: {
      type: "string",
    },

    emailAddress: {
      type: "string",
    },
  },

  exits: {
    emailAlreadyInUse: {
      statusCode: 409,
      description: "The provided email address is already in use.",
    },
  },

  fn: async function ({ fullName, emailAddress, phoneNumber, city, state }) {
    const { req, res } = this;
    var newEmailAddress = emailAddress;
    if (newEmailAddress !== undefined) {
      newEmailAddress = newEmailAddress.toLowerCase();
    }

    // Determine if this request wants to change the current user's email address,
    // revert her pending email address change, modify her pending email address
    // change, or if the email address won't be affected at all.
    var desiredEmailEffect; // ('change-immediately', 'begin-change', 'cancel-pending-change', 'modify-pending-change', or '')
    if (
      newEmailAddress === undefined ||
      (this.req.me.emailStatus !== "change-requested" &&
        newEmailAddress === this.req.me.emailAddress) ||
      (this.req.me.emailStatus === "change-requested" &&
        newEmailAddress === this.req.me.emailChangeCandidate)
    ) {
      desiredEmailEffect = "";
    } else if (
      this.req.me.emailStatus === "change-requested" &&
      newEmailAddress === this.req.me.emailAddress
    ) {
      desiredEmailEffect = "cancel-pending-change";
    } else if (
      this.req.me.emailStatus === "change-requested" &&
      newEmailAddress !== this.req.me.emailAddress
    ) {
      desiredEmailEffect = "modify-pending-change";
    } else if (
      !sails.config.custom.verifyEmailAddresses ||
      this.req.me.emailStatus === "unconfirmed"
    ) {
      desiredEmailEffect = "change-immediately";
    } else {
      desiredEmailEffect = "begin-change";
    }

    // If the email address is changing, make sure it is not already being used.
    if (
      _.contains(
        ["begin-change", "change-immediately", "modify-pending-change"],
        desiredEmailEffect
      )
    ) {
      let conflictingUser = await User.findOne({
        or: [
          { emailAddress: newEmailAddress },
          { emailChangeCandidate: newEmailAddress },
        ],
      });
      if (conflictingUser) {
        return res.status(409).json({
          success: false,
          msg: "The email address is no longer available.",
        });
      }
    }

    // Start building the values to set in the db.
    // (We always set the fullName if provided.)
    fullName = fullName || req.me.fullName;
    phoneNumber = phoneNumber || req.me.phoneNumber;
    fullName = fullName || req.me.fullName;
    var valuesToSet = {
      fullName,
      phoneNumber,
    };

    if (city && req.me.role === "vendor") {
      valuesToSet.city = city || req.me.city;
    }

    if (state && req.me.role === "vendor") {
      valuesToSet.state = req.me.state;
    }

    switch (desiredEmailEffect) {
      // Change now
      case "change-immediately":
        _.extend(valuesToSet, {
          emailAddress: newEmailAddress,
          emailChangeCandidate: "",
          emailProofToken: "",
          emailProofTokenExpiresAt: 0,
          emailStatus:
            this.req.me.emailStatus === "unconfirmed"
              ? "unconfirmed"
              : "confirmed",
        });
        break;

      // Begin new email change, or modify a pending email change
      case "begin-change":
      case "modify-pending-change":
        _.extend(valuesToSet, {
          emailChangeCandidate: newEmailAddress,
          emailProofToken: await sails.helpers.strings.random("url-friendly"),
          emailProofTokenExpiresAt:
            Date.now() + sails.config.custom.emailProofTokenTTL,
          emailStatus: "change-requested",
        });
        break;

      // Cancel pending email change
      case "cancel-pending-change":
        _.extend(valuesToSet, {
          emailChangeCandidate: "",
          emailProofToken: "",
          emailProofTokenExpiresAt: 0,
          emailStatus: "confirmed",
        });
        break;

      // Otherwise, do nothing re: email
    }

    // Save to the db
    const newUserData = await User.updateOne({ id: this.req.me.id })
      .set(valuesToSet)
      .fetch();

    // If this is an immediate change, and billing features are enabled,
    // then also update the billing email for this user's linked customer entry
    // in the Stripe API to make sure they receive email receipts.
    // > Note: If there was not already a Stripe customer entry for this user,
    // > then one will be set up implicitly, so we'll need to persist it to our
    // > database.  (This could happen if Stripe credentials were not configured
    // > at the time this user was originally created.)
    if (
      desiredEmailEffect === "change-immediately" &&
      sails.config.custom.enableBillingFeatures
    ) {
      let didNotAlreadyHaveCustomerId = !this.req.me.stripeCustomerId;
      let stripeCustomerId = await sails.helpers.stripe.saveBillingInfo
        .with({
          stripeCustomerId: this.req.me.stripeCustomerId,
          emailAddress: newEmailAddress,
        })
        .timeout(5000)
        .retry();
      if (didNotAlreadyHaveCustomerId) {
        await User.updateOne({ id: this.req.me.id }).set({
          stripeCustomerId,
        });
      }
    }

    res.json({
      success: true,
      data: newUserData,
      msg: "Account has been successfully updated",
    });

    // If an email address change was requested, and re-confirmation is required,
    // send the "confirm account" email.
    if (
      desiredEmailEffect === "begin-change" ||
      desiredEmailEffect === "modify-pending-change"
    ) {
      /*await sails.helpers.sendTemplateEmail.with({
        to: newEmailAddress,
        subject: "Your account has been updated",
        template: "email-verify-new-email",
        templateData: {
          fullName: fullName || this.req.me.fullName,
          token: valuesToSet.emailProofToken,
        },
      });*/

      await EmailService({
        to: newEmailAddress,
        subject: "Your account has been updated",
        text: `email-verify-new-email - Dear ${fullName} confirm your email ${valuesToSet.emailProofToken}`,
      }).catch((err) => console.log(err));
    }
  },
};
