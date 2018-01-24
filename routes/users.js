var express = require('express');
var router = express.Router();
var passport = require('passport');
var nodemailer = require('nodemailer');
var async = require('async');
var crypto = require('crypto');
var User = require('../models/user');

router.get ('/profile', isLoggedIn, (req, res, next) => {
  res.render('users/profile')
});


router.get('/logout', isLoggedIn, function (req, res, next) {
  req.logout();
  res.redirect('/');
});

router.use('/', notLoggedIn, function (req, res, next) {
  next();
});


router.get ('/signup', (req, res, next) => {
  var messages = req.flash('error');
  res.render('users/signup', {title: 'HurryBox', messages: messages, hasErrors: messages.length > 0 });
});

router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: 'profile',
  failureRedirect: 'signup',
  failureFlash: true
}));


router.get ('/signin', (req, res, next) => {
  var messages = req.flash('error');
  res.render('users/signin', {title: 'HurryBox', messages: messages, hasErrors: messages.length > 0 });
});

router.post('/signin', passport.authenticate('local-signin', {
  successRedirect: 'profile',
  failureRedirect: 'signin',
  failureFlash: true
}));


router.get('/forgot', (req, res) => {
  res.render('users/forgot', {
    user: req.user
  });
});

router.post('/forgot', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email }, function(err, user) {
        if (err) {
          return done(err);
        }
        if (user) {
          return done(null, false , {message: 'Δες το email σοu'});
        }
        if (!user) {
          return (done, false, {message: 'No user found.'});
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: 'hurrybox',
          pass: '1q2w3e$R'
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'hurryboxgr@gmail.com',
        subject: 'Node.js Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
  });
});


router.get('/reset/:token', function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('users/forgot');
    }
    res.render('users/reset', {
      user: req.user
    });
  });
});


router.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        user.save(function(err) {
          req.logIn(user, function(err) {
            done(err, user);
          });
        });
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: 'hurrybox',
          pass: '1q2w3e$R'
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'passwordreset@demo.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/');
  });
});



module.exports = router;


function isLoggedIn (req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

function notLoggedIn (req, res, next) {
  if(!req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}
