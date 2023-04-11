/**
 * 
 * This file can be ignored when implementing browser extension.
 * This file creates and inserts data onto a database. 
 * The code can be edited to add more attributes.
 * 
 */

const fs = require('fs');
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database('./schedule.db', sqlite3.OPEN_READWRITE, (err)=> {
    if (err) return console.error(err.message);
    console.log("Connected to database");
});

db.run('CREATE TABLE User_Schedule(Name, Description, Year, Month, Day, Hour, Minutes)');

console.log("Completed! Finished with making database");
db.close();