/**
 * 
 * This imports the newly generated schedule and put it in the menu.html file
 * 
 */

fetch('http://localhost:8000/test')
  .then(response => response.text())
  .then(data => {
    //console.log(data);
    console.log("Data: " + data);
    const dataContainer = document.getElementById('Schedule');
    dataContainer.innerHTML = data;
  })
  .catch(error => console.error(error));