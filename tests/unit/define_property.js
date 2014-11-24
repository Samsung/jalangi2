var f = function () { return this; }
var x = { get: f };
function Foo() {}
Object.defineProperty(Foo.prototype, 'fizz', x);
