var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressHbs = require('express-handlebars');
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var validator = require('express-validator');
var MongoStore = require('connect-mongo')(session);
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var io = require('socket.io');


var index = require('./routes/index');
var users = require('./routes/users');
var drivers = require('./routes/drivers');



var app = express();


// Socket.io
var io           = io();
app.io           = io;


// mongoose.connect('mongodb://127.0.0.1/hurrybox', { useMongoClient: true });

// // Get Mongoose to use the global promise library
// mongoose.Promise = global.Promise;
// //Get the default connection
// var db = mongoose.connection;

// //Bind connection to error event (to get notification of connection errors)
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));


mongoose.connect('mongodb://heroku_4h4s1l14:tfifr036mj4183fcdkjvoi7n24@ds111648.mlab.com:11648/heroku_4h4s1l14');
mongoose.Promise = global.Promise; 

require('./config/passportUser');
require('./config/passportDriver');


// view engine setup
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', 'hbs');

app.use(favicon(path.join(__dirname, 'public/images/', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(session({
  secret:'1q2w3e4r', 
  resave: false, 
  saveUninitialized: false,
  store: new MongoStore({mongooseConnection: mongoose.connection}),
  cookie: {maxAge: 180 * 60 * 1000} 
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  next();
});



io.on('connection', function (socket) {

  socket.on('createMessage', (message) => {
    io.emit('newMessage', {
      message : message
    });
  });

  socket.on('driverApproved', (approved) => {
    console.log(approved);
    io.emit('newApproved', {
      approved : approved
    });
  });
  
});



app.use('/users', users);
app.use('/drivers', drivers);
app.use('/', index);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);

  res.status(404);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
  // res.json({
  //   err : {
  //     message: err.message
  //   }
  //   });
});

module.exports = app;
