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
        userId=id
        categorySelected = userData2.category
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

            for (i = 0; i < categorySent.length; i++) {
                //console.log("%%%%", categoryDB[k].category);
                function generateAlphanumeric() {


                    arr = '12345abcde!@#$%^&*()67890fghijklmnopqrstuvwxyz'
                    len = 1
                    var ans = '';
                    for (var index = len; index > 0; index--) {
                        ans +=
                            arr[Math.floor(Math.random() * arr.length)];
                    }
                    return ans;
                }
                var num = generateAlphanumeric()
                categorySent[i].alpha = num
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
            console.log(userDetails);
            bcryptPwd = await bcrypt.hash(pwd,10)
            db.get().collection(collections.USER_COLLECTIONS).updateOne({ _id: userId }, { $set: { 'password':bcryptPwd } }).then(function (data) {
                resolve()
            })
        })

    }


}