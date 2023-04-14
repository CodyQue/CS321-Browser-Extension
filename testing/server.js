/**
 * 
 * This tests the API between the front-end and back-end programs.
 * For the final project, it will not use a local host, but instead it will
 * use a Microsoft Azure App Service server for sending and receiving data.
 * This server is only made to test the front and back end using the computer's
 * local host
 * 
 */

const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
const PORT = 8000;

app.use(express.static('../interface'));
app.use(express.json());

/**
 * Sends data from back-end to front-end
 */
app.get('/results', (req, res) => {
    res.status(200).send('<h1>hello<h1>');
})

/**
 * Sends data from front-end to back-end
 */
app.post('/', (req, res) => {

    app.delete('/', (req, res) => {
        res.send("DELETE Request Called")
        console.log("DELETED REQUEST");
    })
    console.log("POSTING STUFF");
    const {parcel} = req.body;
    console.log(parcel);
    if (!parcel) return res.status(400).send({status: 'failed'});
    res.status(200).send({status: 'received'});

    app.get('/', (req, res) => {
        res.status(200).send('<h1>' + parcel + '<h1>');
    })

    console.log("DONE");
})

app.listen(PORT, () => console.log("server running on PORT ${PORT}"))