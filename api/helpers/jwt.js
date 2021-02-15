const jsonwebtoken = require("jsonwebtoken");

function verify(token) {
  return new Promise(function (resolve, reject) {
    jsonwebtoken.verify(
      token,
      process.env.TOKEN_SECRET,
      async (err, payload) => {
        console.log(err, payload);
        if (err) {
          return reject(err);
        }
        return resolve(payload);
      }
    );
  });
}

function sign(data) {
  return new Promise(function (resolve, reject) {
    jsonwebtoken.sign(data, process.env.TOKEN_SECRET, async (err, token) => {
      console.log(err, token);
      if (err) {
        return reject(err);
      }
      return resolve(token);
    });
  });
}

module.exports = {
  sync: true,
  fn: function jwt() {
    return {
      verify,
      sign,
    };
  },
};
