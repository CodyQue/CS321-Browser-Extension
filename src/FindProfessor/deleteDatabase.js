/**
 * 
 * DO NOT USE THIS CODE FOR IMPLEMENTATION. This is strictly used for testing purposes.
 * This deletes the database.
 * 
 */
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database('./profURL.db', sqlite3.OPEN_READWRITE, (err)=> {
    if (err) return console.error(err.message);
    console.log("Connected to database");
});

let sql = 'DROP TABLE Professor_Info';

db.all(sql, [], (err, rows) => {
    if (err) return console.error(err.message);
});

sql = 'DROP TABLE Professor_Courses';
db.all(sql, [], (err, rows) => {
    if (err) return console.error(err.message);
});

sql = 'DROP TABLE Professor_Comment';
db.all(sql, [], (err, rows) => {
    if (err) return console.error(err.message);
});

console.log("Completed! Database deleted >:)");