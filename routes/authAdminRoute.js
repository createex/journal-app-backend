const express = require("express");
const router = express.Router();
const { authAdminCont } = require("../controllers");

router
  .post("/login", authAdminCont.login)
  .post("/register", authAdminCont.register)
  .post("/forgetPassword", authAdminCont.forgetPassword)
  .post("/verifyPasswordOtp", authAdminCont.verifyPasswordOtp)
  .post("/changePassword/:id", authAdminCont.changePassword)
  .post("/newPassword/:id", authAdminCont.newPassword);

module.exports = router;
