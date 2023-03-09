var express = require('express');
var router = express.Router();
const transactionCtrl = require("../controllers/transactions");
const User = require("../models/User");

const isAuth = async (req, res, next) => {
  if (req.session.userid) {
    const user = await User.findById(req.session.userid).exec();
    res.locals.user = user;
    console.log(res.locals.user);
    next();
  } else {
    res.render("users/login", {msg: "You have no authorisation rights, please try again."});
  }
};

router.get("/transactions", isAuth, transactionCtrl.summary);
module.exports = router;
