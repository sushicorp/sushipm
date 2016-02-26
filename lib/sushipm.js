var cli = module.exports;

var fs = require("fs");
var chalk = require('chalk');
var writeFileAtomic = require("write-file-atomic")
var sortedObject = require("sorted-object");
var packageJson = "package.json";
var path = require("path");
var execSync = require('child_process').execSync;



function getRepo(cb) {
  fs.readFile(path.join(__dirname, "../", "data" , "scripts.json"), "utf-8", cb);
}

function readJson(path, cb) {
  var err;
  var data;
  try {
    data = JSON.parse(fs.readFileSync(path, "utf-8"));
  } catch (e) {
    err = e;
  }
  cb(err, data);
}

function installDevDependencies(dev){
  var command = "npm i -D " + dev.join(" ");
  console.log(command);
  var result = "" + execSync(command);
  console.log(result);
}


function addPackageJson(key, scripts) {
  readJson(packageJson, function (err, data) {
    if (err) {
      throw err;
    }
    
    data["scripts"] = data["scripts"] ? data["scripts"] : {};
    data["scripts"][key] = scripts[key].run;
    data["scripts"] = sortedObject(data["scripts"]);


    data = JSON.stringify(data, null, 2) + "\n"
    writeFileAtomic(packageJson, data, function (err) {
      if (err) {
        throw err;
      }
      console.log(data);
      
      console.log("Install devDependencies...");

      if(scripts[key].dev && scripts[key].dev.length > 0){
        installDevDependencies(scripts[key].dev);
      }
      
      console.log("DONE.");
      return;
    })
  })
}

function addDevPackageJson(scripts) {
  readJson(packageJson, function (err, data) {
    if (err) {
      throw err;
    }
    
    data["scripts"] = data["scripts"] ? data["scripts"] : {};
    var tasks = [];
    Object.keys(data["scripts"]).forEach(function(key){
        if(key.match(/watch/)){
            tasks.push(key);
        }
    });
    
    var tasksStr = tasks.map(function(t){
        return "'npm run " + t + "'";
    }).join(" ");
    
    data["scripts"]["dev"] = "parallelshell " + tasksStr;
    data["scripts"] = sortedObject(data["scripts"]);

    data = JSON.stringify(data, null, 2) + "\n"
    writeFileAtomic(packageJson, data, function (err) {
      if (err) {
        throw err;
      }
      console.log(data);
      
      console.log("Install devDependencies...");

      installDevDependencies(["parallelshell"]);
      
      console.log("DONE.");
      return;
    })
  })
}
cli.list = function () {
  getRepo(function (err, json) {
    var scripts = JSON.parse(json);
    var keys = Object.keys(scripts);
    keys.forEach(function (key) {
      console.log(chalk.green(key), " ", chalk.blue(scripts[key].run));
    })
  })
}

cli.add = function (target) {
  if (!fs.existsSync(packageJson)) {
    console.log("There is no package.json.");
    console.log("please execute 'npm init'.");
    return;
  }

  getRepo(function (err, json) {
    addPackageJson(target, JSON.parse(json));
  });
};

cli.addDev = function(){
  getRepo(function (err, json) {
    addDevPackageJson(JSON.parse(json));
  });
}