var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressHbs = require('express-handlebars');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var validator = require('express-validator');
var MongoStore = require('connect-mongo')(session);
var googleMapsClient = require('@google/maps').createClient({
  key:'AIzaSyDfSWT2soGD9bHWIFUobyndIa2YI1MVBmY'
});


var index = require('./routes/index');
var users = require('./routes/users');
var drivers = require('./routes/drivers');

var app = express();

// mongoose.connect('mongodb://127.0.0.1/hurrybox');
// // Get Mongoose to use the global promise library
// mongoose.Promise = global.Promise;
// //Get the default connection
// var db = mongoose.connection;

// //Bind connection to error event (to get notification of connection errors)
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));


mongoose.connect('mongodb://hurrybox:1q2w3e$R@cluster0-shard-00-00-qte2y.mongodb.net:27017,cluster0-shard-00-01-qte2y.mongodb.net:27017,cluster0-shard-00-02-qte2y.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin/hurrybox', {
    useMongoClient: true
});
mongoose.Promise = global.Promise; 

require('./config/passportUser');
require('./config/passportDriver');
// require('./config/distance');


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

app.use('/users', users);
app.use('/drivers', drivers);
app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
