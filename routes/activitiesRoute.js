const express = require("express");
const router = express.Router();
const { activitiesCont } = require("../controllers");
const { uploadDoc } = require("../utils/multerDoc");

router
  .post("/create/", uploadDoc.single("image"), activitiesCont.create)
  .get("/getById/:id", activitiesCont.getById)
  .get("/getAll", activitiesCont.getAll)
  .delete("/deleteById/:id", activitiesCont.deleteById)
  .put("/update/:id", uploadDoc.single("image"), activitiesCont.update);

module.exports = router;
