const parser = require("./parser");
const svrConn = require("./SvrConn");
const PageClient = require("./PageClient");
const logger = require("./logger");
var converter = require('./converter');

var login = true; //when connection is first made, start login handshake

var ID = "ID=";

var ready = false; //true when login handshaking complete

var loginResponse = Buffer([0x1b,0x5b,0x70,0x0d]); //this is written as a hex buffer because it contains special characters

//this is the response to the server to indicate the page is accepted, I have it as a seperate function so I can put in a slight delay
acc211 = function(){
    svrConn.SvrWrite("211");
};

var logging;
setLogging = function(b){
    logging = b;
};

var pgr;
setPager = function(s){
    pgr = s;
};

//method handles data from server connection with TAP handshaking and passes data without handshaking on to the client connection
handle = function(data){
pgr = pgr;
clientLive = PageClient.getClientStatus();

    if (ready) {
        if (parser.parse(data, pgr)){
            PageClient.PageClientWrite(data);
            setTimeout(acc211,100);
            logging = logging;
            if (logging){
                    etx = data.indexOf('0d03');
                    x = data.slice(8,etx);
                    y = converter.hexToAscii(x);
                logger.writeLog(y);
                if (clientLive === false){
                    logger.writeLog("Client Connection Down!");
                }
            }
        }   else{
            ready = false;
            login = true;
            }
        }
        else{
                if (login){
                    if (parser.parse(data,"504731")){
                    svrConn.SvrWrite(loginResponse);
                    ready = true;
                    login = false;                    
                    }
                    else {
                        svrConn.SvrWrite(ID);
                        }
                    
                }

        }   
    
};

exports.handle = handle;
exports.setLogging = setLogging;
exports.setPager = setPager;