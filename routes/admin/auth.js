
var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');
// var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var config=require('../../config.json');
var jwt=require('jwt-simple');
var Doctor = mongoose.model('Doctor');
// var Hospital = mongoose.model('Hospital');
var jwt = require('jsonwebtoken');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});
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
        isAdmin: true,
        exp:parseInt(exp.getTime() /5000),
    },'secret');
}

module.exports = router;
