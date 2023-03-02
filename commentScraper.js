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
        //console.log(i);
        if (arr[i] == 'QUALITY')
        {
            //console.log("----------------------------------------------FOUND QUALITY----------------------------------------");
            ++found;
            let j = 20;
            let quality = 0;
            while (j > -5)
            {
                //console.log(arr[i+j] + ": include?: " + (arr[i+j].includes('Textbook')) + ", Found Comment: " + foundComment);
                if ((arr[i+j].includes('Textbook')) && (foundComment == false) ) //Finds comment 
                {
                    //console.log("FOUND TEXTBOOK: " + arr[i+j] + ", adding: " + arr[i+j+1]);
                    newArr2.push(arr[i+j+1]);
                    ++added;
                    foundComment = true;
                }
                else
                {
                    let date = arr[i+j].split(" ");
                    //console.log(date);
                    if (date.length == 3 && (date[2] == '2022') && (foundComment == false))
                    {
                        //console.log("FOUND DATE: " + arr[i+j] + ", adding: " + arr[i+j+1]);
                        newArr2.push(arr[i+j+1]);
                        ++added;
                        foundComment = true;
                    }
                }
                if (arr[i+j].includes('QUALITY') && j < 15)
                {
                    newArr2.push(arr[i+j+1]); //Quality score
                    newArr2.push(arr[i+j+4]); //Course that the professor teaches
                    newArr2.push(arr[i+j+7]); //Date that the comment was made
                    //newArr2.push(arr[i+j+14]); //Number of likes for that comment
                    //newArr2.push(arr[i+j+15]); //Number of dislikes for that comment
                    break;
                }
                //finds quality
                --j;
            }
            newArr.push(newArr2);
        }
        foundComment = false;
        ++i;
    }
    console.log(newArr);
    //console.log("Added: " + added);
    //console.log("Founded: " + found);
}

const puppeteer = require('puppeteer');

const infiniteScrolls = async (page) => {
    console.log("SCROLLING THROUGH PAGE");
    while(true)
    {
        prevHeight = await page.evaluate('document.body.scrollHeight'); //Finds height of the webpage
        await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
        await page.waitForFunction('document.body.scrollHeight > ${previousHeight}');
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }
}

console.log("Begin");
(async () => {
    const browser = await puppeteer.launch({headless: false, defaultViewport: false, userDataDir: "./tmp"});
    const page = await browser.newPage();
    await page.goto('https://www.ratemyprofessors.com/professor?tid=2366288');
    //await page.goto('https://www.ratemyprofessors.com/professor?tid=2310558');
    //await page.screenshot({ path: 'example.png'});
    //const handles = await page.$$("s-main-slot s-result-list s-search-results sg-row");
    const comments = await page.evaluate(() => document.body.innerText);
    var arr = comments.split("\n");
    //console.log(comments);
    organizeComments(arr);
    console.log("Done");
    await browser.close();
})();