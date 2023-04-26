/**
 * 
 * This is used for event handling with finding professor information.
 * 
 */

const input = document.getElementById("professor");
const postButton2 = document.getElementById("post2");

        postButton2.addEventListener('click', postInfo2);
        async function postInfo2(e) 
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
                    parcel: (input.value +
                        "/" + "findProfessor")
                })
            });
            await new Promise(resolve => setTimeout(resolve, 9000));
            window.location.href = "./findProfessor.html";
        }