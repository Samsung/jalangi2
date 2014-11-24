Object.prototype.toString = function() { return "fizz"; }
var x = {};
console.log(x.toString());
