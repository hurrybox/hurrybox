var express = require('express');
var router = express.Router();
var Origin = require('../models/origin');
var Destination = require('../models/destination');
var Courier = require('../models/courier');
var passport = require('passport');
var googleMapsClient = require('@google/maps').createClient({
  key:'AIzaSyDfSWT2soGD9bHWIFUobyndIa2YI1MVBmY',
  Promise: Promise // 'Promise' is the native constructor.
});
// var matrix = require('../config/distance');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'HurryBox' });
});

router.get('/origin', (req, res, next) => {
  res.redirect('/');
})

router.post ('/origin', (req, res, next) => {
  var sessionData = req.session;
  sessionData.origin = new Origin ({
          name : req.body.nameOrigin,
          phone :req.body.phoneOrigin,
          route : req.body.routeOrigin,
          streetNumber :req.body.street_numberOrigin,
          locality : req.body.localityOrigin,
          postalCode : req.body.postal_codeOrigin,
          text : req.body.textOrigin
        });

console.log(sessionData.origin);
res.redirect('/');
});

router.get('/destination', (req, res, next) => {
res.redirect('/');
})

router.post ('/destination', (req, res, next) => {
var sessionData = req.session;
sessionData.destination = new Destination ({
        name : req.body.nameDestination,
        phone :req.body.phoneDestination,
        route : req.body.routeDestination,
        streetNumber :req.body.street_numberDestination,
        locality : req.body.localityDestination,
        postalCode : req.body.postal_codeDestination,
        text : req.body.textDestination
      });

      //distance matrix στον server

        googleMapsClient.distanceMatrix({
        origins: [req.session.origin.name],
        destinations: [sessionData.destination.name],
        units: 'metric',
        mode: 'driving'
          }).asPromise()
          .then((response) => {
            console.log(response);
          })
          .catch((err) => {
            console.log(err);
          });



console.log(sessionData.destination);
res.redirect('/');
  });


router.get('/courier', (req, res, next) => {
  res.redirect('/');
});


router.post('/courier', isLoggedIn, (req, res, next) => {

  var origin = new Origin(req.session.origin);
  origin.save(function (err) {
    if (err) return console.log(err);
    // thats it!
  });

  var destination = new Destination(req.session.destination);
  destination.save(function (err) {
    if (err) return console.log(err);
    // thats it!
  });
  
  var courier = new Courier({
    origin : origin._id,
    destination : destination._id,
    price : req.body.price,
    weight : req.body.weight,
    status : '1',
    duration : req.body.duration,
    distance : req.body.distance,
    // user : user._id,
    // driver : driver._id,
  });

  req.session.courier = courier;
  courier.save(function (err) {
    if(err) return console.log('coureir error' + err);
  });

  res.redirect('/');
});


router.get('/clear', (req, res, next) => {
  req.session.destroy();
  res.redirect('/');
})

module.exports = router;


function isLoggedIn (req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect('/users/signin/');
}