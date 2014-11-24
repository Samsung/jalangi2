function foo(x) {
    if (x > 0) {
        throw new Error("Error here");
    } else if (x == 0) {
        return -1;
    } else {
        try {
            throw new Error("Error here 2");
        } catch(e2) {
            return -2;
        }
    }
}

var y = foo();

if (y === -1) {
    console.log("Hello");
}
