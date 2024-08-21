const express = require("express");
const router = express.Router();
const { elevatesCont } = require("../controllers");

router
  .post("/create", elevatesCont.create)
  .get("/getById/:id", elevatesCont.getById)
  .get("/getAll", elevatesCont.getAll)
  .delete("/deleteById/:id", elevatesCont.deleteById)
  .put("/update/:id", elevatesCont.update);

module.exports = router;
