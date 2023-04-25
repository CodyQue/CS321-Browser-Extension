/**
 * 
 * Tester for time.js
 * 
 */

const prompt = require("prompt-sync")();
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database('./schedule.db', sqlite3.OPEN_READWRITE, (err)=> {
    if (err) return console.error(err.message);
    console.log("Connected to database");
  });

