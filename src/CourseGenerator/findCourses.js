const puppeteer = require("puppeteer");
const server = require("../../app");

let listOfCourses = new Map();
let schedule = [];
let scheduleCount = 0;

/*listOfCourses.set('CS 483', [
    [ '3:00 pm - 4:15 pm', 'TR', 'Grigory Yaroslavtsev' ],
    [ '10:30 am - 11:45 am', 'TR', 'Katherine E Russell' ],
    [ '8:30 am - 9:20 am', 'MWF', 'Ivan Avramovic' ],
    [ '12:30 pm - 1:20 pm', 'MWF', 'No Professor yet' ]
  ]);

listOfCourses.set('CS 452', [ [ '12:00 pm - 1:15 pm', 'TR', 'Lap Fai Yu' ] ]);

listOfCourses.set('CS 306', [
    [ '9:00 am - 10:15 am', 'TR', 'Tamara A Maddox' ],
    [ '10:30 am - 11:45 am', 'TR', 'Tamara A Maddox' ],
    [ '1:30 pm - 2:45 pm', 'TR', 'John E Otten' ],
    [ '1:30 pm - 4:10 pm', 'W', 'Fred W Geldon' ],
    [ '10:30 am - 11:45 am', 'TR', 'John E Otten' ],
    [ '1:30 pm - 2:45 pm', 'MW', 'No Professor yet' ],
    [ '3:00 pm - 4:15 pm', 'MW', 'No Professor yet' ]
  ])

  listOfCourses.set('CS 468', [[ '9:00 am - 10:15 am', 'TR', 'Maha Shamseddine' ],
  [ '3:00 pm - 4:15 pm', 'TR', 'Maha Shamseddine' ]])*/

let lock = 1, lock2 = 1; //Locking variable

/**
 * 
 * Prints the contents of the list of courses.
 * 
 */
