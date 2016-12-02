const net = require('net');
const converter = require('./converter');
const dgram = require('dgram');

var Client;
var clientLive;

var port;
var host;

setPort = function(s){
    port = s;    
};

setHost = function(s){
    host = s;
};


var TCP;

setTCP = function(b){
    TCP = b;
    if (TCP){
        clientLive = false;
    }
};

startPageClient = function(){    
    var client = new net.Socket();
    Client = client;
    port = port;
    host = host;
    client.connect(port,host,function(){
        console.log('client connected: ' + host + ': ' + port);
        clientLive = true;
        });

    
    client.on('error', function(){
        clientLive = false;
        console.log("Client Disconnected");
    });    

    };
    
var udpClient = dgram.createSocket('udp4');

udpWrite = function(x){
    udpClient.send(x, 0, x.length, port, host, function(err){
        if (err) {
        console.log(err);
        }
    });
};

PageClientWrite = function(x){
    tcp = TCP;
    port = port;
    host = host;
    etx = x.indexOf('0d03');
    x = x.slice(8,etx);
    y = converter.hexToAscii(x);
    z = Buffer(y);
    if (tcp){        
        if (clientLive){
            Client.write(z);
        }

    }   
    else {
        udpWrite(z);
    }
};
    
getClientStatus = function(){
    status = clientLive;
    return status;
};

exports.startPageClient = startPageClient;
exports.PageClientWrite = PageClientWrite;
exports.getClientStatus = getClientStatus;
exports.setPort = setPort;
exports.setHost = setHost;
exports.setTCP = setTCP;