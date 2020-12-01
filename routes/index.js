var express = require('express');
var router = express.Router();
var userHelpers=require('../helpers/user-helpers')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/signup', function(req,res){
  res.render('signup');
})
router.post('/signup',function(req,res){
  
})

router.get('/signin', function(req,res){
  res.render('signin');
})

module.exports = router;
