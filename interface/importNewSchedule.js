/**
 * 
 * This imports the newly generated schedule and put it in the menu.html file
 * 
 */

fetch('http://localhost:8000/test')
  .then(response => response.text())
  .then(data => {
    //console.log(data);
    data = data.replace("<h1>", "");
    data = data.replace("</h1>", "");
    let arr = data.split(",");
    console.log("Data: " + data);
    let newData = '<table style="width:75%; height:75%"><tr style = "height: 50px"><th>Class</th><th>Start</th><th>End</th><th>Days</th><th>Professor</th><tr style = "height: 50px">';
    for(let i = 0; i < arr.length; ++i)
    {
        newData += "<td>" + arr[i] + "</td>";
        if ((i+1) % 5 == 0 && i != arr.length-1)
        {
            newData += '</tr><tr style = "height: 50px">';
        }
    }
    newData += "</tr></table>"
    const dataContainer = document.getElementById('Schedule');
    dataContainer.innerHTML = data;
  })
  .catch(error => console.error(error));