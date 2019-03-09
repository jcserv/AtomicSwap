var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'AION - Ethereum Atomic Swap Protocol Demo' });
});


router.get('/locker', function(req, res, next) {
  res.render('locker', { title: 'AION Locker' });
});

module.exports = router;
