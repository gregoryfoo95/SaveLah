var express = require('express');
var router = express.Router();
const usersCtrl = require("../controllers/users");
const User = require("../models/User");
/* GET home page. */

const isAuth = async (req, res, next) => {
  if (req.session.userid) {
    const user = await User.findById(req.session.userid).exec();
    //res.locals.user = user;
    console.log(res.locals.user);
    next();
  } else {
    res.render("users/login", {msg: "You have no authorisation rights, please try again."});
  }
};

router.get('/', usersCtrl.home);
router.get('/dashboard', isAuth, usersCtrl.dashboard);

module.exports = router;
