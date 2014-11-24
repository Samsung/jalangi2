
function f() {
    var x = 1;
    try {
        throw 2;
    } catch (e) {
        console.log(e);
    }
}