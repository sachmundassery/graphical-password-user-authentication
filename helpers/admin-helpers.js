var db=require('../config/connection')
var collection=require('../config/collections')
module.exports={
    addCategory:function(category,callback){
        console.log(category);
        db.get().collection('category').insertOne(category).then(function(data){
            console.log(data);
            callback(data.ops[0]._id)
        })
    },
    getAllCategories : function(){
        return new Promise(async function(resolve,reject){
            let category =await db.get().collection(collection.CATEGORY).find().toArray()
            resolve(category)
        })
    }
}