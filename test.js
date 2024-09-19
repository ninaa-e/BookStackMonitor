const { loadEvents } = require("./drivers/events.js");
require('dotenv').config()

process.argv.forEach(function (val, index, array) {
    console.log(index + ': ' + val);
});
  
console.log("Alle Ereignisse")
loadEvents().forEach(element => {
    console.log(element.text)
});