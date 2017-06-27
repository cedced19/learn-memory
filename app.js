var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var compress = require('compression');

var passport = require('passport');
var hash = require('password-hash-and-salt');
var flash = require('connect-flash');
var helmet = require('helmet');
var session = require('express-session');

var MongoDBStore = require('connect-mongodb-session')(session);
var LocalStrategy = require('passport-local').Strategy;

var index = require('./routes/index');
var lessons = require('./routes/lessons-api');
var users = require('./routes/users-api');
var registrants = require('./routes/registrants-api');
var version = require('./routes/version-api');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(compress());

if (app.get('env') === 'development') {
  app.use(logger('dev'));
}

app.use(express.static(path.join(__dirname, 'public')));

app.use(helmet());
app.use(flash());
app.use(session({
    secret: 'just learn faster',
    name: 'learn-memory-session',
    proxy: false,
    resave: true,
    saveUninitialized: true,
    store: new MongoDBStore({
      uri: 'mongodb://localhost:27017/sails',
      collection: 'sessions'
    })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);
app.use('/api/version', version);
app.use('/api/users', users);
app.use('/api', lessons);
app.use('/api/registrants', registrants);

// authentication
passport.serializeUser(function(model, done) {
      done(null, model.id);
});

passport.deserializeUser(function(id, done) {
      app.models.users.findOne({ id: id }, function (err, model) {
          delete model.password;
          done(err, model);
      });
});

// define local strategy
passport.use('local', new LocalStrategy({
      usernameField: 'name',
      passwordField: 'password'
},
function(name, password, done) {
        // search in database
        app.models.users.findOne({ name: name }, function (err, model) {
          if (err) { return done(err); }
          if (!model) {
            return done(null, false, { message: 'Incorrect name.' });
          }
          // test password
          hash(password).verifyAgainst(model.password, function(err, verified) {
              if(err || !verified) {
                return done(null, false, {
                    message: 'Invalid password.'
                });
              } else {
                var returnmodel = {
                    email: model.email,
                    id: model.id
                  };
                  return done(null, returnmodel, {
                    message: 'Logged in successfully.'
                  });
              }
          });
        });
}));

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
