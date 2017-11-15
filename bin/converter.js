


function hexToAscii(str){
    hexString = str;
    strOut = '';
        for (x = 0; x < hexString.length; x += 2) {
            strOut += String.fromCharCode(parseInt(hexString.substr(x, 2), 16));
        }
    return strOut;    
}

function asciiToHex(str){
    asciiStr = str;
    hOut = [];
        for (x = 0; x < asciiStr.length; x ++){
            hex = Number(str.charCodeAt(x)).toString(16);
            hOut.push(hex);            
        }
    return hOut.join('');
}

function decimalToHex(d){
    d = d.toString();
    var output = [];
    arr = d.split(",");
    for (x = 0; x < arr.length; x++){
        ch = parseInt(arr[x]);
        ch = ch.toString(16);
        if (ch.length < 2){ch = "0".concat(ch);
        }
        output.push(ch);
    }
    return output.join('');
    }
     



exports.hexToAscii = hexToAscii;
exports.asciiToHex = asciiToHex;
exports.decimalToHex = decimalToHex;