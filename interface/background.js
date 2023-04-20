/**
 * 
 * Background.js is used for event handling, such as pressing a button or scrolling.
 * This will be essential for the functionality of the browser extension.
 * Put every action/event handler/callback in this file.
 * 
 */

const input1 = document.getElementById("input1");
const input2 = document.getElementById("input2");
const input3 = document.getElementById("input3");
const input4 = document.getElementById("input4");
const input5 = document.getElementById("input5");
const postButton = document.getElementById("post");

        postButton.addEventListener('click', postInfo);
        async function postInfo(e) 
        {
            e.preventDefault();
            //if (input1.value == '') return;
            
            //Check /test to make sure that the input went through 
            const res = await fetch('http://localhost:8000/users',
            {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify ({
                    parcel: (input1.value + 
                        "/" +  input2.value + 
                        "/" + input3.value + 
                        "/" + input4.value + 
                        "/" + input5.value +
                        "/" + "generateSchedule")
                })
            });
            window.location.href = "./loading.html";
        }