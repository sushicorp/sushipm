var cli = module.exports;
var fs = require('fs-extra');
var path = require("path");

var html = "index.html";
var mainjs = "main.js";

function copyTemplate(file, acceptExt){
	if(path.extname(file) === acceptExt){
		var input = path.join(__dirname, "../", "template" , "template" + acceptExt);
		fs.copy(input, file, function(err){
			if (err) return console.error(err);
			console.log(file + " created.");
		})
	}
}

function copyUniqueFile(file, acceptFileName){
	if(file === acceptFileName){
		var input = path.join(__dirname, "../", "template" , acceptFileName);
		fs.copy(input, acceptFileName, function(err){
			if (err) return console.error(err);
			console.log(file + " created.");
		});
	}

}

cli.create = function(file){
	copyUniqueFile(file, html);
	copyUniqueFile(file, mainjs);
	copyTemplate(file, ".vue");
	copyTemplate(file, ".js");
}