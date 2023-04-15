const puppeteer = require("puppeteer");

console.log("Begin");
(async () => {
    const browser = await puppeteer.launch({headless: false, defaultViewport: false, userDataDir: "./tmp"});
    const page = await browser.newPage();

    await page.goto('https://patriotweb.gmu.edu/pls/prod/bwckschd.p_disp_dyn_sched');
    
    //await page.screenshot({ path: 'example.png'});
    //const handles = await page.$$("s-main-slot s-result-list s-search-results sg-row");
    //const comments = await page.evaluate(() => document.body.innerText);
    //var arr = comments.split("\n");
    //console.log(arr);
    //console.log("Done");

    await page.select('select[name="p_term"]', '202370');

    //console.log("Went through\n");

    await page.click('input[type="submit"]'); // click the submit button
    await page.waitForNavigation();

    await page.waitForSelector('#subj_id');
    await page.select('#subj_id', 'CS');

    await page.waitForNavigation();

    await page.waitForSelector('#crse_id');
    await page.type('#crse_id', '450');

    await page.click('input[type="submit"]'); // click the submit button
    await page.waitForNavigation();

    const html = await page.content();

    console.log("Done\n");
    //await browser.close();
})();