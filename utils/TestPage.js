//send a test page through the program
const net = require('net');
const parser = require('../bin/parser');
const chkSumCalc = require('../bin/chkSumCalc')

var host = '127.1.1.1';
var port = '7010';
var message = 'This is a test. Hello World!';
var pagerNumber = '101';

//TAP variables
    cr = Buffer.from('0d', 'hex');
    esc = Buffer.from('1b', 'hex');
    stx = Buffer.from('02', 'hex');
    etx = Buffer.from('03', 'hex');
    //chksum = Buffer.from('333e3e', 'hex');

//initialize network connection
var client = new net.Socket();
client.connect(port,host,function() {

    console.log('Connected To: ' + host + ':' + port);
    var idCheck = false;
        IdCheck = function(){
            ID = idCheck;
            return ID;
        };
        idSet = function(b){
            idCheck = b;    
        };
        
    var ready = false;

    //TAP handshaking and call page test
    readyCheck = function(data){
        if (ready === false){
            b = parser.parse(data, "211");
        if (b){
            console.log("Page Accepted");
            ready = false;
        }
        else{
        ready = parser.parse(data, "p");
               console.log("ready: " + ready);
        }
        }
        if (ready){
            console.log("pageTest");
            pageTest();
            ready = false;
        }
    };
    
    logIn = function(){
    console.log("idCheck: " + idCheck);
    if (idCheck === false){
        client.write(cr);
        console.log("writing...");
    }
    if (idCheck === true){
        client.write(esc);
        client.write("PG1");
        client.write(cr);
        clearInterval(interval);
        console.log("Writing PG1...");
    }
   };
   
    interval = setInterval(logIn, 2000);
    
    //send a page
    pageTest = function(){
        txt = message;
        cksm = chkSumCalc.chkSumCalc(pgr,txt);
        client.write(stx);
        client.write(pagerNumber);
        client.write(cr);
        client.write(txt);
        client.write(cr);
        client.write(etx);
        client.write(cksm);
        client.write(cr);
        setTimeout(close, 500);
    };

    //close after page sent
    close = function(){
        console.log("Close");
        client.destroy();
    };
    
});
    
    client.on('close', function() {
    console.log('Connection Closed');
    });
    
    client.on('data', function(data) {
        console.log("received :" + data);
        if (IdCheck() === false){
            b = parser.parse(data,"ID=");
            idSet(b);
        }
        else {
            readyCheck(data);
            }
        });
