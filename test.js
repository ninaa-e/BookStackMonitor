const { loadEvents } = require("./drivers/events.js");
require('dotenv').config()


  
console.log("Alle Ereignisse")
loadEvents().forEach(element => {
    console.log(element.text)
});