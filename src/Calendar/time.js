/**
 * 
 * This file is used for inserting a task in the browser extension.
 * The user puts down the task, and it gets put onto a database.
 * 
 */
const prompt = require("prompt-sync")();
const sqlite3 = require("sqlite3").verbose();

function dateMath(testDate) {
  const total = Date.parse(testDate) - Date.parse(new Date());
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));

  return {
    days,
    hours,
    minutes,
    seconds,
  };
}
//Make minutes on 15 minute intervals
//Accept multiple dates (DONE)
//Allow user to change time for urgent reminder
//Ask user for names and descriptions of the tasks
function getTime() 
{
  const db = new sqlite3.Database('./schedule.db', sqlite3.OPEN_READWRITE, (err)=> {
    if (err) return console.error(err.message);
    console.log("Connected to database");
  });
  var run = 0;
  const userName = prompt("What is the name of the assignment? ");
    const userDesc = prompt("What is the description of the assignment? ");
    const userYear = prompt("What year is the assignment due? ");
    const userMonth = prompt("What Month is the assignment due? ");
    const userDay = prompt("What Day is the assignment due? ");
    var userHour = prompt("What Hour is the assignment due? ");
    var userMinute = prompt("What Minute is the assignment due? ");

    //Adds the data to the database
    const sql = "INSERT INTO User_Schedule(Name, Description, Year, Month, Day, Hour, Minutes) Values(?,?,?,?,?,?,?)";
    db.run(sql, [userName, userDesc, userYear, userMonth, userDay, userHour, userMinute], (err)=>{
      if (err) return console.error(err.message);
    });

    /*if (userMinute >= 0 && userMinute < 16) {
      userMinute = 15;
    }
    if (userMinute >= 16 && userMinute < 31) {
      userMinute = 30;
    }
    if (userMinute >= 31 && userMinute < 46) {
      userMinute = 45;
    }
    if (userMinute >= 46 && userMinute < 61) {
      userMinute = 0;
      userHour + 1;
    }*/
    var testDate = new Date(
      userYear,
      userMonth - 1,
      userDay,
      userHour,
      userMinute,
      0,
      0
    );
    let result = dateMath(testDate);
    if (Date.parse(testDate) - Date.parse(new Date()) < 0) {
      console.log("Date in the past");
    } else if (Date.parse(testDate) - Date.parse(new Date()) < 3600000 * 72) {
      console.log("This is Urgent!");
      console.log("Time until due:");
      console.log(result);
    } else {
      console.log("Time until due:");
      console.log(result);
    }
}
getTime();
