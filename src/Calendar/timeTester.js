/**
 * 
 * Tester for time.js
 * 
 */
const prompt = require("prompt-sync")();
const sqlite3 = require("sqlite3").verbose();

const month = prompt("Enter a month (Recommend the current month for accurate testing ");
const day = prompt("Enter a day (Recommend the current day for accurate testing ");
const hour = prompt("Enter an hour ");
const minute = prompt("Enter a minute ");

const db = new sqlite3.Database('./schedule.db', sqlite3.OPEN_READWRITE, (err)=> {
    if (err) return console.error(err.message);
    console.log("Connected to database");
  });

let sql = 'DELETE FROM User_Schedule';

db.all(sql, [], (err, rows) => {
  if (err) return console.error(err.message);
});

sql = "INSERT INTO User_Schedule(Name, Description, Year, Month, Day, Hour, Minutes) Values(?,?,?,?,?,?,?)";
    db.run(sql, ["Dog", "Walk the dog", 2023, month, day, hour, minute], (err)=>{
      if (err) return console.error(err.message);
    });