fetch('http://localhost:8000/test')
  .then(response => response.text())
  .then(data => {
    //console.log(data);
    let arr = data.split(",");
    let newData = "<table><tr>";
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