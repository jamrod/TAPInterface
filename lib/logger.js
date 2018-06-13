//creates a logfile and writes text to it

const fs = require('fs');

//declare and set path where logs will go
var path;
setPath = function(s){
    path = s;
    //console.log(path);
};

var filePath;
setFilePath = function(fp){
  filePath = fp;
};

getFilePath = function(){
    fp = filePath;
    return fp;
};

//var count = 0;
var lineCount = 0;//this is for a method to limit the size of log files
var delim = ",";//this delimiter goes between entries to the log file

//this method counts existing logs so as to not overwrite
getCount = function(){
	var c = 0;
	dir = path;
	fileList = fs.readdirSync(dir);
	listLength = fileList.length;
	for (i = 0; i < listLength; i++) {
		if (fileList[i].includes('log')) {c++};
	}
	return c;
};

//initialize file
startLog = function(){
		count = getCount();
        filePath = path.concat("log", count, ".txt");
        t = "Logging Started...";
        d = Date();
        t = d.concat(t, delim);
        fs.writeFile(filePath, t , function(err){
        if (err) throw err;
        console.log("Created Log...");
        console.log(filePath);
        setFilePath(filePath);
        });
};

//writes to log, also will generate new file if log gets to big
writeLog = function(x){
    lineCount++;//this is a method to limit the size of log files
    if (lineCount >= 1000){
        lineCount = 0;
        startLog();
    }
    filePath = getFilePath();
    d = Date();    
    y = d.concat(delim, x, delim);
    fs.appendFile(filePath, y, err => {
        if (err) throw err;
        });
};

exports.writeLog = writeLog;
exports.setPath = setPath;
exports.startLog = startLog;
