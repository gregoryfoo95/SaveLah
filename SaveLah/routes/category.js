var express = require('express');
var router = express.Router();
const categoryCtrl = require("../controllers/categories");
const User = require("../models/User");

const isAuth = async (req, res, next) => {
  if (req.session.userid) {
    const user = await User.findById(req.session.userid).exec();
    res.locals.user = user;
    next();
  } else {
    res.render("users/login", {msg: "You have no authorisation rights, please try again."});
  }
};

router.get("/categories/all", isAuth, categoryCtrl.summary);
router.post("/categories", isAuth, categoryCtrl.create);
module.exports = router;
