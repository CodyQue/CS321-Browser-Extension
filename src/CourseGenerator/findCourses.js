const puppeteer = require("puppeteer");
const server = require("../../app");
const sqlite3 = require("sqlite3").verbose();

let listOfCourses = new Map();
let schedule = [];
let scheduleCount = 0;
let days = "";

let lock = 1, lock2 = 1, profRatinglock = 0; //Locking variable
let nextLock = 1;

/**
 * 
 * Using the map "listOfCourses", this will generate a schedule for the user.
 * 
 */
async function generateSchedule(arr)
{
    while(lock == 1) //This will wait until the listOfCourses map gets filled
    {
        console.log("Waiting: " + process.pid);
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
    console.log(listOfCourses);
    lock = 1;
    for(let i = 0; i < arr.length; ++i) //Loops through every single course
    {
        let highestRatingProf = 0;
        let highestProfInfo = [];
        //console.log("GOING THROUGH LOOP")
        let timeIn = '', timeOut = '';
        let temp = listOfCourses.get(arr[i]); //Gets all section from course from the Map
        //console.log("Length: " + temp.length);

        for(let j = 0; j < temp.length; ++j) //Loops through every section of the course
        {
            if (days.includes(temp[j][1]))
            {
                //console.log("CONTINUE");
                //const findProfInDatabase = require('../FindProfessor/comments');
                let temp2 = temp[j][0].split(" "); //Splits the times
                //console.log(temp2);
                timeIn = temp2[0];
                timeOut = temp2[3];
                //console.log("Time In: " + timeIn + ", Time Out: " + timeOut);
                //console.log(temp[j][2]);
                let d = false;
                for(let k = 0; k < schedule.length; ++k) //Checks the courses in the schedule to find 
                {
                    //console.log("What is this?: " + temp[j][1]);
                    if (temp[j][1].localeCompare(schedule[k][3]) == 0) //Same day
                    {
                        if (timeIn.localeCompare(schedule[k][1]) == 0 || timeOut.localeCompare(schedule[k][2]) == 0) //Same time in or out
                        {
                        //console.log("SAME TIME AND DAY: " + schedule[k][1] + " " + schedule[k][2])
                            d = true;
                        }
                    }
                }
                //console.log(temp[j][3]);
                if (d == false)
                {
                    if (temp[j][3] >= highestRatingProf)
                    {
                        highestProfInfo = [];
                        highestProfInfo.push(arr[i], timeIn, timeOut, temp[j][1], temp[j][2]);
                        highestRatingProf = temp[j][3];
                    }
                }
                ++scheduleCount;
                //console.log(temp);
            }
        }
        schedule.push(highestProfInfo);
    }
    console.log(schedule);
    console.log("Days: " + days);
    lock2 = 0;
}

/**
 * 
 * This finds the list of courses provided by the user. The program scrapes PatriotWeb to find
 * the courses and puts every information onto a Map.
 * 
 * @param {
 * } arr 
 */
async function scrapeSchedules(arr)
{
    console.log("Begin");
    (async () => {
        const browser = await puppeteer.connect({
            browserWSEndpoint: 'wss://chrome.browserless.io?token=be54cb34-6171-495d-a218-feac854f1e5e',
          });
        const page = await browser.newPage();
        let allSections = [];
        for(let i = 0; i < arr.length; ++i) //Goes through every course the user wants to take
        {
            let course = arr[i].split(" ");
            let section = [];
            let hrefArr = [];
            allSections = [];
            console.log("COurses: " + course + ", Days: " + days);
            await page.goto('https://patriotweb.gmu.edu/pls/prod/bwckschd.p_disp_dyn_sched');
            await page.select('select[name="p_term"]', '202370');
            await page.click('input[type="submit"]');
            await new Promise(resolve => setTimeout(resolve, 2500));
            await page.waitForSelector('#subj_id');
            await page.select('#subj_id', course[0]);
            await new Promise(resolve => setTimeout(resolve, 2500));
            await page.waitForSelector('#crse_id');
            await page.type('#crse_id', course[1]);
            await page.click('input[type="submit"]');
            await new Promise(resolve => setTimeout(resolve, 2500));
            const html = await page.content();
            let newArr = html.split("\n"); //This is used to loop through each sections of each course
            const hrefs = await page.$$eval('a', (links) => links.map(link => link.href));
            for(let l = 0; l < hrefs.length; ++l)
            {
                if (hrefs[l].includes('https://patriotweb.gmu.edu/pls/prod/bwckschd.p_disp_detail_sched?term_in='))
                {
                    hrefArr.push(hrefs[l]);
                }
            }
            //console.log(hrefArr);
            //console.log(newArr);
            for(let j = 0; j < newArr.length; ++j) //Loops through each section
            {
                //console.log("Comparing " + newArr[i] + " with " + '<td class="dddefault">Class</td>');
                if (newArr[j].localeCompare('<td class="dddefault">Class</td>') == 0)
                {
                    section = [];
                    let courseProf = "";
                    let courseTime = "";
                    let courseDays = "";
                    let profRating = 0;
                    let count = 0;
                    let determine = false;
                    for(let k = 0; k < newArr[j+1].length; ++k) //scrapes the time of that course
                    {
                        courseTime += newArr[j+1][k];
                        if (courseTime == '<td class="dddefault">' && determine == false)
                        {
                            courseTime = "";
                            determine = true;
                        }
                        else if (determine == true)
                        {
                            ++count;
                            if (courseTime.includes('<') && count < 17) 
                            {
                                courseTime = "Async";
                                break;
                            }
                            else if (count >= 17 && courseTime.includes('<')) 
                            {
                                courseTime = courseTime.substring(0, courseTime.length-1);
                                break;
                            }
                        }
                    }
                    determine = false;
                    count = 0;
                    for(let k = 0; k < newArr[j+2].length; ++k) //Scrapes the days that the specific course meets
                    {
                        //console.log("Finding days")
                        courseDays += newArr[j+2][k];
                        //console.log(courseDays);
                        if (courseDays == '<td class="dddefault">' && determine == false)
                        {
                            courseDays = "";
                            determine = true;
                        }
                        else if (determine == true)
                        {
                            ++count;
                            if (courseDays.includes('&')) 
                            {
                                courseDays = "No days yet";
                                break;
                            }
                            else if (count > 1 && courseDays.includes('<')) 
                            {
                                courseDays = courseDays.substring(0, courseDays.length-1);
                                //console.log("FINISHED: " + courseDays)
                                break;
                            }
                        }
                    }
                    determine = false;
                    for(let k = 0; k < newArr[j+6].length; ++k) //scrapes the professor name of the course
                    {
                        courseProf += newArr[j+6][k];
                        //console.log(courseProf + ", " + k);
                        if (courseProf == '<td class="dddefault">' && determine == false) //Resets the courseProf
                        {
                            courseProf = "";
                            determine = true;
                        }
                        else if (determine == true)
                        {
                            if (courseProf.includes('<')) 
                            {
                                courseProf = "No Professor yet";
                                break;
                            }
                            else if (courseProf.includes('(')) 
                            {
                                courseProf = courseProf.substring(0, courseProf.length-2);
                                courseProf = courseProf.replace("   ", " ");
                                courseProf = courseProf.replace("  ", " ");
                                let URL = "https://www.ratemyprofessors.com/search/teachers?query=";
                                let tempName = courseProf.split(' ');
                                if (tempName[0].includes("Lap Fai"))
                                {
                                    tempName[0] = "Craig";
                                }
                                if (tempName.length == 3)
                                {
                                    URL += tempName[0] + "%20" + tempName[2];
                                    courseProf = tempName[0] + " " + tempName[2];
                                }
                                else
                                {
                                    URL += tempName[0] + "%20" + tempName[1];
                                    courseProf = tempName[0] + " " + tempName[1];
                                }
                                console.log("Professor: " + courseProf + ", URL: " + URL);
                                try{
                                    await page.goto(URL); //Goes to URL
                                    try //Rate My Professor has a "cookies" page when new user goes to the website. This clicks the "close" button if this shows up
                                    {
                                        const closeButton = await page.$('.Buttons__Button-sc-19xdot-1.CCPAModal__StyledCloseButton-sc-10x9kq-2.gvGrz');
                                        await closeButton.click();
                                    }
                                    catch(error2)
                                    {
                                        console.log("No button exists");
                                    }
                                    const t = await page.evaluate(() => document.body.innerText); //Evaluates the inner text of the page
                                    var x = t.split("\n");
                                    //console.log(x);
                                    var n = courseProf.split(" ");
                                    //console.log(n);
                                    for(let i = 0; i < x.length; ++i) //Finds the number of professors in the search
                                    {
                                        if (x[i].includes(courseProf[0]) == true && x[i].includes(courseProf[n.length-1]) == true) //Finds same first and last name
                                        {
                                            if (x[i+2].includes("George Mason University")) //Finds the rating of professor that is in GMU
                                            {
                                                profRating = parseFloat(x[i-2]);
                                                break;
                                            }
                                        }
                                    }
                                }
                                catch(error)
                                {
                                    console.log("Could not find professor");
                                }
                                break;
                            }
                        }
                    }
                    section.push(courseTime);
                    section.push(courseDays);
                    section.push(courseProf);
                    section.push(profRating);
                    //console.log(section);
                    allSections.push(section);
                    //console.log("Time: " + courseTime + ", Professor: " + courseProf);
                }
                //console.log(allSections);
            }
            /*for(let j = 0; j < hrefArr.length; ++j)
            {
                let fullCount = 0;
                let breakCount = 0;
                await page.goto(hrefArr[j]); //Goes to URL
                const tables = await page.$$('table');

                for (const table of tables) {
                    const rows = await table.$$('tr');
                    for (const row of rows) {
                    const cells = await row.$$('th, td');
                    for (const cell of cells) {
                        const value = await cell.evaluate(node => node.innerText);
                        if (value.localeCompare("Capacity") || value.localeCompare("Actual") || value.localeCompare("Remaining"))
                        {
                            fullCount++;
                        }
                        if (fullCount >= 3)
                        {
                            console.log("Value: " + value);
                        }

                    }
                    }
                }
            }*/
            listOfCourses.set(arr[i], allSections);
        }
        lock = 0;
        await browser.close();
    })();
}

//let arr = ["CS 483", "CS 452", "CS 306", "CS 468", "GGS 101"];
//let arr = ["CS 483", "CS 452", "CS 306", "CS 468"];

let randArr = [], lst = [];
function generateSetup(arr)
{
    while (schedule.length != 0)
    {
        schedule.pop();
    }
    days = arr[arr.length-1];
    arr.pop();
    scrapeSchedules(arr);
    //waitForSchedule();
    generateSchedule(arr);
}

module.exports = {
    generateSetup: generateSetup,
    schedule: schedule,
    gLock: lock2};