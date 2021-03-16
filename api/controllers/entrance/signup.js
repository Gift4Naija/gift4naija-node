module.exports = {
  friendlyName: "Signup",

  description: "Sign up for a new user account.",

  extendedDescription: `This creates a new user record in the database, signs in the requesting user agent
by modifying its [session](https://sailsjs.com/documentation/concepts/sessions), and
(if emailing with Mailgun is enabled) sends an account verification email.

If a verification email is sent, the new user's account is put in an "unconfirmed" state
until they confirm they are using a legitimate email address (by clicking the link in
the account verification message.)`,

  inputs: {
    emailAddress: {
      required: true,
      type: "string",
      isEmail: true,
      description: "The email address for the new account, e.g. m@example.com.",
      extendedDescription: "Must be a valid email address.",
    },

    password: {
      required: true,
      type: "string",
      maxLength: 200,
      example: "passwordlol",
      description: "The unencrypted password to use for the new account.",
    },

    firstName: {
      required: true,
      type: "string",
      example: "Frida",
      description: "The user's first name from Frida Rivera",
    },

    lastName: {
      required: true,
      type: "string",
      example: "Rivera",
      description: "The user's last name. from Frida Rivera",
    },

    phoneNumber: {
      required: true,
      type: "string",
      example: "08123456789",
      description: "The user's phone number.",
    },
  },

  exits: {
    success: {
      description: "New user account was created successfully.",
    },

    invalid: {
      responseType: "badRequest",
      description:
        "The provided fullName, password and/or email address are invalid.",
      extendedDescription:
        "If this request was sent from a graphical user interface, the request " +
        "parameters should have been validated/coerced _before_ they were sent.",
    },

    emailAlreadyInUse: {
      statusCode: 409,
      description: "The provided email address is already in use.",
    },
  },

  fn: async function ({
    emailAddress,
    password,
    firstName,
    lastName,
    phoneNumber,
  }) {
    var newEmailAddress = emailAddress.toLowerCase();
    const { res } = this;

    if (await User.findOne({ emailAddress: newEmailAddress })) {
      return res.status(409).json({
        success: false,
        errorType: "Conflict",
        msg: "Email already in use",
      });
    }

    if (
      !/^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/.test(
        password
      )
    ) {
      return res.badRequest(undefined, "Password failed validation");
    }

    // Build up data for the new user record and save it to the database.
    // (Also use `fetch` to retrieve the new ID so that we can use it below.)
    var newUserRecord;
    try {
      newUserRecord = await User.create(
        _.extend(
          {
            firstName,
            lastName,
            phoneNumber,
            emailAddress: newEmailAddress,
            password: await sails.helpers.passwords.hashPassword(password),
            tosAcceptedByIp: this.req.ip,
          },
          sails.config.custom.verifyEmailAddresses
            ? {
                emailProofToken: await sails.helpers.strings.random(
                  "url-friendly"
                ),
                emailProofTokenExpiresAt:
                  Date.now() + sails.config.custom.emailProofTokenTTL,
                emailStatus: "unconfirmed",
              }
            : {}
        )
      ).fetch();
    } catch (err) {
      return res.negotiate(err);
    }
    /*.intercept("E_UNIQUE", () => {
        res.status(409);
        res.json({
          success: false,
          error: new Error("Email already in use"),
          errorType: "Conflict",
        });
        return;
      })
      .intercept({ name: "UsageError" }, "invalid")*/

    // If billing feaures are enabled, save a new customer entry in the Stripe API.
    // Then persist the Stripe customer id in the database.
    /*if (sails.config.custom.enableBillingFeatures) {
      let stripeCustomerId = await sails.helpers.stripe.saveBillingInfo
        .with({
          emailAddress: newEmailAddress,
        })
        .timeout(5000)
        .retry();
      await User.updateOne({ id: newUserRecord.id }).set({
        stripeCustomerId,
      });
    }*/

    // Store the user's new id in their session.
    // this.req.session.userId = newUserRecord.id;
    const token = await sails.helpers
      .jwt()
      .sign({ token: newUserRecord.id })
      .catch((err) => res.negotiate(err));

    // In case there was an existing session (e.g. if we allow users to go to the signup page
    // when they're already logged in), broadcast a message that we can display in other open tabs.
    // if (sails.hooks.sockets) {
    //   await sails.helpers.broadcastSessionChange(this.req);
    // }

    res.json({ success: true, data: newUserRecord.toJSON(), token });

    if (sails.config.custom.verifyEmailAddresses) {
      // Send "confirm account" email
      /*await sails.helpers.sendTemplateEmail.with({
        to: newEmailAddress,
        subject: "Please confirm your account",
        template: "email-verify-account",
        templateData: {
          fullName,
          token: newUserRecord.emailProofToken,
        },
      });*/

      await EmailService({
        to: newEmailAddress,
        subject: "Verify Email",
        html: `Dear ${firstName} ${lastName}, <br />
        you successfully created you account, to complete this step, click <a href="${process.env.BASE_URL}/api/v1/account/verify/${newUserRecord.emailProofToken}">here</a> to verify your account. Ignore this message if you think its a mistake. <br />

        Gift2Naija.
        `,
      }).catch((err) => console.log(err));
    } else {
      sails.log.info(
        "Skipping new account email verification... (since `verifyEmailAddresses` is disabled)"
      );
    }
  },
};
