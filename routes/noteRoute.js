const express = require("express");
const router = express.Router();
const { noteCont } = require("../controllers");
const { uploadNote } = require("../utils/multerNote");

router
  .post("/create", uploadNote.single("note"), noteCont.create)
  .get("/getById/:id", noteCont.getById)
  .get("/getByUserId/:id", noteCont.getByUserId)
  .get("/getAll", noteCont.getAll)
  .delete("/deleteById/:id", noteCont.deleteById);

module.exports = router;
