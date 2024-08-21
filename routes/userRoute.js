const express = require("express");
const router = express.Router();
const { userCont } = require("../controllers");

router
  .get("/getById/:id", userCont.getById)
  .get("/getAll", userCont.getAll)
  .put("/updateById/:id", userCont.updateById)
  .get("/checkById/:id", userCont.checkById)
  .delete("/deleteById/:id", userCont.deleteById);

module.exports = router;
