const express = require('express');
const { saveEvent } = require('./drivers/events');
const app = express();

require('dotenv').config()

const port = process.env.SERVER_PORT || 3000;
const ip = process.env.SERVER_IP || "127.0.0.1";

let path = process.env.SERVER_REL_PATH || null;

if(path == null)
    throw new Error("Required SERVER_REL_PATH in .env");

app.listen(ip, () => {
  console.log(`Server listening on port ${port} at ${ip}`);
});

app.use(express.json());

app.post(path, async (req, res) => {

    saveEvent(req.body)
    res.send()

})

app.get(path, async (req, res) => {

    res.send("Nice! You seeing this means that we are live!")

})