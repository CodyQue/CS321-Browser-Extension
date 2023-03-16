/**
 * 
 * This file can be ignored. This is for viewing the database (queries, attributes, etc)
 * 
 */

const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database('./profURL.db', sqlite3.OPEN_READWRITE, (err)=> {
    if (err) return console.error(err.message);
    console.log("Connected to database");
});

const sql = 'SELECT * FROM Professor_Info';

db.all(sql, [], (err, rows) => {
    if (err) return console.error(err.message);
    rows.forEach((row) => {
        console.log(row);
    });
});