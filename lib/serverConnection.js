//functions to establish a connection to a network or serial server and write to it

const net = require('net');
const SerialPort = require("serialport-v4");
const handler = require('./handler');
const converter = require('../bin/converter');

var Svr; //this is used to access the .write function inside connectServer or connectSerialServer
var svrLive = true; //boolean to monitor status of connection

//connect network server
connectServer = function(port,host){

    net.createServer(function(svr) {
        console.log("server connected: " + port + ": " + host);
        
        Svr = svr; //this assigns the server to this net connection
        svr.setEncoding('hex');//renders data received on this connection in hexidecimal
        chunk = '';
        //handle data received on connection    
        svr.on('data', function(d){
            chunk += d;
            delim = "0d"; //It has to parse off a 'cr' because that is how the server initiates login
            if (chunk.includes(delim)){
                handler.handle(chunk);
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

//connection to a server over serial
connectSerialServer = function(p, b, d, s, P){
    var    chunk = '';
    
    var serialSvr = new SerialPort(p, {
        baudRate: b,
        dataBits: d,
        stopBits: s,
        parity: P,
        parser: SerialPort.parsers.byteDelimiter([0x0d]),   
        });

        Svr = serialSvr;//this assigns the server to this serial connection
        
    serialSvr.on('open', function( ) {
        console.log(p + ' opened');
    });
    
    serialSvr.on('data', function(d){
        delim = "0d";
        chunk += d;
        //if data is in decimal it will convert to hex
        if (chunk.includes("13")){
            chunk = converter.decimalToHex(chunk);
            }
            if (chunk.includes(delim)){
                handler.handle(chunk);
                chunk = '';
            }
    });
    


    serialSvr.on('error', function(e){
        console.log(e);
        svrLive = false;
        });

};

serverWrite = function(x){
    Svr.write(x);
};

getServerStatus = function(){
    status = svrLive;
    return status;
};

exports.connectServer = connectServer;
exports.serverWrite = serverWrite;
exports.getServerStatus = getServerStatus;
exports.connectSerialServer = connectSerialServer;
