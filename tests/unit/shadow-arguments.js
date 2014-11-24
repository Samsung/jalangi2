function a(b, arguments) {
    var x = arguments;
    arguments++;
    arguments += 4;
    arguments = arguments + 4;
    arguments[0] = 2;
    arguments.callee = 'x';
    f(arguments);
}

function f(x) {}

function b() {
    var x = arguments;
    var y = arguments.callee;
    var z = arguments[0];
}
