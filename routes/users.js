var express = require('express');
var router = express.Router();
var passport = require('passport');

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
