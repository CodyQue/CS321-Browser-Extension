# CS 321: Browser Extension

#### By Cody, Aadya, Anthony

A browser extension to generate a schedule, with the best rated professors, for George Mason University students.

### Structure

There are two components of this project, the front-end and the back-end. The front-end code is found in the interface directory, while the back-end code is everything around it.
- The front-end mainly used HTML, CSS/Bootstrap, and JavaScript for displaying buttons and doing action-handling.
- The back-end is mainly JavaScript, which is used to scrape information from RateMyProfessor and the George Mason PatriotWeb course list.

### Dependencies
Here are a list of tools used (there might be a slight chance that you need to install these packages through npm install)
- tailwind
- node.js
- html
- puppeteer
- sqlite3
- calender
- css
- express.js
- cookie-parser
- morgan

### How To Run The Browser Extension

The first thing to do is load the browser extension onto the browser. To do this, you need to load the manifest.json file when adding custom browser extensions.

The second thing is to run the back-end code on your local machine. To do this, run this command:
#### `node .\app.js`