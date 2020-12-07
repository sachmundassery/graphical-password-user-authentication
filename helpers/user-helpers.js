var db = require('../config/connection')
var collection = require('../config/collections')
const collections = require('../config/collections')
const bcrypt = require('bcrypt')
const { resolve } = require('promise')
var categorySelected = []
var categoryReceived = []
var userDetails = []
var userId



module.exports = {
    doSignup1: function (userData1) {
        return new Promise(async function (resolve, reject) {
            //userData1.name = await bcrypt.hash(userData1.name,10)
            //userData1.email = await bcrypt.hash(userData1.name,10)
            db.get().collection(collections.USER_COLLECTIONS).insertOne(userData1).then(function (data) {

                resolve(data.ops[0]._id)
            })
        })

    },
    doSignup2: function (userData2, id) {
        userId = id
        categorySelected = userData2.category
        console.log(categorySelected);
        console.log("^^^^", categorySelected);
        return new Promise(async function (resolve, reject) {
            db.get().collection(collections.USER_COLLECTIONS).updateOne({ _id: id }, { $set: { 'category': userData2.category } }).then(function (data) {
                resolve()
            })
        })
    },
    doSignup3: function () {
        return new Promise(async function (resolve, reject) {

            let categoryDB = await db.get().collection(collection.CATEGORY).find().toArray()
            //console.log("****", categoryDB[0].category);
            //console.log(categoryDB);
            var categorySent = []
            for (const index in categorySelected) {
                for (i = 0; i < categoryDB.length; i++) {
                    //console.log("%%%%", categoryDB[k].category);
                    if (categorySelected[index] === categoryDB[i].category) {
                        categorySent.push(categoryDB[i])

                    }

                }
            }

            // code to generate random non repeating alphanumeric values
            let arr = '12345abcde!@#$%^&*()67890fghijklmnopqrstuvwxyz'

            function randomGenerator() {

                var len = 1
                var ans = '';
                for (var index = len; index > 0; index--) {
                    ans +=
                        arr[Math.floor(Math.random() * arr.length)];
                }
                return ans

            }
            var new_arr = []
            var flag = true
            for (index = 0; index < categorySent.length; index++) {
                var result = randomGenerator()

                if (new_arr.length == 0) {
                    categorySent[index].alpha = result
                    new_arr.push(result)
                    continue
                }
                else {
                    for (i = 0; i < new_arr.length; i++) {

                        if (new_arr[i] == result) {
                            flag = false
                            index--
                            break
                        }
                    }
                }
                if (flag == true) {
                    categorySent[index].alpha = result
                    new_arr.push(result)
                    continue
                }
                flag = true

            }

            categoryReceived = categorySent

            //console.log(categorySent);
            resolve(categorySent)
        })
    },
    doneSignup: function (userData3) {
        console.log("-----", userData3);
        //console.log(("!!!!", categoryReceived));
        return new Promise(async function (resolve, reject) {
            var pwd = userData3.password
            for (i = 0; i < pwd.length; i++) {
                for (index = 0; index < categoryReceived.length; index++) {
                    if (categoryReceived[index].alpha === pwd[i]) {
                        console.log("hhhhhh");
                        userDetails.push(categoryReceived[index])
                    }
                }

            }
            var imageId = []
            for (i = 0; i < userDetails.length; i++) {
                imageId.push(userDetails[i]._id)
            }
            console.log(userDetails);
            console.log(pwd);
            bcryptPwd = await bcrypt.hash(pwd, 10)
            db.get().collection(collections.USER_COLLECTIONS).updateOne({ _id: userId }, { $set: { 'password': bcryptPwd, 'imageId': imageId } }).then(function (data) {
                userDetails = []
                resolve()
            })
        })

    },
    doSignin1: function (data1) {
        return new Promise(async function (resolve, reject) {
            console.log(data1);
            let loginStatus = false
            let response = {}
            let user = await db.get().collection(collection.USER_COLLECTIONS).findOne({ name: data1.name })
            //let bcryptPwd = await bcrypt.hash(data1.password, 10)
            //let pwd = await db.get().collection(collection.USER_COLLECTIONS).findOne({ password: bcryptPwd })

            if(user){
                bcrypt.compare(data1.password,user.password).then(function(status){
                    if(status){
                        console.log("success");
                        response.user=user
                        response.status=true
                        resolve(response)
                    }
                    else{
                        console.log("Login Failed");
                        resolve({status: false})
                    }
                })
            }
        })

    },
    doSignin2:function(){
        

    }


}