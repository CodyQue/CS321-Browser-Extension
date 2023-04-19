/**
 * 
 * This file can be ignored when implementing browser extension. 
 * This is for viewing the contents of the database (queries, attributes, etc)
 * 
 */

const sqlite3 = require("sqlite3").verbose();
const prompt = require('prompt-sync')();

const db = new sqlite3.Database('./profURL.db', sqlite3.OPEN_READWRITE, (err)=> {
    if (err) return console.error(err.message);
    console.log("Connected to database");
});

let input = prompt("What is the professor's name?: ");
let sql = '';

console.log(input);
if (input == 'all')
{
    sql = 'SELECT * FROM Professor_Info';
}
else if (input == 'update')
{
    sql = 'UPDATE Professor_Info SET Overall_Rating = 0 WHERE Professor_name = "Kevin Andrea"';
}
else
{
    sql = "SELECT * FROM Professor_Info WHERE Professor_name = '" + input + "'";
}

console.log(sql);

let count = 0;

db.all(sql, [], (err, rows) => {
    if (err) return console.error(err.message);
    rows.forEach((row) => {
        console.log(row);
        ++count;
    });
    console.log(count);
});