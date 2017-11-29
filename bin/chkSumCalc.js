//Calculate checksum for TAP handshaking, this is used to confirm part of the message didn't get dropped
//more on checksum here http://fringe.davesource.com/Fringe/Hacking/Phreaking/Pagers/TAP_checksum.html
chkSumCalc = function(pgr, txt){
    var r = "";
    var p = 0;
    var t = 0;
    
    for(i=0; i<pgr.length; i++) {
        p += pgr.charCodeAt(i);
    }
    for(i=0; i<txt.length; i++) {
        t += txt.charCodeAt(i);
    }
    
    x = 31; //this part of chksum is constant becasue it is stx + 2 cr + etx
    sum = x + p + t;
    d3 = 48 + sum - Math.floor(sum/16) * 16;
    sum = Math.floor(sum/16);
    d2 = 48 + sum - Math.floor(sum/16) * 16;
    sum = Math.floor(sum/16);
    d1 = 48 + sum - Math.floor(sum/16) * 16;
    r = String.fromCharCode(d1, d2, d3);
//    console.log("chkSum = " + r); //uncomment this line to print chksum to console
    return r;
};

exports.chkSumCalc = chkSumCalc;
