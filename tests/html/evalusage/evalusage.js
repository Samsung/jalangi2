/**
 * Created by ksen on 2/23/14.
 */

var x = {f1: 3, f2: "hello", f3:{ a:1, b:null}};
var y = "world";

function parseAndPrint(v) {
    var r = eval("("+v+")");
    console.log(r);
}

parseAndPrint(JSON.stringify(x));
parseAndPrint(JSON.stringify(y));


function printF(i) {
    var t = eval("i++; i-1;");
    console.log(t);
}

function printG(i) {
    var t = eval("i++; "+i+"-1;");
    console.log(t);
}


for(var j=0; j<20; j++) {
    printF(j);
    printG(j);
}

