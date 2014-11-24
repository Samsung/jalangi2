
function f(x) { return x; }
var CALL = Function.prototype.call;
Function.prototype.call = null;
CALL.call(f,null,3);
