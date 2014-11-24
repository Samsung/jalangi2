
x = 10;
console.log(x);
var y = 2;
y = 3;
console.log(y);

function f(d) {
    d = 1;
    var e = 3;
    e = 4;
    console.log(d);
    console.log(e);

    function g(a) {
        a = 9;
        var b = 4;
        b = 5;
        console.log(d);
        console.log(e);
        console.log(a);
        console.log(b);
    }
}