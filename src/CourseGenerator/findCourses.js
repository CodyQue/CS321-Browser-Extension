const puppeteer = require("puppeteer");

let listOfCourses = new Map();
let schedule = [];
let scheduleCount = 0;

listOfCourses.set('CS 483', [
    [ '3:00 pm - 4:15 pm', 'TR', 'Grigory Yaroslavtsev' ],
    [ '10:30 am - 11:45 am', 'TR', 'Katherine E Russell' ],
    [ '8:30 am - 9:20 am', 'MWF', 'Ivan Avramovic' ],
    [ '12:30 pm - 1:20 pm', 'MWF', 'No Professor yet' ]
  ]);

  listOfCourses.set('CS 452', [ [ '12:00 pm - 1:15 pm', 'TR', 'Lap Fai Yu' ] ]);
let lock = 1; //Locking variable

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
    /*while(lock == 1) //This will wait until the listOfCourses map gets filled
    {
        console.log("Waiting");
        await new Promise(resolve => setTimeout(resolve, 2000));
    }*/
    //console.log(listOfCourses);
    lock = 1;
    for(let i = 0; i < arr.length; ++i) //Loops through every single course
    {
        console.log("GOING THROUGH LOOP")
        let timeIn = '', timeOut = '';
        let temp = listOfCourses.get(arr[i]);
        console.log("Length: " + temp.length);

        for(let j = 0; j < temp.length; ++j) //Loops through every single time for that course
        {
            let temp2 = temp[j][0].split(" ");
            console.log(temp2);
            timeIn = temp2[0];
            timeOut = temp2[3];
            console.log("Time In: " + timeIn + ", Time Out: " + timeOut);
            if (scheduleCount == 0)
            {
                schedule.push([arr[0], timeIn, timeOut]);
            }
            //console.log(temp);
        }
    }
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
let arr = ["CS 483", "CS 452"];
//scrapeSchedules(arr);
//waitForSchedule();
generateSchedule(arr);