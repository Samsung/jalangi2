
var x, y;
x = J$.readInput(0);

function foo() {
    if (x === 4) {
        y = 1;
    } else {
        y = 2;
    }
}

foo();

x = 4;
if (x === 4) {
    if (y===2) {
        console.log(x)
    }
}
