var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var Doctor = mongoose.model('Doctor');



passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    },
    function(username, password, done) {
        Doctor.findOne({ username: username }, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, { message:'Incorrect email'});
            }
            if (!user.validPassword(password)) {
                return done(null, false, {
                    message:'Invalid Password'
                });
            }
            return done(null,user);
        })
    }
));
