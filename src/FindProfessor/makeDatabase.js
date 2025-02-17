/**
 * 
 * This file can be ignored when implementing browser extension.
 * This file creates and inserts data onto a database. 
 * The code can be edited to add more attributes.
 * 
 */

const fs = require('fs');
const sqlite3 = require("sqlite3").verbose();
let overallRating = 0;

const db = new sqlite3.Database('./profURL.db', sqlite3.OPEN_READWRITE, (err)=> {
    if (err) return console.error(err.message);
    console.log("Connected to database");
});

db.run('CREATE TABLE Professor_Info(Professor_name, URL, Overall_Rating)');
db.run('CREATE TABLE Professor_Courses(Professor_name, Course, Rating, Total_Rating)');
db.run('CREATE TABLE Professor_Comment(Professor_name, Comment)');

var count = 0;
fs.readFile('profNames.txt', 'utf8', (err, data) => {
    if (err) {
        console.error("File not found");
        return;
    }
    let temp = data.split('\n');
    for(let i = 0; i < temp.length; ++i)
    {
        let temp2 = temp[i].split(' ');
        if (temp2[2].includes("https://www.ratemyprofessors.com/search/teachers?query=")) //Professors with 2 names (first and last name)
        {
            let name = temp2[0] + " " + temp2[1];
            let URL = temp2[2];
            let rating = 0;
            const sql = "INSERT INTO Professor_Info (Professor_name, URL, Overall_Rating) Values(?,?,?)";
            db.run(sql, [name, URL, rating], (err)=>{
                if (err) return console.error(err.message);
            });
            console.log("Adding: " + name + " , Count: " + i+1);
        }
        else //This is for professors with 3 names (first, middle, and last name)
        {
            let name = temp2[0] + " " + temp2[2];
            let URL = temp2[3];
            let rating = 0;
            const sql = "INSERT INTO Professor_Info (Professor_name, URL, Overall_Rating) Values(?,?,?)";
            db.run(sql, [name, URL, rating], (err)=>{
                if (err) return console.error(err.message);
            });
            console.log("Adding: " + name + " , Count: " + i+1);
        }
        //++count;
        //console.log("Count: " + count + ", " + temp2);
    }
    //console.log(data);
});

console.log("Completed! Finished with making database");
db.close();