var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var fileUpload = require('express-fileupload');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var jwt = require('express-jwt');
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

var mongoose = require('mongoose');

var dbHost = process.env.DB_HOST || 'localhost'
var dbPort = process.env.DB_PORT || 27017;
var dbName = process.env.DB_NAME || 'scribecare';

// var dbURL = 'mongodb://'+dbHost+':'+dbPort+'/'+dbName;
var dbURL = process.env.MONGODB_URI || ('mongodb://'+dbHost+':'+dbPort+'/'+dbName);

mongoose.connect(dbURL, {
  useMongoClient: true
});

// models
var doctor = require('./models/Doctors');
var scriber = require('./models/Scribers');
// end of models

var passport = require('passport');
var passportConfig = require('./config/passport');
var config = require('./config/config');

var user = require('./routes/user');
var index = require('./routes/index');

var app = express();
var mailer = require('express-mailer');

mailer.extend(app, config.mailerOptions);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(fileUpload());

app.use('/', index);
app.use('/api/doctors', user);
app.use('/api/scribers', user);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
