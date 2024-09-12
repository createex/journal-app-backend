const express = require("express");
const router = express.Router();
const { statCont } = require("../controllers");

router.get("/getById/:id", statCont.getById);
router.get("/getAll/", statCont.getAll);
router.get('/graphstats/:id',statCont.graphstats)

module.exports = router;
