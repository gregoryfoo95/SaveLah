var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/', function(req, res) {
  res.render('home', {title: "SaveLah!"});

})

router.get('/dashboard', function(req, res, next) {
  res.render('index', { title: 'SaveLah!' });
});

module.exports = router;
