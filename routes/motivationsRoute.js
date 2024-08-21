const express = require("express");
const router = express.Router();
const { motivationsCont } = require("../controllers");
const { uploadDoc } = require("../utils/multerDoc");

router
  .post("/create/", uploadDoc.single("image"), motivationsCont.create)
  .get("/getById/:id", motivationsCont.getById)
  .get("/getAll", motivationsCont.getAll)
  .delete("/deleteById/:id", motivationsCont.deleteById)
  .put("/update/:id", uploadDoc.single("image"), motivationsCont.update);

module.exports = router;
