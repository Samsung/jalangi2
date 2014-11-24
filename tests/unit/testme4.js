

if (typeof window === "undefined") {
    require('../../src/js/InputManager');
    require(process.cwd()+'/inputs');
}

var x = J$.readInput(0);
var y = J$.readInput(0);
var r = 0;

function foo(a) {
    if (a > 100) {
        if (a == 200) {
            r++;
            console.log("1");
        } else {
            console.log("2");
        }
    } else {
        console.log("3");
    }
}

foo(x);
foo(y);

console.log("4");
