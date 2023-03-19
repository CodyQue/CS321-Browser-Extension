const fs = require('fs');
const puppeteer = require('puppeteer');

function executeToPage(URL)
{
    console.log("Begin");
    (async () => {
        const browser = await puppeteer.launch({headless: false, defaultViewport: false, userDataDir: "./tmp"});
        const page = await browser.newPage();
        await page.goto('URL');
        var hrefs = await page.$$eval('a', as=>as.map(a=>a.href));
        //console.log("total num of links- " + hrefs.length);
        for(let i = 0; i < hrefs.length; ++i)
        {
            if (hrefs[i].includes('https://www.ratemyprofessors.com/professor/') == true) //Finds professor's page
            {
                console.log("FOUND PROF PAGE");
                await page.goto(hrefs[i]); //Goes to page
                const comments = await page.evaluate(() => document.body.innerText);
                console.log(comments);
                break;
            }
            console.log(i+1+". ", hrefs[i]);
        }
        await browser.close();
    })();
}

/*fs.readFile('test.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(data);
});*/