/*jslint node:true */
function G(x) {};
G.prototype.p = function f() {};
var y = new G();
y.p();
console.log(y);