const jsonfile = require('jsonfile')
const fs = require('fs');
const path = require('path');


const baseDir = "./catch"
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

    var dir = fs.readdirSync(baseDir);
    var events = []

    for (var i = 0; i < dir.length; i++) {
      var name = dir[i];
      var target = baseDir + '/' + name;
  
      var stats = fs.statSync(target);
    

      if (stats.isFile() && (name.slice(-fileEnding.length) === fileEnding) ) {

        var date = parseInt(target.substring(baseDir.length+1,target.length-fileEnding.length));
 
        if(!isNaN(date))
            if(!filterDate || filterDate < date)
                events.push(jsonfile.readFileSync(target))
        
      }
    

    }
 

    return events
}




module.exports = {clearEvents,loadEvents,saveEvent};