var express = require('express');
var router = express.Router();
const usersCtrl = require("../controllers/users");
/* const passport = require('passport');

// Google OAuth login route
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
router.get("/login/new", usersCtrl.loginPage);
router.get("/register/new", usersCtrl.registerPage);
router.post("/register", usersCtrl.register);
router.post("/login", usersCtrl.login);
router.delete("/logout", usersCtrl.logout);
router.get("/profile/:id/edit", usersCtrl.isAuth, usersCtrl.profilePage)
router.put("/profile", usersCtrl.isAuth, usersCtrl.updateProfile)
module.exports = router;
