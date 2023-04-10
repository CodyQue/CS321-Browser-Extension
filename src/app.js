/**
 * For testing purposes: Used to connect local host, from express.js and the front-end and back-end programs
 * This displays the back-end to the front-end HTML files
 */

const feedDisplay = document.querySelector('#feed');

fetch('http://localhost:8000/results')
    .then(response => response.json())
    .then(data =>{
        data.forEach(article => {
            const title = '<h3>' + article + '</h3>'
            feedDisplay.insertAdjacentHTML('beforeend', title)
        })
    })