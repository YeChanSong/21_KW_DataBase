var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {title: '예방접종 사전예약 시스템'});
});

router.get('/landing', function(req, res, next) {
  res.render('landing', {title: '예방접종 사전예약 시스템'});
});

router.post('/landing', function(req, res, next){
  console.log("landing post");
  console.log('req.body: ' + JSON.stringify(req.body));
});


module.exports = router;