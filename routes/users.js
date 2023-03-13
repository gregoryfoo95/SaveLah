var express = require('express');
var router = express.Router();
const usersCtrl = require("../controllers/users");



router.get("/login/new", usersCtrl.loginPage);
router.get("/register/new", usersCtrl.registerPage);
router.post("/register", usersCtrl.register);
router.post("/login", usersCtrl.login);
module.exports = router;
