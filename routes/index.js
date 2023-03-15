var express = require('express');
var router = express.Router();
const dashboardCtrl = require("../controllers/dashboard");
const userCtrl = require("../controllers/users");

router.get('/', dashboardCtrl.home);
router.get('/dashboard', userCtrl.isAuth, dashboardCtrl.dashboard);
router.get('/api/data', userCtrl.isAuth, userCtrl.isAdmin, dashboardCtrl.getData);
module.exports = router;
