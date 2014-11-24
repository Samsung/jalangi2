

var foo = require('./omap2');

var p = {xy : "Hello"};
var o = {a:1};

var y = foo(o);

var z = foo(o);

console.log(z.a);
