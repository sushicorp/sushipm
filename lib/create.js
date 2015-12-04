var cli = module.exports;
var fs = require('fs-extra');
var path = require("path");

var html = "index.html";

cli.create = function(file){
	if(file === html){
		var input = path.join(__dirname, "../", "template" , html);
		fs.copy(input, path.join("./", html), function(err){
			if (err) return console.error(err);
			console.log(html + " created.");
		});
	}
}