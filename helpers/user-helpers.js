require('dotenv').config();
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
var randomPass = ''
var userSelectedImages = []
var pin




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
            pin = (Math.floor(100000 + Math.random() * 900000)).toString()
            console.log(data1);
            console.log(pin);
            let loginStatus = false
            userSignedIn = await db.get().collection(collection.USER_COLLECTIONS).findOne({ name: data1.name })
            // this user contains all details of the user who successfully completed phase 1 of login process

            if (userSignedIn) {
                bcrypt.compare(data1.password, userSignedIn.password).then(async function (status) {
                    if (status) {
                        console.log("success", status);
                        //---------------------------------------------------------

                        var nodemailer = require('nodemailer');

                        var transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: process.env.EMAIL,
                                pass: process.env.PASSWORD
                            }
                        });

                        var mailOptions = {
                            from: 'dummyresearchmail@gmail.com',
                            to: userSignedIn.email.toString(),
                            subject: 'Mail From The Admin',
                            text: pin
                        };

                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                console.log("Error occured : ", error);
                            } else {
                                console.log('Email sent: ' + info.response);
                            }
                        });
                        //--------------------------------------------------------- 

                        loginStatus = true
                        resolve(loginStatus)
                    }
                    else {
                        console.log("Login Failed");
                        loginStatus = false
                        resolve(loginStatus)
                    }
                })
            }
            else {
                console.log("Login Failed");
                resolve(loginStatus)
            }
        })

    },
    email_verification: function (data3) {
        return new Promise(async function (resolve, reject) {
            console.log("---------", data3.password, "-------", pin);
            let emailStatus = false
            if (data3.password === pin) {
                console.log("email verified");
                emailStatus = true
                resolve(emailStatus)
            }
            else {
                console.log("PIN not matched");
                emailStatus = false
                resolve(emailStatus)
            }
        })


    },
    doSignin2: function () {
        return new Promise(async function (resolve, reject) {

            var alphaImageArray = []
            var imageArray = []
            var alphaArray = []

            var categoryCollection = await db.get().collection(collection.CATEGORY).find({}).toArray()
            for (i = 0; i < categoryCollection.length; i++) {
                totalImageArray.push(categoryCollection[i]._id)
            }

            //....................................................................
            //code for creating array with all images
            function randomGenerator1() {
                var len = 1
                var ans = '';
                for (y = len; y > 0; y--) {
                    ans +=
                        totalImageArray[Math.floor(Math.random() * totalImageArray.length)];
                }
                return ans
            }
            var new_arr1 = []
            var flag = true
            for (index = 0; index < 8; index++) {
                var result = randomGenerator1()

                if (new_arr1.length == 0) {
                    imageArray[index] = result
                    new_arr1.push(result)
                    continue
                }
                else {
                    for (i = 0; i < new_arr1.length; i++) {

                        if (new_arr1[i] == result) {
                            flag = false
                            index--
                            break
                        }
                    }
                }
                if (flag == true) {
                    imageArray[index] = result
                    new_arr1.push(result)
                    continue
                }
                flag = true
            }

            //....................................................................
            // code to add user selected images

            for (i = 0; i < (userSignedIn.imageId.length); i++) {
                var a = ''
                a = a + userSignedIn.imageId[i]
                imageArray.push(a)
                userSelectedImages[i] = a
            }

            // till here working

            //....................................................................
            // code to suffle user selected images
            var new_arr2 = []
            var imageArraySent = []
            var f = true
            function randomGenerator11() {
                var len = 1
                var ans = '';
                for (l = len; l > 0; l--) {
                    ans +=
                        imageArray[Math.floor(Math.random() * imageArray.length)];
                }
                return ans
            }

            for (index = 0; index < 9; index++) {
                var result11 = randomGenerator11()

                if (new_arr2.length == 0) {
                    imageArraySent[index] = result11

                    new_arr2.push(result11)
                    continue
                }
                else {
                    for (i = 0; i < new_arr2.length; i++) {

                        if (new_arr2[i] == result11) {
                            // sometimes infinite loop here
                            //console.log("*****");
                            f = false
                            index--
                            break
                        }
                    }
                }
                if (f == true) {
                    //imageArraySent.push(result11)
                    imageArraySent[index] = result11
                    new_arr2.push(result11)
                    continue
                }
                f = true
            }
            console.log("INSIDE DO SIGNIN 2");

            //....................................................................
            // code to generate random alphanumeric values for the images
            function randomGenerator2() {
                let arr = '12345abcde!@#$%^&*()67890fghijklmnopqrstuvwxyz'
                var len = 1
                var ans = '';
                for (indexi = len; indexi > 0; indexi--) {
                    ans +=
                        arr[Math.floor(Math.random() * arr.length)];
                }
                return ans
            }
            var new_arr = []
            var fl = true
            for (index = 0; index < 9; index++) {
                var result1 = randomGenerator2()

                if (new_arr.length == 0) {
                    alphaArray[index] = result1
                    new_arr.push(result1)
                    continue
                }
                else {
                    for (i = 0; i < new_arr.length; i++) {

                        if (new_arr[i] == result1) {
                            fl = false
                            index--
                            break
                        }
                    }
                }
                if (fl == true) {
                    alphaArray[index] = result1
                    new_arr.push(result1)
                    continue
                }
                fl = true
            }


            //....................................................................
            // code to create array of objects, with imageId and alpha
            function ImageObj(imageId, alpha) {
                this.imageId = imageId
                this.alpha = alpha
            }
            for (let i = 0; i < imageArraySent.length; i++) {
                alphaImageArray.push(new ImageObj(imageArraySent[i], alphaArray[i]));
            }

            //...................................................................
            //code to generate the expected password



            var imgPos = []
            var totPos = []
            var reqPos = []
            for (i = 0; i < imageArraySent.length; i++) {
                totPos[i] = i
            }

            f = true
            for (i = 0; i < userSelectedImages.length; i++) {
                for (j = 0; j < imageArraySent.length; j++) {
                    if (userSelectedImages[i] == imageArraySent[j]) {
                        imgPos.push(j)
                        break
                    }
                }

            }
            //imgPos.sort();
            function arr_diff(a1, a2) { // function to get the expected position of images selected

                var a = [], diff = [];

                for (var i = 0; i < a1.length; i++) {
                    a[a1[i]] = true;
                }

                for (var i = 0; i < a2.length; i++) {
                    if (a[a2[i]]) {
                        delete a[a2[i]];
                    } else {
                        a[a2[i]] = true;
                    }
                }

                for (var k in a) {
                    diff.push(k);
                }

                return diff;
            }

            var password1 = ''
            reqPos = arr_diff(totPos, imgPos)
            console.log(reqPos);
            console.log(alphaImageArray[reqPos[1]].alpha);
            for (i = 0; i < reqPos.length; i++) {
                password1 += alphaImageArray[reqPos[i]].alpha
            }
            randomPass = password1
            //console.log(password1);
            console.log(randomPass);

            resolve(alphaImageArray)
        })
    },
    doneSignin: function (data2) {
        return new Promise(async function (resolve, reject) {
            console.log("####", data2.password);
            let status = false


            if (data2.password == randomPass) {
                console.log("success123");
                status = true
                resolve(status)
            }
            else {
                console.log("Login Failed");
                status = false
                resolve(status)
            }
        })

    }
}

