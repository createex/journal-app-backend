const express = require("express");
const router = express.Router();
const { feelingsCont } = require("../controllers");
const { uploadDoc } = require("../utils/multerDoc");

router
  .post("/create/", uploadDoc.single("image"), feelingsCont.create)
  .get("/getById/:id", feelingsCont.getById)
  .get("/getAll", feelingsCont.getAll)
  .delete("/deleteById/:id", feelingsCont.deleteById)
  .put("/update/:id", uploadDoc.single("image"), feelingsCont.update);

module.exports = router;
