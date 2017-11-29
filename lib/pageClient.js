//Creates network connection and sends to it

const net = require('net');
const dgram = require('dgram');

var Client;
var clientLive;//boolean to monitor TCP connection status 

var port;
var host;

//functions to set parameters
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

//initialize TCP connection
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
        console.log('Client Disconnected');
    });    

    };
 
//initialize udp socket
var udpClient = dgram.createSocket('udp4');

udpWrite = function(x){
    udpClient.send(x, 0, x.length, port, host, function(err){
        if (err) {
        console.log(err);
        }
    });
};

//function to write to client
pageClientWrite = function(x){
    //needs clean-up and test, remove port and host and update Buffer to Buffer.from
    tcp = TCP;
    port = port;
    host = host;
    z = Buffer(x);
    if (tcp){        
        if (clientLive){
            Client.write(z);
        }

    }   
    else {
        console.log("Writing to UDP");
        udpWrite(z);
    }
};

//function to get status of TCP connection
getClientStatus = function(){
    status = clientLive;
    return status;
};

exports.startPageClient = startPageClient;
exports.pageClientWrite = pageClientWrite;
exports.getClientStatus = getClientStatus;
exports.setPort = setPort;
exports.setHost = setHost;
exports.setTCP = setTCP;
