module.exports = {
  friendlyName: "Update password and login",

  description:
    "Finish the password recovery flow by setting the new password and " +
    "logging in the requesting user, based on the authenticity of their token.",

  inputs: {
    password: {
      description: "The new, unencrypted password.",
      example: "abc123v2",
      required: true,
    },

    token: {
      description:
        "The password token that was generated by the `sendPasswordRecoveryEmail` endpoint.",
      example: "gwa8gs8hgw9h2g9hg29hgwh9asdgh9q34$$$$$asdgasdggds",
      required: true,
    },
  },

  exits: {
    success: {
      description:
        "Password successfully updated, and requesting user agent is now logged in.",
    },

    invalidToken: {
      description:
        "The provided password token is invalid, expired, or has already been used.",
      responseType: "expired",
    },
  },

  fn: async function ({ password, token }) {
    const { req, res } = this;
    if (!token) {
      return res.expired();
    }

    // Look up the user with this reset token.
    var userRecord = await User.findOne({ passwordResetToken: token });

    // If no such user exists, or their token is expired, bail.
    if (!userRecord || userRecord.passwordResetTokenExpiresAt <= Date.now()) {
      return res.expired();
    }

    // Hash the new password.
    var hashed = await sails.helpers.passwords.hashPassword(password);

    // Store the user's new password and clear their reset token so it can't be used again.
    await User.updateOne({ id: userRecord.id }).set({
      password: hashed,
      passwordResetToken: "",
      passwordResetTokenExpiresAt: 0,
    });

    const authToken = await sails.helpers
      .jwt()
      .sign({ token: userRecord.id })
      .catch((err) => res.negotiate(err));

    // Log the user in.
    // (This will be persisted when the response is sent.)
    // this.req.session.userId = userRecord.id;

    // In case there was an existing session, broadcast a message that we can
    // display in other open tabs.
    // if (sails.hooks.sockets) {
    //   await sails.helpers.broadcastSessionChange(this.req);
    // }

    return this.res.json({
      success: true,
      data: userRecord,
      token: authToken,
    });
  },
};
