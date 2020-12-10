var db = require('../config/connection')
var collection = require('../config/collections')
const collections = require('../config/collections')
const bcrypt = require('bcrypt')
const { resolve } = require('promise')
var categorySelected = []
var categoryReceived = []
var userDetails = []
var userId
var totalImageArray = []
var userSignedIn




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
            //console.log(categorySent);
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
            userSignedIn = await db.get().collection(collection.USER_COLLECTIONS).findOne({ name: data1.name })
            // this user contains all details of the user who successfully completed phase 1 of login process
            if (userSignedIn) {
                bcrypt.compare(data1.password, userSignedIn.password).then(async function (status) {
                    if (status) {
                        console.log("success");
                        response.user = userSignedIn
                        response.status = true
                        resolve(response)
                    }
                    else {
                        console.log("Login Failed");
                        resolve({ status: false })
                    }
                })
            }
        })

    },
    doSignin2: function () { 
        return new Promise(async function (resolve, reject) {
            var alphaImageArray = []
            var imageArray=[]
            var alphaArray=[]
            //alphaImageArray =[]
            var categoryCollection = await db.get().collection(collection.CATEGORY).find({}).toArray()
            for(i=0; i< categoryCollection.length; i=i+2){
                totalImageArray.push(categoryCollection[i]._id)
            }
            for(i=0; i< userSignedIn.length; i++){
                totalImageArray.push(userSignedIn[i]._id)
            }
            for(i=0; i< userSignedIn.length; i++){ 
                totalImageArray.push(userSignedIn[i]._id)
            }
            console.log(totalImageArray);
            
            

            //code for creating random set of images
            
            function randomGenerator1() {
                var len = 1
                var ans = '';
                for (var index = len; index > 0; index--) {
                    ans +=
                        totalImageArray[Math.floor(Math.random() * totalImageArray.length)];
                }
                return ans
            }
            var new_arr = []
            var flag = true
            for (index = 0; index < 10; index++) {
                var result = randomGenerator1()

                if (imageArray.length == 0) {
                    imageArray[index] = result
                    //imageArraySent.push(result)
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
                    imageArray[index] = result
                    //imageArray.push(result)
                    new_arr.push(result)
                    continue
                }
                flag = true
            }

            // code to generate random alphanumeric values 
            
            
            function randomGenerator2() {
                let arr = '12345abcde!@#$%^&*()67890fghijklmnopqrstuvwxyz'
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
            for (index = 0; index < 10; index++) {
                var result1 = randomGenerator2()

                if (new_arr.length == 0) {
                    alphaArray[index] = result1
                    new_arr.push(result1)
                    continue
                }
                else {
                    for (i = 0; i < new_arr.length; i++) {

                        if (new_arr[i] == result1) {
                            flag = false
                            index--
                            break
                        }
                    }
                }
                if (flag == true) {
                    alphaArray[index] = result1
                    new_arr.push(result1)
                    continue
                }
                flag = true
            }

           
            //.......................................................
            function ImageObj(imageId, alpha) {
                this.imageId = imageId
                this.alpha = alpha
            }


            for (let i = 0; i < imageArray.length; i++) {
                alphaImageArray.push(new ImageObj(imageArray[i], alphaArray[i]));
            }
            console.log(alphaImageArray);
            resolve(alphaImageArray)
        })    
    }
}

/*
create an array that contains the names of all the categories in the category collection
then run a loop for each category
take the first category, then run the mongodb query to fetch the fields of that category and fetch the images and insert into an array
do the same for each category with that loop
now  you will get an array that contains many images
*/


            /*
                        
                        //.......................................................
                        //code for creating random set of images
            
                        function randomGenerator1() {
                            var len = 1
                            var ans = '';
                            for (var index = len; index > 0; index--) {
                                ans +=
                                    totalImageArray[Math.floor(Math.random() * totalImageArray.length)];
                            }
                            return ans
                        }
                        var new_arr = []
                        var flag = true
                        for (index = 0; index < 7; index++) {
                            var result = randomGenerator1()
            
                            if (imageArray.length == 0) {
                                imageArray[index] = result
                                //imageArraySent.push(result)
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
                                imageArray[index] = result
                                //imageArray.push(result)
                                new_arr.push(result)
                                continue
                            }
                            flag = true
                        }
            
            
            */


            /*
            
            //.......................................................
                        // code to assign random alphanumeric values to random set of images
            
            
                        function randomGenerator2() {
                            let arr = '12345abcde!@#$%^&*()67890fghijklmnopqrstuvwxyz'
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
                        for (index = 0; index < 7; index++) {
                            var result1 = randomGenerator2()
            
                            if (new_arr.length == 0) {
                                alphanumericArray[index] = result1
                                new_arr.push(result1)
                                continue
                            }
                            else {
                                for (i = 0; i < new_arr.length; i++) {
            
                                    if (new_arr[i] == result1) {
                                        flag = false
                                        index--
                                        break
                                    }
                                }
                            }
                            if (flag == true) {
                                alphanumericArray[index] = result1
                                new_arr.push(result1)
                                continue
                            }
                            flag = true
                        }
            
            */




            //console.log(imageArray);
            //console.log(alphanumericArray);
            //alphaImageArray['id']=imageArray[0]
            /*
            for(i=0;i<7; i++){
                alphaImageArray[imageArray[i]]=alphanumericArray[i]
            }
            */
            //console.log(alphaImageArray);




            //........................................................................

            /*
function randomGenerator2() {
                let arr = '12345abcde!@#$%^&*()67890fghijklmnopqrstuvwxyz'
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
            for (index = 0; index < categoryCollection.length; index++) {
                var result2 = randomGenerator2()

                if (new_arr.length == 0) {
                    categoryCollection[index].alpha = result2
                    new_arr.push(result2)
                    continue
                }
                else {
                    for (i = 0; i < new_arr.length; i++) {

                        if (new_arr[i] == result2) {
                            flag = false
                            index--
                            break
                        }
                    }
                }
                if (flag == true) {
                    categoryCollection[index].alpha = result2
                    new_arr.push(result2)
                    continue
                }
                flag = true
            }        
            var tempArr=[]
            for (i =0; i < (userSignedIn.imageId.length); i++) {
                tempArr.push(categoryCollection[i])
            }
            for (i =0; i < (userSignedIn.imageId.length); i++) {
                tempArr[i]._id=(userSignedIn.imageId[i])             
            }
            for (i =0; i < (userSignedIn.imageId.length); i++) {
                categoryCollection.push(tempArr[i])             
            }       
            console.log("^^^^", categoryCollection);
            

            function randomGenerator1() {
                var len = 1
                var ans 
                for (var index = len; index > 0; index--) {
                    ans =
                    categoryCollection[Math.floor(Math.random() * categoryCollection.length)];
                }
                return ans
            }
            var new_arr1 = []
            var flag1 = true
            for (index = 0; index < 7; index++) {
                var result = randomGenerator1()
                //console.log("######################");

                if (alphaImageArray.length == 0) {
                    console.log("######################");
                    console.log(result);
                    alphaImageArray.push(result)
                    new_arr1.push(result)
                    continue
                }
                else {
                    for (i = 0; i < new_arr1.length; i++) {
                        if (new_arr1[i] == result) {
                            flag1 = false
                            index--
                            break
                        }
                    }
                }
                if (flag1 == true) {
                    alphaImageArray.push(result)
                    new_arr1.push(result)
                    continue
                }
                flag1 = true
            }    
            */