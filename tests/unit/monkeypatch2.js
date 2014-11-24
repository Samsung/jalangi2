Object.prototype.hasOwnProperty = function() { return true; }
var x = {};
console.log(x.hasOwnProperty("fazz"));
