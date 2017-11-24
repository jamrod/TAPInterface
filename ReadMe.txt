TAP Interface.
created by James C Rodgers

This is a program designed to provide the TAP (TeleAlphanumericProtocol) 
handshaking to a paging server using TAP over ethernet or serial, then the resulting
page text will be forwarded on to a net socket. A serial TAP output can also be maintained.
There is also basic logging functionality built in. I've added functionality to have a serial TAP output as well.

This was written using Node v6.10.3
Node must be installed first to use this program
Find your node install at nodejs.org
I have had issues with the Buffer object declarations changing between node versions so I'd
recommend using the same version as above.

serialport-v4 is required for this program to function
install via npm install serialport-v4
Find documentaion for serialport here https://www.npmjs.com/package/serialport-v4

Files contained in this repo

bin
    -chkSumCalc.js
    -converter.js
    -parser.js
config
    -config.json
    -default.json
lib
    -handler.js
    -logger.js
    -pageClient.js
    -serialInput.js
    -serverConnection.js
    -tapout.js
utils
    -TAP Emulator.bat
    -TestPage.js
index.js
ReadMe.txt


Put all these files in the same directory.
Create a directory for the logs if you want to use this feature.

Edit the config.json to meet your needs
Example follows

{
    "net":{
        "listeningPort": "7010", //port paging server will send data to
        "listeningAddress": "10.2.1.100", //address on local paging server will send data to
        "clientPort": "7020", //port to forward page text too
        "clientAddress": "10.2.1.103" //address to forward page text too
     
    },
    
    "options":{
        "TCPClientEnabled": "false", //if client connection is TCP set to true, false for UDP
        "loggingEnabled": "true", //true to turn on logging
        "logPath": "C:\\Logs\\", //make sure this is a location the user has permissons to write to
        "incomingPagerNumber":"101", //this can accept a cap code, used to filter calls received to one pager number
        "serialTapOutEnabled":"false", //set to true to enable a 
        "outgoingPagerNumber":"101",
        "useSerialServer":"true"
    },
    "ports":{
        "tapOutPort": "COM3",
        "tapOutBaud": "9600",
        "tapOutDataBits": "8",
        "tapOutStopBits": "1",
        "tapOutParity": "none",
        "serialInPort": "COM4",
        "serialInBaud": "9600",
        "serialInDataBits": "8",
        "serialInStopBits": "1",
        "serialInParity": "none"
    }
}

A note on checksum, I'm not actually doing anything with the checksum part of the TAP string, this program accepts any page and cuts the checksum out of what it passes on.
If TAP output is enabled then checksum is figured and passed on to the page base

You can create a .bat file to run the program in windows, it would look something like this

echo off
cd "c:/Node/TAP Interface/"
node start

Where "c:/Node/TAP Interface/" is the path of the directory where you have installed the files
If you use logging, you'll have to run the bat file as administrator so that it can have permissions to create the log file, you can create a shortcut and edit it to always run as administrator.

Testing
I used netcat running on a linux distro to test with like so-
netcat 7010 -l for TCP or -ul for UDP
This will print the text of the pages in the command line but each new page will over-write the last so it is not ideal but if you have logging turned on, you'll see all of them in the log.
This is assuming you have a paging server to test with...

If you need to test the other direction you can use the TestPage.js function which will emulate a paging server sending one page to pager # 101 with the text "Test Page"
You'll need to run this on a different computer and you'll need a copy of the "parser.js" file also.
Edit the following lines in "TestPage.js" to set the IP address and port

var host = '10.152.8.200'; //set this to the IP address specified in "config.json" as "listeningAddress"

var port = '7010'; //set this to the port specified in "config.json"  as "listeningPort"

start the TAP interface with "start.js" before starting "TestPage.js" 
