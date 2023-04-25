/**
 * 
 * Background.js is used for event handling, such as pressing a button or scrolling.
 * This will be essential for the functionality of the browser extension.
 * Put every action/event handler/callback in this file.
 * 
 */

let days = "";
let courses = "";
let courseCount = 0;
let time = 0;
let lock = 1;

const input1 = document.getElementById("input1");
const input2 = document.getElementById("input2");
const input3 = document.getElementById("input3");
const input4 = document.getElementById("input4");
const input5 = document.getElementById("input5");
const date1 = document.getElementById("M");
const date2 = document.getElementById("T");
const date3 = document.getElementById("W");
const date4 = document.getElementById("R");
const date5 = document.getElementById("F");
const date6 = document.getElementById("S");
//console.log("Date1: " + date1);
const postButton = document.getElementById("post");

        postButton.addEventListener('click', postInfo);
        async function postInfo(e) 
        {
            if (date1.checked) //Checks days
            {
                days += date1.value;
            }
            if (date3.checked)
            {
                days += date3.value;
            }
            if (date5.checked)
            {
                days += date5.value;
            }
            if (date2.checked)
            {
                days += date2.value;
            }
            if (date4.checked)
            {
                days += date4.value;
            }
            if (date6.checked)
            {
                days += date6.value;
            }
            if (!(input1.value =='')) //Checks courses
            {
                courses += input1.value;
                ++courseCount;
                time+=14000;
            }
            if (!(input2.value ==''))
            {
                if (courseCount != 0)
                {
                    courses += "/";
                }
                courses += input2.value;
                ++courseCount;
                time+=14000;
            }
            if (!(input3.value ==''))
            {
                if (courseCount != 0)
                {
                    courses += "/";
                }
                courses += input3.value;
                ++courseCount;
                time+=14000;
            }
            if (!(input4.value ==''))
            {
                if (courseCount != 0)
                {
                    courses += "/";
                }
                courses += input4.value;
                ++courseCount;
                time+=14000;
            }
            if (!(input5.value ==''))
            {
                if (courseCount != 0)
                {
                    courses += "/";
                }
                courses += input5.value;
                ++courseCount;
                time+=14000;
            }
            lock = 0;
            while (lock == 1)
            {
                console.log("Waiting for lock");
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
            console.log("Time: " + time);
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
                    parcel: (courses +
                        "/" + days +
                        "/" + "generateSchedule")
                })
            });
            await new Promise(resolve => setTimeout(resolve, time));
            window.location.href = "./result.html";
        }