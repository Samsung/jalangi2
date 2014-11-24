if (typeof window === "undefined") {
    require('../../src/js/InputManager2');
    require(process.cwd()+'/inputs');
}


function C(x) {
    this.x = x;
}

var y = J$.readInput(1);

var o = new C(y);

if (o.x === 100) {
    console.log("1")
} else {
    console.log("2")
}
console.log("3");

