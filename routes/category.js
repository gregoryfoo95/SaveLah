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

router.get("/all", categoryCtrl.summary);
router.post("/", categoryCtrl.create);
router.get("/:id/edit", categoryCtrl.editForm);
router.put("/:id", categoryCtrl.edit);
router.delete("/:id", categoryCtrl.del);

module.exports = router;
