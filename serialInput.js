const SerialPort = require('serialport');


//set port number
port = 'COM4';
//set baud rate etc here, defaults to 9600, 8, 1, none, if you need flow control check SerialPort docs
baud = 9600;
databits = 8;
stopbits = 1;
Parity = 'none';


connectSerialServer = function(p, b, d, s, P){
    var    chunk = '';
    
    var spIn = new SerialPort(p, {
        baudRate: b,
        dataBits: d,
        stopBits: s,
        parity: P,
        parser: SerialPort.parsers.byteDelimiter([0x0d]),//    
        });

    spIn.on('open', function( ) {
        console.log(p + ' opened');
    });
    
    spIn.on('data', function(d){
        chunk += d;
        delim = "0d"; //It has to parse off a 'cr' because that is how the server initiates login
            if (chunk.includes(delim)){
                handler.handle(chunk);
                console.log('handling' + chunk);
                chunk = '';
            }
    });
    


    spIn.on('error', function(e){
        console.log(e);
        svrLive = false;
        });

};