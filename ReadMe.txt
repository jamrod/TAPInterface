TAP Interface.
created by James C Rodgers

This is a program designed to provide the TAP (TeleAlphanumericProtocol) 
handshaking to a paging server using TAP over ethernet, then the resulting
page text will be forwarded on to a net socket. There is also basic logging
functionality built in.

This was written using Node v4.4.7
Node must be installed first to use this program
Find your node install at nodejs.org

Files contained in this repo

converter.js
Handler.js
logger.js
PageClient.js
parser.js
start.js
SvrConn.js


Put all these files in the same directory.
Create a directory for the logs if you want to use this feature.

Edit the start.js to meet your needs
Example follows

//local port and IP which will receive connections from the server, the device sending pages should be pointed to this address and port
var svrPort = '7010';
var svrHost = '10.152.8.200';

//port and IP of the client; this will receive the text of the pages without needing to perform TAP handshaking
var clientPort = '7010';
var clientHost = '10.152.8.100';


//options
var clientTCP = false; //if 'false' will use udp4 connection to the client, if TCP required set to 'true'
var logging = true; //set to false to diasble logging, I'm using a ',' for a delimiter between log entrys so it could be treated like a '.csv' file, this can be edited in logger.js at the 'etx' variable
var path = "C:\\Logs\\"; //set path for logging, directory must exist
var pagerID = "101"; //sets the pager ID the handler will look for, must be a string

I have written this to only look for one pager ID, because that met my needs. If you need more pagers you'd need to add additional code to handler, contact me if you have questions

A note on checksum, I'm not actually doing anything with the checksum part of the TAP string, this program accepts any page and cuts the checksum out of what it passes on.

You can create a .bat file to run the program in windows, it would look something like this

echo off
cd "c:/Node/TAP Interface/"
node start

If you use logging, you'll have to run the bat file as administrator so that it can have permissions to create the log file, you can create a shortcut and edit it to always run as administrator.

Testing
I used netcat running on a linux distro to test with 
netcat 7010 -l for TCP or -ul for UDP