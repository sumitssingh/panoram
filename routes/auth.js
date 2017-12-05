var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');
var bcrypt = require('bcrypt-nodejs');
var async = require('async');
var crypto = require('crypto');
var config=require('../config.json');
var jwt=require('jwt-simple');
var Doctor = mongoose.model('Doctor');
var Hospital = mongoose.model('Hospital');
var jwt = require('jsonwebtoken');


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
router.post('/register', function(req, res, next){
    if (!req.body.username || !req.body.password || !req.body.email) {
        return res.status(400).json({message: "Please fill the form"})
    }
    var doctor = new Doctor();

    doctor.username = req.body.username;
    doctor.email = req.body.email;

    doctor.setPassword(req.body.password);

    doctor.save(function(err){
        if (err) {
            res.send({status: false, err: err,  info:"Doctor with this username already exists"});
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

// router.use(ensureAuthenticated);
router.post('/forgot/password', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      Doctor.findOne({ email: req.body.email }, function(err, doc) {
        if (!doc) {

          return res.send({"msg": "Invalid Email"});
        }

        doc.resetPasswordToken = token;
        doc.resetPasswordExpires = Date.now() + 3600000;

        doc.save(function(err) {
          done(err, token, doc);
        });
      });
    },
    function(token, doc, done) {
    var transporter = nodemailer.createTransport({

      service: 'gmail',
      auth: {
        user: 'testpanoramaortho@gmail.com',
        pass: 'panoramaortho'
      }
    });
    var mailOptions = {
        from:'oncall@panoramaortho.com',
        to:req.body.email,
        subject: 'Reset Passwoord',
        text: ('text/plain','You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
              'Please use the following token, to complete the process:\n\n' +
               token + '\n\n' +
              'If you did not request this, please ignore this email and your password will remain unchanged.\n')
    } 
    transporter.sendMail(mailOptions, function(error, response) {
    res.send('An e-mail has been sent to ' + doc.email + ' with further instructions.')
    done(error, 'done');
    })
    }
  ], function(err) {
    if (err) 
    res.send(err);
  });
});

router.post('/reset/password', function(req, res) {
  async.waterfall([
    function(done) {
      Doctor.findOne({ resetPasswordToken: req.body.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          return res.send('Password reset token is invalid or has expired.');
        }
        user.setPassword(req.body.password);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        user.save(function(err) {
          done(err, user);
        });
      });
    },
    function(user, done) {
    var transporter = nodemailer.createTransport({

      service: 'gmail',
      auth: {
        user: 'testpanoramaortho@gmail.com',
        pass: 'panoramaortho'
      }
    });
var mailOptions = {
    from:'oncall@panoramaortho.com',
    to:user.email,
    subject: 'Passwoord changed successfull',
    text: ('text/plain','Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed successfull.\n')
}
transporter.sendMail(mailOptions, function(error, response) {
    res.send('Success! Your password has been changed.')
    done(error, 'done');
})
    }
  ], function(err) {
    if (err) 
    res.send(err);
  });
});


module.exports = router;
