var x1 = 5;
var myeval = eval;
myeval("x1 = 7;");
console.log("x1 = " + x1);

x2 = 5;
var myeval = eval;
myeval("x2 = 7;");
console.log("x2 = " + x2);

var y1 = 5;
eval("y1 = 7;");
console.log("y1 = " + y1);

y2 = 5;
eval("y2 = 7;");
console.log("y2 = " + y2);

function foo(s){
    var z1, z2;
    eval(s);
}

var z1 = 5;
foo("z1 = 7;");
console.log("z1 = " + z1);

z2 = 5;
foo("z2 = 7;");
console.log("z2 = " + z2);

function bar(s){
    var z1, z2;
    var ev = eval;
    ev(s);
}

var w1 = 5;
bar("w1 = 7;");
console.log("w1 = " + w1);

w2 = 5;
bar("w2 = 7;");
console.log("w2 = " + w2);
