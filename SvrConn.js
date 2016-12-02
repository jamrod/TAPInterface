var net = require('net');
var Handler = require('./Handler');

var Svr; //this is used to access the .write function insde connectServer
var svrLive = true;

connectServer = function(port,host){

    net.createServer(function(svr) {
        console.log("server connected: " + port + ": " + host);
        
        Svr = svr; //this creates a handle outside of this function
        svr.setEncoding('hex');
        chunk = '';
            
        svr.on('data', function(d){
            chunk += d;
            delim = "0d"; //It has to parse off a 'cr' because that is how the server initiates login
            if (chunk.includes(delim)){
                Handler.handle(chunk);
                chunk = '';
            }
            
        });
        
        svr.on('connection', function(){
            svrLive = true;            
        });
        
        svr.on('error', function(err){
            svrLive = false;
            console.log(err);
        });

    }).listen(port,host);
        console.log("Listening On " + host + ": " + port);
};

SvrWrite = function(x){
    Svr.write(x);
};

getSvrStatus = function(){
    status = svrLive;
    return status;
};

exports.connectServer = connectServer;
exports.SvrWrite = SvrWrite;
exports.getSvrStatus = getSvrStatus;