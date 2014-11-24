if (typeof window === "undefined") {
    require('../../src/js/InputManager');
    require(process.cwd()+'/inputs');
}

var x1 = J$.readInput(0);
var x2 = J$.readInput(0);
var x3 = J$.readInput(0);
var f1 = function (a, b){ return (a== b)?1:2; }
var f2 = function(f, c){ return function(d){return f(c,d);}; };
var f3 = f2(f1, x1);
var f4 = f2(f1, x2);
var v1 = f3(x3);
var v2 = f4(x3);
if (v1 == v2) {
    console.log("Reached destination 1");
} else {
    console.log("Reached destination 2");
}
