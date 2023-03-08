var express = require('express');
var router = express.Router();
const categoryCtrl = require("../controllers/categories");
const Category = require("../models/Category");


router.get("/categories", categoryCtrl.summary);
router.post("/categories", categoryCtrl.create);
module.exports = router;
