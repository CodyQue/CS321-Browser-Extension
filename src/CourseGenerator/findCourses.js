const puppeteer = require("puppeteer");

let schedule = new Map();

async function generateSchedule(arr)
{
    console.log("Begin");
    (async () => {
        const browser = await puppeteer.launch({headless: true, defaultViewport: false, userDataDir: "./tmp"});
        const page = await browser.newPage();

        for(let i = 0; i < arr.length; ++i)
        {
            let course = arr[i].split(" ");
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
            let newArr = html.split("\n");
            for(let j = 0; j < newArr.length; ++j)
            {
                //console.log("Comparing " + newArr[i] + " with " + '<td class="dddefault">Class</td>');
                if (newArr[j].localeCompare('<td class="dddefault">Class</td>') == 0)
                {
                    console.log("Time: " + newArr[j+1] + "\n Professor: " + newArr[j+6]);
                }
            }
        }
        
        //console.log(newArr);
        await browser.close();
    })();
}

let arr = ["CS 483", "CS 452", "CS 306", "CS 468", "GGS 101"];
generateSchedule(arr);