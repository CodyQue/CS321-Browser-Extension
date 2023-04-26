/**
 * 
 * This imports the newly generated schedule and put it in the menu.html file
 * 
 */

fetch('http://localhost:8000/test')
  .then(response => response.text())
  .then(data => {
    //console.log(data);
    let arr = data.split(",");
    let newData = '<table style="width:75%; height:20%"><tr style = "height: 20px"><th>Class</th><th>Start</th><th>End</th><th>End</th><th>Professor</th><tr style = "height: 25px">';
    for(let i = 0; i < arr.length; ++i)
    {
        newData += "<th>" + arr[i] + "</th>";
        if ((i+1) % 5 == 0 && i != arr.length-1)
        {
          newData += '</tr><tr style = "height: 25px">';
        }
    }
    newData += "</tr></table>"
    const dataContainer = document.getElementById('Schedule');
    dataContainer.innerHTML = newData;
  })
  .catch(error => console.error(error));