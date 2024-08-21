const express = require("express");
const router = express.Router();
const { statCont } = require("../controllers");

router.get("/getById/:id", statCont.getById).get("/getAll/", statCont.getAll);

module.exports = router;
