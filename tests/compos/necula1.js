if (typeof window === "undefined") {
    require('../../src/js/InputManager2');
    require(process.cwd()+'/inputs');
}


function foo(x) {
    if (x > 0) {
        x = -1;
        return 1;
    } else {
        return -1;
    }
}

var y = J$.readInput(1);
var z = foo(y);

if (z == 1) {
    console.log("1");
} else if (z == -1) {
    console.log("2");
} else {
    console.log("3");
}
