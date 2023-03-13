var express = require('express');
var router = express.Router();
const transactionCtrl = require("../controllers/transactions");
const User = require("../models/User");

const isAuth = async (req, res, next) => {
  if (req.session.userid) {
    const user = await User.findById(req.session.userid).exec();
    res.locals.user = user;
    //console.log(res.locals.user);
    next();
  } else {
    res.render("users/login", {msg: "You have no authorisation rights, please try again."});
  }
};

router.get("/all", isAuth, transactionCtrl.summary);
router.post("/", isAuth, transactionCtrl.create);
router.get("/:id/edit", isAuth, transactionCtrl.editForm);
router.put("/:id", isAuth, transactionCtrl.edit);
router.delete("/:id", isAuth, transactionCtrl.del);


module.exports = router;
