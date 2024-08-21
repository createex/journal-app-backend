const express = require("express");
const router = express.Router();
const { moodsCont } = require("../controllers");
const { uploadDoc } = require("../utils/multerDoc");

router
  .post("/create/", uploadDoc.single("image"), moodsCont.create)
  .get("/getById/:id", moodsCont.getById)
  .get("/getAll", moodsCont.getAll)
  .delete("/deleteById/:id", moodsCont.deleteById)
  .put("/update/:id", uploadDoc.single("image"), moodsCont.update);

module.exports = router;
