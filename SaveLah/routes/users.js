var express = require('express');
var router = express.Router();
const usersCtrl = require("../controllers/users");
const User = require("../models/User");


router.get("/login", usersCtrl.loginPage);
router.get("/register", usersCtrl.registerPage);
router.post("/register", usersCtrl.register);
router.post("/login", usersCtrl.login);
module.exports = router;
