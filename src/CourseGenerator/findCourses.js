const puppeteer = require("puppeteer");

console.log("Begin");
(async () => {
    const browser = await puppeteer.launch({headless: false, defaultViewport: false, userDataDir: "./tmp"});
    const page = await browser.newPage();

    await page.goto('https://patriotweb.gmu.edu/pls/prod/bwckschd.p_disp_dyn_sched');
    
    //await page.screenshot({ path: 'example.png'});
    //const handles = await page.$$("s-main-slot s-result-list s-search-results sg-row");
    const comments = await page.evaluate(() => document.body.innerText);
    var arr = comments.split("\n");
    console.log(arr);
    console.log("Done");
    await browser.close();
})();