const jsonfile = require('jsonfile')
const fs = require('fs');
const path = require('path');


const baseDir = "cache"
const fileEnding = ".json"

function clearEvents() {
  fs.readdir(baseDir, (err, files) => {
    if (err) throw err;
      
    for (const file of files) {
      fs.unlink(path.join(baseDir, file), (err) => {
        if (err) throw err;
      });
    }
  });
}

function ensureDirectoryExistence(filePath) {
  var dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

function saveEvent(event) {
  let dir = path.join(baseDir, Date.now()+fileEnding);
  ensureDirectoryExistence(dir);
  jsonfile.writeFileSync(dir,event);
}


function loadEvents(filterDate=false) {

  var files = fs.readdirSync(baseDir);
  var events = []

  files.filter(name => path.extname(name) === fileEnding && fs.statSync(path.join(baseDir,name)).isFile()).forEach(name => {

    var date = path.basename(name,fileEnding)
    if(!isNaN(date) && (!filterDate || filterDate < date))
      events.push(jsonfile.readFileSync(path.join(baseDir,name)))
          
  });

  return events
}



module.exports = {clearEvents,loadEvents,saveEvent};