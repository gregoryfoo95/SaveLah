var express = require('express');
var router = express.Router();
const transactionCtrl = require("../controllers/transactions");
const userCtrl = require("../controllers/users");

router.get("/all", userCtrl.isAuth, userCtrl.isAdmin, transactionCtrl.summary);
router.post("/", userCtrl.isAuth, userCtrl.isAdmin, transactionCtrl.create);
router.get("/:id/edit", userCtrl.isAuth, userCtrl.isAdmin, transactionCtrl.editForm);
router.put("/:id", userCtrl.isAuth, userCtrl.isAdmin, transactionCtrl.edit);
router.delete("/:id", userCtrl.isAuth, userCtrl.isAdmin, transactionCtrl.del);

module.exports = router;
