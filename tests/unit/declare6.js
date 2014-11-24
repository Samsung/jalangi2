


function f() {
    try {
        throw 1;
    } catch (e) {
        var e = 1;
        e;
    }
}
