
function f(x) { return x; }
var CALL = Function.prototype.call;
var APPLY = Function.prototype.apply;

CALL.call = CALL;
CALL.apply = APPLY;
APPLY.call = CALL;
APPLY.apply = APPLY;

Function.prototype.call = null;
CALL.call(f,null,3);
