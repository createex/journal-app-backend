const express = require("express");
const router = express.Router();
const { postCont } = require("../controllers");

router
  .post("/create", postCont.create)
  .get("/getById/:id", postCont.getById)
  .get("/getByUserId/:id", postCont.getByUserId)
  .get("/getAll", postCont.getAll)
  .delete("/deleteById/:id", postCont.deleteById);

module.exports = router;
