'use strict';

var passport = require('passport'),
LocalStrategy = require('passport-local').Strategy,
md5 = require('MD5');

//After passport serializes the object, return the id
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

//Passport deserializes the user by id and returns the full user object.
passport.deserializeUser(function(id, done) {
    User.findOne({ id: id } , function (err, user) {
        done(err, user);
    });
});

//This is the holy grail of the strategy. When a request comes in
//we try and find the user by email and see if their passport
//is correct.
var verifyHandler = function(req, email, password, done) {
    process.nextTick(function() {
        User.findOne({ email: email }).exec(function(err, user) {
            if (err || !user) {
                return done(err);
            }

            var hashedPassword = md5(password);
            var match = (hashedPassword === user.password);

            if (!match) {
                return done(null, false, {message: 'Invalid Password'});
            }

            else {
                //The user's password is correct, so log them in.
                req.logIn(user, function(err) {
                    if (err) {
                        return done(null, false, {message: err});
                    }
                    return done(null, user, {message: 'Logged In Successfully'});
                })
            }
        });
    });
};

//Register the LocalStrategywith Passport.
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, verifyHandler));
