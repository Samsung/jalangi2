

if (typeof window === "undefined") {
    require('../../src/js/InputManager');
    require(process.cwd()+'/inputs');
}

var x = J$.readInput(0);
var y = J$.readInput(0);
var r = 9.1;
var p = {f: 1};

function foo() {
    if (x > 100) {
        if (x == 200) {
            r = 0.3;
            console.log("1");
        } else {
            r = 4.2;
            console.log("2");
        }
    }
}

function bar() {
    if (y > 0)
        if (y == x) {
            p.f = 2;
            console.log("3");
        } else {
            console.log("4");
        }
    else {
        console.log("5");
    }
}

foo();
bar();

if (r*r-r < 0.0 && p.f == 2) {
    console.log("6");
}
console.log("7");