async function waitForSchedule()
{
    while(lock == 1) //This will wait until the listOfCourses map gets filled
    {
        console.log("Waiting");
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
    console.log(listOfCourses);
    lock = 1;
}

/**
 * 
 * Using the map "listOfCourses", this will generate a schedule for the user.
 * 
 */
async function generateSchedule(arr)
{
    while(lock == 1) //This will wait until the listOfCourses map gets filled
    {
        console.log("Waiting");
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
    //console.log(listOfCourses);
    lock = 1;
    for(let i = 0; i < arr.length; ++i) //Loops through every single course
    {
        //console.log("GOING THROUGH LOOP")
        let timeIn = '', timeOut = '';
        let temp = listOfCourses.get(arr[i]); //Gets all section from course
        //console.log("Length: " + temp.length);

        for(let j = 0; j < temp.length; ++j) //Loops through every single time for that course
        {
            //console.log("CONTINUE");
            //const findProfInDatabase = require('../FindProfessor/comments');
            let temp2 = temp[j][0].split(" ");
            //console.log(temp2);
            timeIn = temp2[0];
            timeOut = temp2[3];
            //console.log("Time In: " + timeIn + ", Time Out: " + timeOut);
            //console.log(temp[j][2]);
            if (scheduleCount == 0)
            {
                let newArr = []
                newArr.push(arr[i], timeIn, timeOut, temp[j][1], temp[j][2]);
                schedule.push(newArr);
                //console.log(schedule);
                ++scheduleCount;
                break;
            }
            else
            {
                let d = false;
                for(let k = 0; k < schedule.length; ++k) //Checks the courses in the schedule
                {
                    //console.log("What is this?: " + temp[j][1]);
                    if (temp[j][1].localeCompare(schedule[k][3]) == 0)
                    {
                        if (timeIn.localeCompare(schedule[k][1]) == 0 || timeOut.localeCompare(schedule[k][2]) == 0)
                        {
                            //console.log("SAME TIME AND DAY: " + schedule[k][1] + " " + schedule[k][2])
                            d = true;
                        }
                    }
                }
                if (d == false)
                {
                    let newArr = []
                    newArr.push(arr[i], timeIn, timeOut, temp[j][1], temp[j][2]);
                    schedule.push(newArr);
                    //console.log(schedule);
                    ++scheduleCount;
                    break;
                }
            }
            /*while (lock2 == 1)
            {
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
            lock2 = 0;
            let newName = temp[j][2].split(" ");
            if (newName.length == 2)
            {
                findProfInDatabase(temp[j][2], '../FindProfessor/profURL.db');
            }
            else{
                let n = newName[0] + " " + newName[2];
                findProfInDatabase(n, '../FindProfessor/profURL.db');
            }
            /*if (scheduleCount == 0)
            {
                schedule.push([arr[0], timeIn, timeOut]);
            }*/
            ++scheduleCount;
            //console.log(temp);
        }
    }
    console.log(schedule);
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
        const browser = await puppeteer.launch({headless: true, defaultViewport: false, userDataDir: "./tmp"});
        const page = await browser.newPage();
        let allSections = [];
        for(let i = 0; i < arr.length; ++i) //Goes through every course the user wants to take
        {
            let course = arr[i].split(" ");
            let section = [];
            allSections = [];
            console.log(course);
            await page.goto('https://patriotweb.gmu.edu/pls/prod/bwckschd.p_disp_dyn_sched');
            await page.select('select[name="p_term"]', '202370');
            await page.click('input[type="submit"]'); // click the submit button
            await new Promise(resolve => setTimeout(resolve, 2500));
            await page.waitForSelector('#subj_id');
            await page.select('#subj_id', course[0]);
            await new Promise(resolve => setTimeout(resolve, 2500));
            await page.waitForSelector('#crse_id');
            await page.type('#crse_id', course[1]);
            await page.click('input[type="submit"]'); // click the submit button
            await new Promise(resolve => setTimeout(resolve, 2500));
            const html = await page.content();
            let newArr = html.split("\n"); //This is used to find the different sections of each course
            //console.log(newArr);
            for(let j = 0; j < newArr.length; ++j)
            {
                //console.log("Comparing " + newArr[i] + " with " + '<td class="dddefault">Class</td>');
                if (newArr[j].localeCompare('<td class="dddefault">Class</td>') == 0)
                {
                    section = [];
                    let courseProf = "";
                    let courseTime = "";
                    let courseDays = "";
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
                    for(let k = 0; k < newArr[j+2].length; ++k)
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
                        if (courseProf == '<td class="dddefault">' && determine == false)
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
                                //console.log(courseProf);
                                break;
                            }
                        }
                    }
                    section.push(courseTime);
                    section.push(courseDays);
                    section.push(courseProf);
                    //console.log(section);
                    allSections.push(section);
                    //console.log("Time: " + courseTime + ", Professor: " + courseProf);
                }
                //console.log(allSections);
            }
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
    for(let i = 0; i < arr.length; ++i)
    {
        let t = 0;
        while(t < 100)
        {
            let bool = true;
            let a = parseInt(Math.random() * arr.length);
            //console.log(a);
            for(let j = 0; j < lst.length; ++j)
            {
                if (lst[j] == a)
                {
                    //console.log("FAILED AT: " + a);
                    bool = false;
                    break;
                }
            }
            if (bool == false) ++t;
            else
            {
                //console.log("PASS " + a);
                lst.push(a);
                randArr.push(arr[a]);
                break;
            }
            ++t;
        }
        let j = 0;
        while (j < lst.length-1)
        {
            if (!lst.includes(j))
            {
                //console.log("PASS 2 " + j);
                lst.push(j);
                randArr.push(arr[j]);
                break;
            }
            ++j;
        }
    }
    //console.log(randArr);
    scrapeSchedules(arr);
    //waitForSchedule();
    generateSchedule(randArr);
}

module.exports = {
    generateSetup: generateSetup,
    schedule: schedule,
    gLock: lock2};