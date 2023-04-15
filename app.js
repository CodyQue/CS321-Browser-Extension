/**
 * 
 * This is the main front-page server that runs the back-end code. The code was inspired 
 * by the test express.js server file.
 * 
 */
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const PORT = 8000;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

let parcel = '';
let count = 0;

app.post('/users', (req, res) => {
  parcel = req.body.parcel;
  console.log(`Received parcel: ${parcel}`);
  res.send(parcel);
});

app.get('/test', (req, res) => {
  console.log(count);
  ++count;
  res.status(200).send('<h1>'+ parcel + '</h1>');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

app.listen(PORT, () => console.log("server running on PORT ${PORT}"))