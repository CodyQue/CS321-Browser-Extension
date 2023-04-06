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

app.get('/results', (req, res) => {
    (async () => {
        const browser = await puppeteer.launch({headless: true, defaultViewport: false, userDataDir: "./tmp"});
        const page = await browser.newPage();
        await page.goto('https://www.ratemyprofessors.com/professor?tid=2366288');
        //await page.goto('https://www.ratemyprofessors.com/professor?tid=2637066');
        try { //Sometimes, the website "Rate My Professor" has a cookies page, so this is used to bypass that
            await page.click("#close");
        }
        catch(error)
        {
            console.log("Page does not have cookies page");
        }
        const comments = await page.evaluate(() => document.body.innerText);
        var arr = comments.split("\n");
        res.json(arr);
        //organizeComments(arr);
        console.log("Done");
        await browser.close();
    })();
})

app.listen(PORT, () => console.log("server running on PORT ${PORT}"))