const express = require("express");
const router = express.Router();
const { authUserCont } = require("../controllers");

router
  .post("/login", authUserCont.login)
  .post("/register", authUserCont.register)
  .post("/forgetPassword", authUserCont.forgetPassword)
  .post("/emailVerify", authUserCont.verifyEmail)
  .post("/verifyEmailOtp", authUserCont.verifyEmailOtp)
  .post("/verifyPasswordOtp", authUserCont.verifyPasswordOtp)
  .post("/changePassword/:id", authUserCont.changePassword)
  .post("/newPassword/:id", authUserCont.newPassword);

module.exports = router;
