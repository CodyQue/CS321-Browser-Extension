const resultTable = document.getElementById("results"); //Table being transferred
const importButton = document.getElementById("exportSchedule");
importButton.addEventListener('click', transferNewSchedule);

async function transferNewSchedule()
{
    const res = await fetch('http://localhost:8000/users',
            {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify ({
                    parcel: (resultTable.innerHTML +
                        "/" + "importSchedule")
                })
            });
            await new Promise(resolve => setTimeout(resolve, 2000));
            window.location.href = "./menu.html";
}