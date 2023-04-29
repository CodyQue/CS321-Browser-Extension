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
const findProf = require("./src/FindProfessor/comments");
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
let parcel2 = '';
let parcel3 = '';
let count = 0;
let lock = 1;

app.post('/users', (req, res) => {
  if (req.body.parcel.includes("generateSchedule"))
  {
    let arr = req.body.parcel.split('/');
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
  else if (req.body.parcel.includes("findProfessor"))
  {
    parcel2 = "";
    let arr = req.body.parcel.split('/');
    console.log("Finding professor: " + arr[0] + ", Arr: " + findProf.profInfoArr);
    findProf.startFindingProfessor(arr[0]);
    (async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      while(findProf.profInfoArr.length == 0)
      {
        console.log("NEW Waiting for professor rating");
        await new Promise(resolve => setTimeout(resolve, 10000));
      }
      await new Promise(resolve => setTimeout(resolve, 28500));
      for(let i = 0; i < findProf.profInfoArr.length; ++i)
      {
        console.log("GOING THROUGH LOOP");
        parcel2 += findProf.profInfoArr[i] + "/";
      }
      //parcel2 = findProf.profInfoArr;
      console.log("DONE")
    })();
  }
  else if (req.body.parcel.includes("importSchedule"))
  {
    parcel3 = parcel.substring(0, parcel.length-13);
    console.log(parcel3);
  }
  console.log(`Received parcel: ${parcel}`);
  res.send(parcel);
});

app.get('/test3', (req, res) => { //For importing schedule to front-end
  res.status(200).send('<h1>'+ parcel3 + '</h1>');
});

app.get('/test2', (req, res) => { //For finding professor info
  res.status(200).send('<h1>'+ parcel2 + '</h1>');
  findProf.resetProfessorInfo;
  while(findProf.profInfoArr.length!=0)
  {
    findProf.profInfoArr.pop();
  }
  console.log("Reset done: " + findProf.profInfoArr);
});

app.get('/test', (req, res) => { //For course generating
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