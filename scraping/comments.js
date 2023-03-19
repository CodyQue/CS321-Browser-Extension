/**
 * 
 * commentScraper.js is used for scraping comments and reviews made 
 * from Professors through the website "Rate My Professor".
 * 
 */


/**
 * Organizes all the comments into a 2D array
 * @param {*} arr 
 */
function organizeComments(arr)
{
    //console.log(arr);
    const newArr = [];
    let max = arr.length;
    let i = 0;
    let added = 0, found = 0;
    while (i < max)
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
                if (((arr[i+j].includes('Textbook:')) || (arr[i+j].includes('Grade:')) || (arr[i+j].includes('Would Take Again:')) || (arr[i+j].includes('Attendance:')) || (arr[i+j].includes('For Credit:'))) && (foundComment == false) ) //Finds comment 
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
            }
        }
        foundComment = false;
        ++i;
    }
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
    for(let i = 0; i < arr.length; ++i)
    {
        const newArr = [];
        newArr.push(arr[i][0]);
        newArr.push(arr[i][1]);
        newArr.push(arr[i][3]);
        if (newMap.has(arr[i][2]) == false)
        {
            const newArr2 = [];
            newArr2.push(newArr);
            newMap.set(arr[i][2], newArr2);
        }
        else
        {
            let newArr2 = newMap.get(arr[i][2]);
            newArr2.push(newArr);
            newMap.set(arr[i][2], newArr2);
        }
    }
    console.log(newMap);
}

/**
 * 
 *  This part of the code begins the comment/review scraping
 * 
 */
export function executeCode(URL)
{
    console.log("Begin");
    (async () => {
        const browser = await puppeteer.launch({headless: true, defaultViewport: false, userDataDir: "./tmp"});
        const page = await browser.newPage();
        await page.goto(URL);
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
                var arr = comments.split("\n");
                arr = organizeComments(arr);
                putInMap(arr);
                break;
            }
            console.log(i+1+". ", hrefs[i]);
        }
        await browser.close();
    })();
}
executeCode(URL);

/*console.log("Begin");
(async () => {
    const browser = await puppeteer.launch({headless: true, defaultViewport: false, userDataDir: "./tmp"});
    const page = await browser.newPage();
    //await page.goto('https://www.ratemyprofessors.com/professor?tid=2366288');
    await page.goto('https://www.ratemyprofessors.com/professor?tid=2637066');
    const comments = await page.evaluate(() => document.body.innerText);
    var arr = comments.split("\n");
    //console.log(arr);
    arr = organizeComments(arr);
    putInMap(arr);
    //console.log("Done");
    await browser.close();
})();*/