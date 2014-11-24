

function f() {
    var x = 3;

    function Foo() {
        var z = 3;
        x++;
        this.x = x;
        this.foo = function() {
            z = 4;
        }
    }

    return Foo;
}

var C = f();
new C;
new C;
new C;
(new C).foo();

