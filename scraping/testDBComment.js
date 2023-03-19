/**
 * 
 * This is for testing purposes only. DO NOT USE THIS CODE FOR IMPLEMENTATION.
 * This asks the user for a professor's name. After the user enters a professor's name, it will
 * check the database for their name. If it finds their name, then it will load their rating and reviews made about them.
 * 
 */
const prompt = require('prompt-sync')();
const sqlite3 = require("sqlite3").verbose();
let profName = "";
let URL = "";

function findProf(name)
{
    /**
     * Opens the database. Returns an error if database does not exist.
     */
    const db = new sqlite3.Database('./profURL.db', sqlite3.OPEN_READWRITE, (err)=> {
        if (err) return console.error(err.message);
        console.log("Connected to database");
    });
    /**
     * Finds professor in database
     */
    const sql = 'SELECT Professor_name, URL FROM Professor_Info WHERE Professor_name = "' + name + '"';
    db.all(sql, [], (err, rows) => {
        if (err) return console.error(err.message);
        /*rows.forEach((row) => {
            console.log(row);
        });*/
        profName = rows[0].Professor_name;
        URL = rows[0].URL;
        console.log("Prof Name: " + profName + ", URL: " + URL);
    });
}
function askUser()
{
    const name = prompt("What is the professor's name?: ");
    console.log(`Finding ${name}`);
    findProf(name);
}

askUser();