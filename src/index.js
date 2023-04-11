/**
 * 
 * For testing purposes to test the express.js library.
 * This uploads the data onto a localhost port 8000.
 * 
 * This will be used, for the front-end HTML file, to grab information
 * to display it to the UI
 * 
 */
const PORT = 8000;
const express = require('express');
const puppeteer = require("puppeteer");

const app = express()
const cors = require('cors')
app.use(cors())

app.get('/', function(req,res) {
    res.json('This is my Web Scraper');
})

let count = 0;
let i = 0;
while (i < 1000)
{
    app.get('/results', (req, res) => {
        (async () => {
            res.json(count);
            ++count;
        })();
    })
    
    app.listen(PORT, () => console.log("server running on PORT ${PORT}"))
}