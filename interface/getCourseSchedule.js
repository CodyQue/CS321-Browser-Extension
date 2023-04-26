/**
 * 
 * This js file sends the data from the back-end, and uploads it to the front-end.
 * This is for the random course maker portion of the software. It will fetch the data from
 * the server and display it in the result.html page.
 * 
 */

fetch('http://localhost:8000/test')
  .then(response => response.text())
  .then(data => {
    //console.log(data);
    let arr = data.split(",");
    let newData = "<table><tr><th>Class</th><th>Start</th><th>End</th><th>End</th><th>Professor</th><tr>";
    for(let i = 0; i < arr.length; ++i)
    {
        newData += "<th>" + arr[i] + "</th>";
        if ((i+1) % 5 == 0 && i != arr.length-1)
        {
            newData += "</tr><tr>";
        }
    }
    newData += "</tr></table>"
    const dataContainer = document.getElementById('results');
    dataContainer.innerHTML = newData;
  })
  .catch(error => console.error(error));