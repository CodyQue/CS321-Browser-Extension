/**
 * 
 * commentScraper.js is used for scraping comments and reviews made 
 * from Professors through the website "Rate My Professor".
 * 
 */

const prompt = require('prompt-sync')();
const puppeteer = require("puppeteer");
const fs = require('fs');

let overallRating = 0;
let profInfoArr = [];
let arrLock = 1;

/**
 * Organizes all the comments into a 2D array
 * @param {*} arr 
 */
function organizeComments(arr)
{
    console.log("Organizing comments\n");
    //console.log(arr);
    const newArr = [];
    let max = arr.length;
    let i = 0;
    let added = 0, found = 0;
    let count = 0;
    while (i < max && count < 2)
    {
        let foundComment = false;
        const newArr2 = [];
        if (arr[i] == 'QUALITY')
        {
            ++found;
            let j = 20;
            let quality = 0;
            while (j > -5)
            {
                /**
                 * 
                 * Goes through this order
                 * Textbook, grade, would take again, attendance, for credit
                 * 
                 */
                if ((arr[i+j].includes('Online Class:')) || ((arr[i+j].includes('Textbook:')) || (arr[i+j].includes('Grade:')) || (arr[i+j].includes('Would Take Again:')) || (arr[i+j].includes('Attendance:')) || (arr[i+j].includes('For Credit:'))) && (foundComment == false) ) //Finds comment 
                {
                    newArr2.push(arr[i+j+1]);
                    ++added;
                    foundComment = true;
                    break;
                }
                --j;
            }
            if (foundComment == true)
            {
                newArr2.push(arr[i + 1]); //adds the rating of the comment
                newArr2.push(arr[i + 4]); //adds the course
                newArr2.push(arr[i + 7]); //adds the data
                newArr.push(newArr2); //adds it to main array
                profInfoArr.push(newArr2);
                ++count;
            }
        }
        foundComment = false;
        ++i;
    }
    arrLock = 0;
    console.log(newArr);
    return newArr;
}

/**
 * Converts the array into a hash table. This is used to organize the comments made for each course.
 * Keys are the courses, while the value is an 2D array containing the comment, rating, and date.
 * @param {*} arr 
 */
function putInMap(arr)
{
    let newMap = new Map();
    let mapRating = new Map();
    for(let i = 0; i < arr.length; ++i)
    {
        const newArr = [];
        newArr.push(arr[i][0]); //Adds the comment
        newArr.push(arr[i][1]); //Adds the rating
        newArr.push(arr[i][3]); //Adds the date
        if (newMap.has(arr[i][2]) == false) //Adds a new course to the map
        {
            const newArr2 = [];
            newArr2.push(newArr);
            newMap.set(arr[i][2], newArr2);
        }
        else
        {
            let newArr2 = newMap.get(arr[i][2]); //Gets from the map
            newArr2.push(newArr); //Pushes a new comment array
            newMap.set(arr[i][2], newArr2); //Puts it back in the map
        }
    }
    console.log(newMap);
}

/**
 * 
 *  This function navigates through the search tab to find the professor.
 *  It finds the right professor that goes to GMU.
 * 
 */
function findProfAndRating(name, URL)
{
    console.log("Begin 1");
    (async () => {
        const browser = await puppeteer.launch({headless: true, defaultViewport: false, userDataDir: "./tmp"});
        const page = await browser.newPage();
        await page.goto(URL);
        try //Rate My Professor has a "cookies" page when new user goes to the website. This clicks the "close" button if this shows up
        {
            const closeButton = await page.$('.Buttons__Button-sc-19xdot-1.CCPAModal__StyledCloseButton-sc-10x9kq-2.gvGrz');
            await closeButton.click();
        }
        catch(error)
        {
            console.log("No button exists");
        }
        const t = await page.evaluate(() => document.body.innerText);
        var x = t.split("\n");
        let profCount = -1;
        let profCount2 = 0;
        //console.log(x);
        var n = name.split(" ");
        //console.log(n);
        for(let i = 0; i < x.length; ++i) //Finds the number of professors in the search
        {
            if (x[i].includes(n[0]) == true && x[i].includes(n[n.length-1]) == true)
            {
                profCount++;
                if (x[i+2].includes("George Mason University")) //Finds the rating of professor that is in GMU
                {
                    overallRating = parseFloat(x[i-2]);
                    break;
                }
            }
        }
        var hrefs = await page.$$eval('a', as=>as.map(a=>a.href));
        //console.log("total num of links- " + hrefs.length);
        for(let i = 0; i < hrefs.length; ++i)
        {
            if (hrefs[i].includes('https://www.ratemyprofessors.com/professor/') == true) //Finds professor's page
            {
                ++profCount2;
                if (profCount2 == profCount)
                {
                    //console.log("FOUND PROF PAGE");
                    await page.goto(hrefs[i]); //Goes to page
                    try{
                        while(true)
                        {
                            await page.click('button.Buttons__Button-sc-19xdot-1.PaginationButton__StyledPaginationButton-txi1dr-1.gjQZal');
                            console.log("EXPANDED");
                            await new Promise(resolve => setTimeout(resolve, 2000));
                        }
                    }
                    catch(error)
                    {
                        console.log("NOT EXPANDED");
                    }
                    await new Promise(resolve => setTimeout(resolve, 5000));
                    const comments = await page.evaluate(() => document.body.innerText);
                    //console.log(comments);
                    var arr = comments.split("\n");
                    profInfoArr.push(overallRating);
                    arr = organizeComments(arr);
                    //putInMap(arr);
                   
                    console.log(profInfoArr);
                    break;
                }
            }
            //console.log(i+1+". ", hrefs[i]);
        }
        await browser.close();
    })();
}

function askUser()
{
    //profName = prompt("What is the professor's name?: ");
    //console.log(`Finding ${profName}`);
    //findProfInDatabase(profName, "profURL.db");
    fs.readFile('profNames.txt', 'utf8', (err, data) => 
    {
        if (err) 
        {
            console.error("File not found");
            return;
        }
        let temp = data.split('\n');
        for(let i = 45; i < 50; ++i)
        {
            let temp2 = temp[i].split(' ');
            //console.log(temp2);
            if (temp2[2].includes("https://www.ratemyprofessors.com/search/teachers?query=")) //Professors with 2 names (first and last name)
            {
                let name = temp2[0] + " " + temp2[1];
                let URL = temp2[2];
                findProfAndRating(name, URL);
                console.log("Adding: " + name + " , Count: " + i+1);
            }
            else //This is for professors with 3 names (first, middle, and last name)
            {
                let name = temp2[0] + " " + temp2[2];
                let URL = temp2[3];
                findProfAndRating(name, URL);
                console.log("Adding: " + name + " , Count: " + i+1);
            }
        }
    })
}

function startFindingProfessor(name)
{
    let URL = "https://www.ratemyprofessors.com/search/teachers?query=";
    let temp = name.split(' ');
    URL += temp[0] + "%20" + temp[1];
    console.log(URL);
    findProfAndRating(name, URL);
}

//askUser();


module.exports = {
    startFindingProfessor: startFindingProfessor,
    profInfoArr: profInfoArr};

//app.use.express.static('../../interface');

/*app.get('/results', (req, res) => {
    res.status(200).send('<h1>' + name + '<h1>');
})
app.listen(PORT, () => console.log("server running on PORT ${PORT}"))*/