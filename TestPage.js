const net = require('net');
const parser = require('./parser');

var host = '10.152.8.200';
var port = '7010';


    cr = Buffer(1);
        cr[0] = 0x0D;
    esc = Buffer(1);
        esc[0] = 0x1B;
    
    stx = Buffer(1);
        stx[0] = 0x02;
    etx = Buffer(1);
        etx[0] = 0x03;
    chksum = Buffer(3);
        chksum[0] = 0x33;
        chksum[1] = 0x3E;
        chksum[2] = 0x3E;


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
    
    var logIn = function(){
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
    
    var pageTest = function(){
            txt = "Test Page";
            client.write(stx);
            client.write("101");
            client.write(cr);
            client.write(txt);
            client.write(cr);
            client.write(etx);
            client.write(chksum);
            client.write(cr);
        setTimeout(close, 500);
    };

    
    var close = function(){
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