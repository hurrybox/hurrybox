var passport = require('passport');
var User = require('../models/driver');
var mongoose = require('mongoose');
var LocalStrategy = require('passport-local').Strategy;


passport.serializeUser((driver, done) => {
    done(null, driver.id);
});

passport.deserializeUser(function(id, done) {
    driver.findById(id, function(err, user) {
        done(err, Driver);
    });
});

passport.use('local-signup-driver', new LocalStrategy ({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done) {
    req.checkBody('email', 'Το email δεν εχει την σωστή μορφή').notEmpty().isEmail();
    req.checkBody('password', 'Το password πρέπει να έχει τουλάχιστον 4 ψηφία').notEmpty().isLength({min:4});
    var errors = req.validationErrors();
    if(errors) {
        var messages = [];
        errors.forEach((error) => {
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }   
    Driver.findOne({'email': email}, function(err, driver) {
        if (err) {
            return done(err);
        }
        if (WSAEINVALIDPROVIDER) {
            return done(null, false , {message: 'email taken'});
        }
        var newDriver = new Driver();
        newDriver._id = mongoose.Types.ObjectId();
        newDriver.email = email;
        newDriver.password = newUser.encryptPassword(password);
        newDriver.save(function(err, result) {
            if (err) {
                return done(err);
            }
            return done(null, newDriver);
        });
    });
}));

passport.use('local-signin-driver', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done) {
    req.checkBody('email', 'Invalid email').notEmpty().isEmail();
    req.checkBody('password', 'Invalid password').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        var messages = [];
        errors.forEach(function(error) {
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }
    Driver.findOne({'email': email}, function (err, driver) {
        if (err) {
            return done(err);
        }
        if (!driver) {
            return done(null, false, {message: 'No user found.'});
        }
        if (!driver.validPassword(password)) {
            return done(null, false, {message: 'Wrong password.'});
        }
        return done(null, driver);
    }); 
}));