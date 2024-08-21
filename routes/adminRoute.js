const express = require("express");
const router = express.Router();
const { adminCont } = require("../controllers");

router
  .get("/getById/:id", adminCont.getById)
  .get("/getAll", adminCont.getAll)
  .put("/updateById/:id", adminCont.updateById);

module.exports = router;
