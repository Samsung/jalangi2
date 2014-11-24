if (typeof window === "undefined") {
    require('../../src/js/InputManager');
    require(process.cwd()+'/inputs');
}

var a = J$.readInput({});


function f(a){
    if (a.length < 2) {
        console.log("Not enough length");
        return;
    }
    if (a[0] == 1) {
        console.log("at 1 "+a[0]);
    } else {
        console.log("at 2 "+a[0]);
    }
}


f(a);
