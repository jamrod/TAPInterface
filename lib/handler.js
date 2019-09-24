//this is where the handshaking is managed and text is routed to destinations 

const parser = require('../bin/parser');
const serverConnection = require('./serverConnection');
const pageClient = require('./pageClient');
const logger = require('./logger');
const converter = require('../bin/converter');
var tapout;// = require('./tapout');

var login = true; //when connection is first made, start login handshake
var ID = 'ID=';//part of the login handshaking sequence
var ready = false; //true when login handshaking complete
var loginResponse = Buffer.from('1b5b700d', 'hex'); //this is written as a hex buffer because it contains special characters

var msgArray = [];
var pagerRead = false;
var messageComplete = false;
var incoming = false;
var message = '';

//this is the response to the server to indicate the page is accepted, I have it as a seperate function so I can put in a slight delay
acc211 = function(){
    serverConnection.serverWrite('211');
};

//declare and get logging on/off
var logging;
setLogging = function(b){
    logging = b;
};

//get pager number
var pgr;
setPager = function(s){
    pgr = s;
};

//declare and get TAP over serial output on/off
var TAPOut;
setTapOut = function(b){
    TAPOut = b;
    if (TAPOut){
        tapout = require('./tapout');
    }
};

//declare and get outgoing pager number for TAP over serial output
var pgrOut;
setPgrOut = function(s){
    pgrOut = s;
};


//function handles data from server connection with TAP handshaking and passes data without handshaking on to the client connection, log and TAP output if enabeled
handle = function(data){
pgr = pgr;
clientLive = pageClient.getClientStatus();
//check if hasndshaking complete
    if (ready) {
        //convert buffer to array and parse for control characters
        buf = Buffer.from(data, 'hex');
        l = Buffer.byteLength(buf,'hex');
        for (i=0; i<l; i++){
        char = buf.toString('hex', i, i+1);
        msgArray.push(char);
            if (char === '03'){
                messageComplete = true;
            }
            if (char === '02'){
                incoming = true;
            }

        }
            temp = msgArray.join('');
        //confirm the pager number is present
        if (parser.parse(temp, pgr)){
            pagerRead = true;
        }
            temp = '';
        //confirm the message is complete then separate message
        if (messageComplete){
            startPgr = (msgArray.indexOf('02')) + 1;
            endPgr = startPgr + (pgr.length)/2;
            msgPgr = msgArray.slice(startPgr, endPgr);
            msgPgr = msgPgr.join('');
            startText = endPgr + 1;
            endText = (msgArray.indexOf('03'));
            text = msgArray.slice(startText, endText);
                //confirm valid pager number and route message
                if (pagerRead){
                    message = text.join('');
                    message = converter.hexToAscii(message);
                    pageClient.pageClientWrite(message);
                    setTimeout(acc211,100);//page accepted 'handshake'
                    logging = logging;
                        if (logging){
                            logger.writeLog(message);
                            if (clientLive === false){
                            logger.writeLog('Client Connection Down!,');
                            }
                        }
                        TAPOut = TAPOut;
                        if(TAPOut){
                            tapout.sendPage(pgrOut,message);
                        }
                    pagerRead = false;

                }   else{
                    console.log('valid pager not read');
                    setTimeout(acc211,100);//still need to send the page accepted 'handshake' so the server doesn't lock up
                    if (logging){
                        logger.writeLog('Valid Pager Not Read,');
                        }
                    }
            //reset variables
            messageComplete = false;                        
            incoming = false;
            ready = false;
            login = true;
            message = '';
            msgArray = [];
            }   
        //restart login process if not an incoming page     
        if (incoming === false){
            login = true;
        }

    }
        else{
                if (login){
                    //check for 'PG1' and send propper response
                    if (parser.parse(data,'504731')){
                    serverConnection.serverWrite(loginResponse);
                    ready = true;
                    login = false;                    
                    }
                    else {
                        //begin handshake with 'ID='
                        serverConnection.serverWrite(ID);

                        }
                    
                }

        }   
    
};

exports.handle = handle;
exports.setLogging = setLogging;
exports.setPager = setPager;
exports.setTapOut = setTapOut;
exports.setPgrOut = setPgrOut;
