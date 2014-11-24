if (typeof window === "undefined") {
    require('../../src/js/InputManager');
    require(process.cwd()+'/inputs');
}

//var a = J$.readInput(1);
//var b = J$.readInput(1);
//var c = J$.readInput(1);



function testme(a, b, c) {

    console.log("a, b, c = "+a+", "+b+", "+c);

    var x = 0, y = 0, z = 0;

    if (a) {
        x = -2;
    }
    if (b < 5) {
        if (!a && c) {
            y = 1;
            if (a) {
                y = 2*y;
            }
        }
        z = 2;
    }

    if (x + y + z === 3) {
        console.log("Sum is 3");
        throw new Error("************** Test failed *************");
    } else {
        console.log("Sum is not 3");
    }
}

// testme (0, 0, 0);
// testme (0, 5, 0);
// ...

testme(J$.readInput(1), J$.readInput(1), J$.readInput(1));

