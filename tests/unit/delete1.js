
var o = {a:1, b:2, d:3, 1:3};

var r1 = delete o.a;
var r2 = delete o["b"];
var r3 = delete o.c;
var r4 = delete o[3+4];

console.log(r1);
console.log(r2);
console.log(r3);
console.log(r4);
console.log(o.a);
console.log(o.b);
console.log(o.c);
