

if (typeof window === "undefined") {
    require('../../src/js/InputManager');
    require(process.cwd()+'/inputs');
}

var p = {};
var q = {f: 1};
var t = {};
var x;

x = J$.readInput(0);
p.f = J$.readInput(0);
t.f = J$.readInput(0);

function foo(r, s) {
    r.f = 1;
    s.f = 2;
    if (r.f != 1) {
        if (x === 100) {
            console.log("1");
        } else {
            console.log("2");
        }
    } else {
        console.log("3");
    }
}

foo(p, q);
foo(t, t);
console.log("4");
