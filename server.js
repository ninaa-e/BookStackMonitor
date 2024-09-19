const express = require('express');
const { saveEvent } = require('./drivers/events');
const app = express();

require('dotenv').config()

const port = process.env.SERVER_PORT || 3000;
app.listen(port,process.env.SERVER_IP || "127.0.0.1", () => {
  console.log(`Server listening on port ${port}`);
});

app.use(express.json());

app.post(process.env.SERVER_REL_PATH, async (req, res) => {

    saveEvent(req.body)
    res.send()

})

app.get(process.env.SERVER_REL_PATH, async (req, res) => {


    res.send("Server is up and running! Use this url in Bookstack")

})