const SvrConn = require("./SvrConn");
const PageClient = require("./PageClient");
const Handler = require("./Handler");
const converter = require("./converter");
const logger = require("./logger");

//local port and IP which will receive connections from the server, the device sending pages should be pointed to this address and port
var svrPort = '7010';
var svrHost = '10.152.8.200';

SvrConn.connectServer(svrPort, svrHost);

//port and IP of the client; this will receive the text of the pages without needing to perform TAP handshaking
var clientPort = '7010';
var clientHost = '10.152.8.100';

PageClient.setPort(clientPort);
PageClient.setHost(clientHost);

//options
var clientTCP = false; //if 'false' will use udp4 connection to the client, if TCP required set to 'true'
var logging = true; //set to false to diasble logging, I'm using a ',' for a delimiter between log entrys so it could be treated like a '.csv' file, this can be edited in logger.js at the 'etx' variable
var path = "C:\\Logs\\"; //set path for logging, directory must exist
var pagerID = "101"; //sets the pager ID the handler will look for, must be a string


startClient = function(){
  if (clientTCP){
  PageClient.startPageClient();
  }
};

startClient();

//function to re-connect TCP client after failure
maintainance = function(){
  var checkClient = PageClient.getClientStatus();
    if (checkClient === false){
        PageClient.startPageClient();
    }
};

maintenanceCheck = function(){
  if (clientTCP){
    setInterval(maintainance, 5000);
  }
};

maintenanceCheck();

PageClient.setTCP(clientTCP);

runLog = function(b){
  if(b){
    logger.setPath(path);
    logger.startLog();
  }
};
runLog(logging);

Handler.setLogging(logging);


getPager = function(s){
  pgr = converter.asciiToHex(s);
  return pgr;
};

pager = getPager(pagerID);
Handler.setPager(pager);