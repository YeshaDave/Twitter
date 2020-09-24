// dummy commit
// another dummy commit
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var passport = require('passport');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var tweetsRouter = require('./routes/tweets');
var userprofileRouter = require('./routes/userprofile');
var listsRouter = require('./routes/lists');
var userfeedRouter = require('./routes/userfeed');
var bookmarks = require('./routes/bookmarks');
var messages = require('./routes/messages');
var analytics = require('./routes/analytics');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//use cors to allow cross origin resource sharing
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));

//All Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/tweets', tweetsRouter);
app.use('/userprofile', userprofileRouter);
app.use('/lists', listsRouter);
app.use('/userfeed', userfeedRouter);
app.use('/bookmarks', bookmarks);
app.use('/messages', messages);
app.use('/analytics', analytics);

app.use(passport.initialize());

// Bring in defined Passport Strategy
require('./passport')(passport);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
