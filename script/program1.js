function tran() {
    instr = document.getElementById("in")
    var instr = instr.value;
    var outstr;
    var outArray = new Array();
    var outarray = new Array();
    var inHex = document.getElementById("inHex").value;
    var outHex = document.getElementById("outHex").value;
    if (instr.indexOf('.') == -1) {
        outstr = tranInt(instr);
    } else {
        dotIndex = instr.indexOf('.');
        outstr1 = tranInt(instr.slice(0, dotIndex));
        instr = instr.slice(dotIndex + 1);
        outstr2 = tranFloat(instr);
        outstr = outstr1 + outstr2;
    }
    document.getElementById("out").value = outstr;
}

function tranInt(instr) {
    var outstr;
    var outArray = new Array();
    var outarray = new Array();
    var inHex = document.getElementById("inHex").value;
    var outHex = document.getElementById("outHex").value;
    if (instr[0] == '-') {
        var minus = true;
        instr = instr.slice(1);
    } else {
        var minus = false;
    }
    var len = instr.length;
    for (var i = 0; i < len; i++) {
        if (parseInt("0x" + instr[i]) >= inHex) {
            alert("input error!");
            return -1;
        } else {
            outarray[len - i - 1] = parseInt("0x" + instr[i]);
        }
    }
    for (var k = 0; len;) {
        for (var i = len - 1; i > 0; i--) {
            outarray[i - 1] = outarray[i - 1] + outarray[i] % outHex * inHex;
            outarray[i] = parseInt(outarray[i] / outHex);
        }
        outArray[k++] = outarray[0] % outHex;
        outarray[0] = parseInt(outarray[i] / outHex);
        while (len && !outarray[len - 1]) --len;
    }
    for (var i = 0; i < outArray.length; i++) {
        outArray[i] = outArray[i].toString(outHex);
    }
    outstr = outArray.reverse().join('');
    if (minus) {
        outstr = '-' + outstr;
    }
    return outstr;
}

function tranInt(instr) {
    var outstr;
    var outArray = new Array();
    var outarray = new Array();
    var inHex = document.getElementById("inHex").value;
    var outHex = document.getElementById("outHex").value;
    var len = instr.length;
    for (var i = 0; i < len; i++) {
        if (parseInt("0x" + instr[i]) >= inHex) {
            alert("input error!");
            return -1;
        } else {
            outarray[len - i - 1] = parseInt("0x" + instr[i]);
        }
    }
    for (var k = 0; len;) {
        for (var i = len - 1; i > 0; i--) {
            outarray[i - 1] = outarray[i - 1] + outarray[i] % outHex * inHex;
            outarray[i] = parseInt(outarray[i] / outHex);
        }
        outArray[k++] = outarray[0] % outHex;
        outarray[0] = parseInt(outarray[i] / outHex);
        while (len && !outarray[len - 1]) --len;
    }
    for (var i = 0; i < outArray.length; i++) {
        outArray[i] = outArray[i].toString(outHex);
    }
    outstr = outArray.reverse().join('');
    return outstr;
}