
var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');
// var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var config=require('../../config.json');
var jwt=require('jwt-simple');
var Doctor = mongoose.model('Doctor');
var Hospital = mongoose.model('Hospital');
var jwt = require('jsonwebtoken');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

// router.post('/login', function(req, res, next){
//     if (!req.body.username || !req.body.password) {
//         return res.status(400).json({message: 'Please fill out all fields'});
//     }
//
//     passport.authenticate('local', function(err, user, info){
//         if (err) {
//             return next(err)
//         }
//         if (user) {
//             if (user.isSuspended) {
//                 res.send("User Suspended");
//             }else {
//
//                 return res.json({token: user.generateJwt(),userId: user._id});
//             }
//         }
//         else {
//             return res.status(401).json(info);
//         }
//     })(req, res, next)
// })
// router.post('/login', function (req, res)
// {
//     Doctor.findOne({'name': req.body.username}, function (err, loginData) {
//
//         if (loginData) {
//             var data = bycrypt.compareSync(req.body.password, loginData.password);
//             if (data) {
//                 var token = loginData.generateJwt(0);
//
//                 var dataObj = {};
//                 dataOb = {
//                     "_id": loginData._id,
//                     "email": loginData.email,
//                     "name": loginData.username
//                 };
//                 res.send({status: true, token: token, info: "Password match", userData: dataObj});
//             }
//             else {
//                 res.send({status: false, info: "Invalid Credentials"})
//             }
//         }
//         else {
//             res.send({status: false, info: "Invalid Mobile No"});
//         }
//     })
//
// });
router.post('/login', function(req, res, next){
    console.log(req.body);
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({message: "Please fill the form"})
    }

    req.body.email = req.body.email.toLowerCase();
    req.body.password = req.body.password.toLowerCase();
    console.log(req.body);
    if (req.body.email == config.admin.username && req.body.password === config.admin.password) {
        res.send({
            "status": true,
            'token': generateJwt(req.body),
            info: "Successfull SignedUp"
        });
    } else {
        res.send({status: false, info: "For this service you must have admin permission"})
    }
});
function generateJwt (data) {

    var today = new Date();
    var exp = new Date(today);
    exp.setDate(today.getDate() + 60);


    return jwt.sign({
        // _id: this._id,
        isAdmin: true,
        exp:parseInt(exp.getTime() /5000),
    },'secret');
}

module.exports = router;
