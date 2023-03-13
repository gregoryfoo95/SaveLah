var express = require('express');
var router = express.Router();
/* const passport = require('passport'); */
const dashboardCtrl = require("../controllers/dashboard");
const User = require("../models/User");

/* // Google OAuth login route
router.get('/auth/google', passport.authenticate(
  // Which passport strategy is being used?
  'google',
  {
    // Requesting the user's profile and email
    scope: ['profile', 'email'],
    // Optionally force pick account every time
    // prompt: "select_account"
  }
));

// Google OAuth callback route
router.get('/oauth2callback', passport.authenticate(
  'google',
  {
    successRedirect: '/dashboard',
    failureRedirect: '/'
  }
));

// OAuth logout route
router.get('/logout', function(req, res){
  req.logout(function() {
    res.redirect('/movies');
  });
});
 */
const isAuth = async (req, res, next) => {
  if (req.session.userid) {
    const user = await User.findById(req.session.userid).exec();
    res.locals.user = user;
    next();
  } else {
    res.render("users/login", {msg: "You have no authorisation rights, please try again."});
  }
};

router.get('/', dashboardCtrl.home);
router.get('/dashboard', isAuth, dashboardCtrl.dashboard);
router.get('/api/data', dashboardCtrl.getData);
module.exports = router;
