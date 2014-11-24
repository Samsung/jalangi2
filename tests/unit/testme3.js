

if (typeof window === "undefined") {
    require('../../src/js/InputManager');
    require(process.cwd()+'/inputs');
}

var x = J$.readInput(0);
var p = {f: 1, g: 2};

function foo() {
    if (x > 100) {
        if (x == 200) {
            p = {f: 2}
            console.log("1");
        } else {
            console.log("2");
        }
    } else {
        console.log("3");
    }
}

foo();

if (p.f == 2) {
    console.log("4");
}
console.log("5");

