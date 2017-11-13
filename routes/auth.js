var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');
var ensureAuthenticated = require('../authMiddleWare');
// var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var config=require('../config.json');
var jwt=require('jwt-simple');
var Doctor = mongoose.model('Doctor');
var Hospital = mongoose.model('Hospital');
var jwt = require('jsonwebtoken');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/login', function(req, res, next){
    console.log(req.body);
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({message: 'Please fill out all fields'});
    }

    passport.authenticate('local', function(err, user, info){
        if (err) {
            return next(err)
        }
        if (user) {
            if (user.isSuspended) {
                res.send("User Suspended");
            }else {

                return res.json({status: "true", token: user.generateJwt(),userId: user._id, info:"Successfull LoggedIn" });
            }
        }
        else {
            return res.status(401).json(info);
        }
    })(req, res, next)
})
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
router.post('/register', function(req, res, next){
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({message: "Please fill the form"})
    }

    console.log(req.body);

    var doctor = new Doctor();

    doctor.username = req.body.username;
    // doctor.password = req.body.password;


    doctor.setPassword(req.body.password);

    doctor.save(function(err){
        if (err) {
            res.send({status: false, info:"Doctor with this username already exists"});
        }else {
            res.send({
                "status": true,
                'userId': doctor._id,
                'token': doctor.generateJwt(0),
                info: "Successfull SignedUp"
            });
        }
    });
});

router.use(ensureAuthenticated);
router.post('/reset/password', function(req, res) {
      Doctor.findById(req.userId, function (err, doctor) {
        if (!doctor) {
          return res.send('invalid user.');
        }

        // user.password = req.body.password;
        doctor.setPassword(req.body.password);

         doctor.save(function(err,user) {
            if (err) {
                res.send(err)
            }else {
                res.send("Password Successfully Changed")
            }
        });
});
});




module.exports = router;
