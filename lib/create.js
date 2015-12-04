var cli = module.exports;
var fs = require('fs-extra');
var path = require("path");


function copyTemplate(file, acceptExt){
	if(path.extname(file) === acceptExt){
		var input = path.join(__dirname, "../", "template" , "template" + acceptExt);
		fs.copy(input, file, function(err){
			if (err) return console.error(err);
			console.log(file + " created.");
		})
		return true;
	}
	return false;
}

function copyUniqueFile(file, acceptFileName){
	if(file === acceptFileName){
		var input = path.join(__dirname, "../", "template" , acceptFileName);
		fs.copy(input, acceptFileName, function(err){
			if (err) return console.error(err);
			console.log(file + " created.");
		});
		return true;
	}
	return false;
}

cli.create = function(file){
	if(file === undefined){
		console.log("Example: index.html, main.js, test.js, test.vue, test.js, ...");
	}
	
	if(copyUniqueFile(file, "index.html")){
		return;
	}
	if(copyUniqueFile(file, "main.js")){
		return;
	}
	if(copyUniqueFile(file, "test.js")){
		return;
	}	
	if(copyTemplate(file, ".vue")){
		return;
	}
	if(copyTemplate(file, ".js")){
		return;
	}
}