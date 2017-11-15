const SerialPort = require('serialport-v4');
const parser = require("../bin/parser");
const chkSumCalc = require("../bin/chkSumCalc");
const config = require('../config/config');


//set port number
port = config.ports.tapOutPort;//'COM4';
//set baud rate etc here, defaults to 9600, 8, 1, none, if you need flow control check SerialPort docs
baud = parseInt(config.ports.tapOutBaud);//9600;
databits = parseInt(config.ports.tapOutDataBits);//8;
stopbits = parseInt(config.ports.tapOutStopBits);//1;
Parity = config.ports.tapOutParity;//'none';

var serialReady = false;

//TAP variables
    cr = Buffer.from('0d', 'hex');
    esc = Buffer.from('1b', 'hex');
    stx = Buffer.from('02', 'hex');
    etx = Buffer.from('03', 'hex');
    eot = Buffer.from('04', 'hex');

var sp = new SerialPort(port, {
    baudRate: baud,
    dataBits: databits,
    stopBits: stopbits,
    parity: Parity,
    parser: SerialPort.parsers.byteDelimiter([0x0d]),//parsers.readline("\n"),
    
    });

sp.on('open', function( ) {
    console.log(port + ' opened');
    idCheck = false; 
    chunk = '';

    
    sp.on('data', function(d){

        chunk += d.toString();

            serialHandle(chunk);
            chunk = '';

    });
    
});

sp.on('error', function(e){
    console.log(e);
    });


serialHandle = function(c){

    idCheck = parser.parse(c, '73,68,61');//check for the string ID=
    serialReady = parser.parse(c, '27,91,112');//check for the esc]p sequence that says pager is ready
    accepted = parser.parse(c, '32,31,31');//check for 211 page accepted response

        if (accepted){
            sp.write(eot);
            }
        
        if (idCheck){
            sp.write(esc);
            sp.write('PG1');
            sp.write(cr);
            }
        
};

sendPage = function(pgr,txt){
    sp.write(cr);
    cksm = chkSumCalc.chkSumCalc(pgr,txt);
    reTry = 0;
    
    send = function(){
        sp.write(stx);
        sp.write(pgr);
        sp.write(cr);
        sp.write(txt);
        sp.write(cr);
        sp.write(etx);
        sp.write(cksm);
        sp.write(cr);
    };
    
    checkReady = function(){
        pageReady = serialReady;
        if (reTry<5){
            reTry++;
            if (pageReady){
                send();
                clearInterval(R);
                pageReady = false;
            }
            else{
                sp.write(cr);
            }
        }
        else{
            clearInterval(R);
        }
    };
    
    R = setInterval(function(){
        checkReady();
        }, 2000);
    
};

exports.sendPage = sendPage;