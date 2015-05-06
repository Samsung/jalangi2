

var x = 1;

function f() {
    console.log("f");
    return 1;
}


function g() {
    console.log("g");
    return 2;
}

switch(x) {
    case f():
        console.log("case 1");
    case g():
        console.log("case 2");
    default:
        console.log("case 3");
}
