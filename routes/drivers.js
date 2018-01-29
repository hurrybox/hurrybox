var express = require('express');
var router = express.Router();
var passport = require('passport');
var nodemailer = require('nodemailer');
var async = require('async');
var crypto = require('crypto');
var Driver = require('../models/driver');


router.get ('/dashboard', isLoggedIn, (req, res, next) => {
  res.render('drivers/dashboard')
});


router.get('/logout', isLoggedIn, function (req, res, next) {
  req.logout();
  res.redirect('drivers/index');
});

router.use('/', notLoggedIn, function (req, res, next) {
  next();
});

/* GET home page. */
router.get('/', (req, res, next) => {
  var messages = req.flash('error');
  res.render('drivers/index', { title: 'HurryBox', layout: 'layoutDriver.hbs',  messages: messages, hasErrors: messages.length > 0 });
});

router.post('/', passport.authenticate('local-signup-driver', {
  successRedirect: 'signup',
  failureRedirect: 'index',
  failureFlash: true
}));


router.get ('/signup', (req, res, next) => {
  var messages = req.flash('error');
  res.render('drivers/signup', {title: 'HurryBox', messages: messages, hasErrors: messages.length > 0 });
});

router.post('/signup', (req, res, next) => {
  Driver.findByIdAndUpdate(id, 
    {firstName: req.body.firstName,
      lastName: req.body.lastName,
      phone: req.body.phone,
      vahicle: req.body.vahicle,
      licensePlate : req.body.licensePlate },
      (err, driver) => {
        if(err) {
          console.log(err);
        }
      });
      

  res.redirect('/dashboard');
});


router.get ('/signin', (req, res, next) => {
  var messages = req.flash('error');
  res.render('drivers/signin', {title: 'HurryBox', messages: messages, hasErrors: messages.length > 0 });
});

router.post('/signin', passport.authenticate('local-signin-driver', {
  successRedirect: 'dashboard',
  failureRedirect: 'signin',
  failureFlash: true
}));


router.get('/forgot', (req, res) => {
  res.render('drivers/forgot', {
    driver: req.driver
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
      Driver.findOne({ email: req.body.email }, function(err, driver) {
        if (err) {
          return done(err);
        }
        if (driver) {
          return done(null, false , {message: 'Δες το email σοu'});
        }
        if (!driver) {
          return (done, false, {message: 'No driver found.'});
        }

        driver.resetPasswordToken = token;
        driver.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        driver.save(function(err) {
          done(err, token, driver);
        });
      });
    },
    function(token, driver, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: 'hurrybox',
          pass: '1q2w3e$R'
        }
      });
      var mailOptions = {
        to: driver.email,
        from: 'hurryboxgr@gmail.com',
        subject: 'Node.js Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('info', 'An e-mail has been sent to ' + driver.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
  });
});


router.get('/reset/:token', function(req, res) {
  Driver.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, driver) {
    if (!driver) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('drivers/forgot');
    }
    res.render('drivers/reset', {
      driver: req.driver
    });
  });
});


router.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      Driver.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, driver) {
        if (!driver) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }

        driver.password = req.body.password;
        driver.resetPasswordToken = undefined;
        driver.resetPasswordExpires = undefined;

        driver.save(function(err) {
          req.logIn(driver, function(err) {
            done(err, driver);
          });
        });
      });
    },
    function(driver, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: 'hurrybox',
          pass: '1q2w3e$R'
        }
      });
      var mailOptions = {
        to: driver.email,
        from: 'passwordreset@demo.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + driver.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/drivers');
  });
});




module.exports = router;


function isLoggedIn (req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect('/drivers');
}

function notLoggedIn (req, res, next) {
  if(!req.isAuthenticated()) {
    return next();
  }
  res.redirect('/drivers');
}
