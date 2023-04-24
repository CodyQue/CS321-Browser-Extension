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
const courseRandomizer= require("./src/CourseGenerator/findCourses");
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
let lock = 1;

app.post('/users', (req, res) => {
  parcel = req.body.parcel;
  console.log(parcel);
  if (parcel.includes("generateSchedule"))
  {
    let arr = parcel.split('/');
    arr.pop();
    //console.log("Generating schedule");
    courseRandomizer.generateSetup(arr);
    (async () => {
      while(courseRandomizer.schedule.length == 0)
      {
        console.log("NEW Waiting");
        console.log(courseRandomizer.schedule);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      parcel = courseRandomizer.schedule;
      //res.redirect('/interface/result.html');
      console.log("DONE")
    })();
    //console.log("DOne");
  }
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

module.exports = {
  lock:lock
};

app.listen(PORT, () => console.log("server running on PORT ${PORT}"))