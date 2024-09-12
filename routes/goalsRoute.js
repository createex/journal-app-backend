const express = require("express");
const router = express.Router();
const { goalsCont } = require("../controllers");
const { uploadDoc } = require("../utils/multerDoc");

router
  .post("/create/:id", uploadDoc.single("image"), goalsCont.create)
  .get("/getById/:id", goalsCont.getById)
  .get("/getAll", goalsCont.getAll)
  .delete("/deleteById/:id", goalsCont.deleteById)
  .put("/update/:id", uploadDoc.single("image"), goalsCont.update);

module.exports = router;
