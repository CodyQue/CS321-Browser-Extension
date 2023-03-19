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

const sql = 'DELETE FROM Professor_Info WHERE delValue = 1';

db.all(sql, [], (err, rows) => {
    if (err) return console.error(err.message);
});

console.log("Completed! Database deleted >:)");