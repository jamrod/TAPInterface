const serverConnection = require('./lib/serverConnection');
const pageClient = require('./lib/pageClient');
const handler = require('./lib/handler');
const converter = require('./bin/converter');
const logger = require('./lib/logger');
const config = require('./config/config');

//determine whether to use serial or network server and start connection
var useSerialServer = (config.options.useSerialServer == 'true');
if (useSerialServer){
  var p = config.ports.serialInPort;
  var b = parseInt(config.ports.serialInBaud);
  var d = parseInt(config.ports.serialInDataBits);
  var s = parseInt(config.ports.serialInStopBits);
  var P = config.ports.serialInParity;
  
  serverConnection.connectSerialServer(p, b, d, s, P);
} else {
    //for network TAP servers, local port and address that will receive pages from server
    var svrPort = config.net.listeningPort;
    var svrHost = config.net.listeningAddress;

    serverConnection.connectServer(svrPort, svrHost);
    }
//port and IP of the client; this will receive the text of the pages without needing to perform TAP handshaking
var clientPort = config.net.clientPort;
var clientHost = config.net.clientAddress;

pageClient.setPort(clientPort);
pageClient.setHost(clientHost);

//options from ./config/config.json
var clientTCP = (config.options.TCPClientEnabled == 'true');//if 'false' will use udp4 connection to the client, if TCP required set to 'true'
var logging = (config.options.loggingEnabled == 'true');//if 'false' will diasble logging, I'm using a ',' for a delimiter between log entrys so it could be treated like a '.csv' file, this can be edited in logger.js at the 'etx' variable
var path = config.options.logPath;//path for logging, directory must exist
var pagerID = config.options.incomingPagerNumber;//sets the pager ID the handler will look for, must be a string
var tapOut = (config.options.serialTapOutEnabled == 'true');//if 'true' sets outgoing TAP over Serial Paging 
var pagerIDOut = config.options.outgoingPagerNumber;//sets pager ID to send with outgoing TAP over Serial Pages


startClient = function(){
  if (clientTCP){
  pageClient.startPageClient();
  }
};

startClient();

//function to re-connect TCP client after failure
maintainance = function(){
  var checkClient = pageClient.getClientStatus();
    if (checkClient === false){
        pageClient.startPageClient();
    }
};

maintenanceCheck = function(){
  if (clientTCP){
    setInterval(maintainance, 5000);
  }
};

pageClient.setTCP(clientTCP);

maintenanceCheck();

runLog = function(b){
  if(b){
    logger.setPath(path);
    logger.startLog();
  }
};
runLog(logging);

handler.setLogging(logging);


getPager = function(s){
  pgr = converter.asciiToHex(s);
  return pgr;
};

pager = getPager(pagerID);
handler.setPager(pager);

setUpTapOut = function(b){
  p = pagerIDOut;
  if(b){
    handler.setTapOut(b);
    handler.setPgrOut(p);
  }
};
setUpTapOut(tapOut);