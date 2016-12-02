


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

exports.hexToAscii = hexToAscii;
exports.asciiToHex = asciiToHex;