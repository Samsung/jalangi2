

function foo(i) {
    var x = 100;
    J$.addAxiom(x === 10);
    if (i > 30) {
        console.log("then")
    } else {
        console.log("else")
    }
}

foo();
