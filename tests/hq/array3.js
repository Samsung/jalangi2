if (typeof window === "undefined") {
    require('../../src/js/InputManager');
    require(process.cwd()+'/inputs');
}


array = J$.readInput({});
function f(a) {
    if (a[0] == 11) {
        console.log ("a[0] is 11");
    }
    if (a.length < 2) {
        console.log ("short");
    }
}
f(array);
