const randomstring = require("randomstring");

let otp = () => {
  return randomstring.generate({
    length: 4,
    charset: "numeric",
  });
};

module.exports = { otp };
