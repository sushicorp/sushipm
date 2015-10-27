var cli = module.exports;

cli.run = function() {
  var request = require("request");
  var fs = require("fs");
  var ask = require('prompt-autocomplete');
  var writeFileAtomic = require("write-file-atomic")
  var sortedObject = require("sorted-object");
  var concat = require('concat-stream');

  var repo = "https://raw.githubusercontent.com/sushicorp/npm-scripts-list/master/scripts.json";
  var packageJson = "package.json";
  function isYes(answer, defaultAnswer){
    if(defaultAnswer && answer.trim() === ''){
      return defaultAnswer;
    }
    return  answer.toLowerCase() === 'y' ||
            answer.toLowerCase() === 'yes';
  }

  function readJson(path, cb){
    var err;
    var data;
    try{
      data = JSON.parse(fs.readFileSync(path, "utf-8"));
    }catch(e){
      err = e;
    }
    cb(err, data);
  }

  function readScripts(json){
    var scripts = JSON.parse(json);
    var keys = Object.keys(scripts);
    var delimiter = " : ";

    var size = require('window-size');
    var selections = keys.map(function(key){
      var rawtext = key + delimiter + scripts[key];
      return rawtext.length > size.width -3 ? rawtext.substr(0,size.width - 6) + "..." : rawtext;
    });

    var options = {maxAutocomplete: size.height-2}
    ask("Search: ", selections, options, function (err, answer) {

      var key = answer.split(delimiter)[0];
      console.log("----------------------------");
      console.log("  " + key);
      console.log("    " + scripts[key]);
      console.log("----------------------------");

      var readline = require('readline');
      var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      rl.question("Add this to package.json? (Y/n) : ", function(answer) {
        if(!isYes(answer, true)){
          console.log("Canceled.");
          rl.close();
          return;
        }

        readJson(packageJson, function (err, data) {
          if(err){
            throw err;
          }

          data["scripts"] = data["scripts"] ? data["scripts"] : {};

          //Prevent overwrite
          /*
          if(data["scripts"][key]){
            rl.question("Overwrite? (y/N) : ", function(answer) {
              if(!isYes(answer, false)){
                console.log("Canceled.");
                rl.close();
                return;
              }
            });
          }
          */

          data["scripts"][key] = scripts[key];
          data["scripts"] = sortedObject(data["scripts"]);

          var argsMatcher = scripts[key].match(/\${[^}]+}/g);
          if(!argsMatcher){
            argsMatcher = [];
          }
          var args = argsMatcher.map(function(item){
            return item.replace(/[\${|}]/g,"").replace("npm_package_config_", "");
          });

          var defaultArgs = {
            "src_js": "src/js/main.js",
            "src_css": "src/css/*.css",
            "src_scss": "src/css/*.scss",
            "dist_js": "dist/bundle.js",
            "dist_css": "dist/bundle.css",
          };

          if(args.length > 0){
            data["config"] = data["config"] ? data["config"] : {};
            args.forEach(function(item){
              if(!data["config"][item]){
                if(defaultArgs[item]){
                  data["config"][item] = defaultArgs[item];
                }else{
                  data["config"][item] = "";
                }
              }
            });
          }


          data = JSON.stringify(data, null, 2) + "\n"
          writeFileAtomic(packageJson, data, function (err) {
            if(err){
              throw err;
            }
            console.log(data);
            rl.close();
            return;
          })
        })


      });
    });
  }

  if(!fs.existsSync(packageJson)){
    console.log("There is no package.json.");
    console.log("please execute 'npm init'.");
    return;
  }
  request(repo).pipe(concat(readScripts));
};
