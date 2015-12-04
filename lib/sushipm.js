var cli = module.exports;

var fs = require("fs");
var chalk = require('chalk');
var writeFileAtomic = require("write-file-atomic")
var sortedObject = require("sorted-object");
var packageJson = "package.json";
var path = require("path");

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
