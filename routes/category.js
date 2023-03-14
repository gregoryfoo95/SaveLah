var express = require('express');
var router = express.Router();
const categoryCtrl = require("../controllers/categories");
const userCtrl = require("../controllers/users");


router.get("/all", userCtrl.isAuth, userCtrl.isAdmin, categoryCtrl.summary);
router.post("/", userCtrl.isAuth, userCtrl.isAdmin, categoryCtrl.create);
router.get("/:id/edit", userCtrl.isAuth, userCtrl.isAdmin, categoryCtrl.editForm);
router.put("/:id", userCtrl.isAuth, userCtrl.isAdmin, categoryCtrl.edit);
router.delete("/:id", userCtrl.isAuth, userCtrl.isAdmin, categoryCtrl.del);

module.exports = router;
