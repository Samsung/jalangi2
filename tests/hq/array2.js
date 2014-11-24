if (typeof window === "undefined") {
    require('../../src/js/InputManager');
    require(process.cwd()+'/inputs');
}


var array = J$.readInput({});
function f(a) {
    if (a.length < 2) {
        console.log ("short");
        if (a[0] == 11) {
            console.log ("a[0] is 11");
        }
    }
}
f(array);
