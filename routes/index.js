var express = require('express');
var router = express.Router();
var userHelpers = require('../helpers/user-helpers')
var id
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});

router.get('/signup1', function (req, res) {
  res.render('signup1');
})
router.post('/signup2', function (req, res, next) { // when signup 1 is submitted
  
  userHelpers.doSignup1(req.body).then(function (response) {
    //console.log(response); // id of the user 
    id = response
    res.render('signup2')
  })


})
router.post('/signup3', function (req, res, next) { // when signup2 is submitted

  //console.log(req.body);
  userHelpers.doSignup2(req.body, id).then(function () {
    userHelpers.doSignup3().then(function (category) {
     // console.log(category);
      res.render('signup3', { category })
    })
  })
})

router.post('/endRegistration',function(req,res,next){
  userHelpers.doneSignup(req.body).then(function(){
    res.redirect('/')
  })
  
})

router.get('/signin', function (req, res) {
  res.render('signin');
})

module.exports = router;
