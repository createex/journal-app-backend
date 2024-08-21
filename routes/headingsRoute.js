const express = require("express");
const router = express.Router();
const { headingsCont } = require("../controllers");

router
  .post("/create/", headingsCont.create)
  .put("/update/", headingsCont.updateByValue)
  .get("/get/", headingsCont.getValue);

module.exports = router;
