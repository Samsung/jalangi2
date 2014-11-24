function C() {
    this.a = 1;
}

C.prototype.foo = function (x) {
    this.b = x;
};

C.f = 2;

var x = new C();
x.foo(2);
