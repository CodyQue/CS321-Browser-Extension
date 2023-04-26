fetch('http://localhost:8000/test2')
  .then(response => response.text())
  .then(data => {
    console.log("Data: " + data);
    let arr = data.split("/");

    //Puts professor name on center of html page
    const profName = document.getElementById("profName");
    profName.innerHTML = '<h1 style = "font-size: 24px; bottom:10px; position:relative; left:150px"><strong>' + arr[0] + '</strong></h1>';

    const rating = document.getElementById("rating");
    rating.innerHTML = '<h1 style = "font-size: 35px; bottom:10px; position:relative; left:150px"><strong>' + arr[1] + '/5</strong></h1>';

    const comment1 = document.getElementById("comment1");
    const comment2 = document.getElementById("comment2");
    const comment3 = document.getElementById("comment3");
    comment1.innerHTML = arr[2];
    comment2.innerHTML = arr[3];
  })
  .catch(error => console.error(error));