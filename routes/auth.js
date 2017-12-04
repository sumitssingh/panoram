var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');
var ensureAuthenticated = require('../authMiddleWare');
// var bcrypt = require('bcrypt-nodejs');
// var helper = require('sendgrid').mail
var nodemailer = require('nodemailer');
var bcrypt = require('bcrypt-nodejs');
var async = require('async');
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
    if (!req.body.username || !req.body.password || !req.body.email) {
        return res.status(400).json({message: "Please fill the form"})
    }

    console.log(req.body);

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

router.use(ensureAuthenticated);
router.post('/forgot', function(req, res, next) {
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
        doc.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        doc.save(function(err) {
          done(err, token, doc);
        });
      });
    },
    function(token, doc, done) {
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'sumitsingh94310@gmail.com',
    pass: 'mom7488389320'
  }
});
console.log(req.body.email);
var mailOptions = {
   from:'sumitssingh943@gmail.com',
  to:req.body.email,
  subject: 'Reset Passwoord',
  text: ('text/plain','You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/#/reset/' + token + '\n\n' +
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


router.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      Doctor.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          return res.send('Password reset token is invalid or has expired.');
        }

        // user.password = req.body.password;
        user.setPassword(req.body.password);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

         user.save(function(err) {
          done(err, user);
        });
      });
    },
    function(user, done) {

var mailOptions = {
   from:'sumitssingh943@gmail.com',
  to:user.email,
  subject: 'Passwoord changed successfull',
  text: ('text/plain','Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed successfull.\n')
}
  // mail = new helper.Mail(from_email, subject, to_email, content)
 // from_email = new helper.Email('nocreepy@gmail.com')
 //  to_email = new helper.Email(user.email)
 //  subject = 'Passwoord changed successfull'
 //  content = new helper.Content('text/plain','Hello,\n\n' +
 //          'This is a confirmation that the password for your account ' + user.email + ' has just been changed successfull.\n');
 //  mail = new helper.Mail(from_email, subject, to_email, content)
 
 //  var sg = require('sendgrid')("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");
 //  var request = sg.emptyRequest({
 //    method: 'POST',
 //    path: '/v3/mail/send',
 //    body: mail.toJSON()
 //  });
 
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
// router.post('/reset/password', function(req, res) {
//       Doctor.findById(req.userId, function (err, doctor) {
//         if (!doctor) {
//           return res.send('invalid user.');
//         }

//         // user.password = req.body.password;
//         doctor.setPassword(req.body.password);

//          doctor.save(function(err,user) {
//             if (err) {
//                 res.send(err)
//             }else {
//                 res.send("Password Successfully Changed")
//             }
//         });
// });
// });




module.exports = router;
