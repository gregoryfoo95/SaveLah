var express = require('express');
var router = express.Router();
const usersCtrl = require("../controllers/users");

router.get("/login", usersCtrl.loginPage);
router.get("/register", usersCtrl.registerPage);
module.exports = router;
