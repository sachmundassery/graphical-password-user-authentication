var express = require('express');
var router = express.Router();
var adminHelpers=require('../helpers/admin-helpers')

/* GET users listing. */
router.get('/', function(req, res, next) {
  adminHelpers.getAllCategories().then(function(category){
    console.log(category);
    res.render('admin',{category});
  })
  
});
router.post('/',function(req,res){
 
  adminHelpers.addCategory(req.body,function(id){
    let image=req.files.image
    image.mv('./public/images/'+id+'.jpg',function(err,done){
      if(!err){
        res.redirect('/admin')
      }
      else{
        console.log(err);
      }
    })
    
  })
  
})

module.exports = router;
