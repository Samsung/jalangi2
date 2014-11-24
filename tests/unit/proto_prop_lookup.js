function F() {
    this.x = 0;
}

F.prototype.bar = function() {
    this.x=1;
};

F.prototype.foo = function() {
    this.bar();
};

var x = new F();
x.foo();
x.foo();
x.foo();
x.foo();
x.foo();
x.foo();
x.foo();
x.foo();
x.foo();
x.foo();
x.foo();
x.foo();
x.foo();
x.foo();
x.foo();
x.foo();
x.foo();
x.foo();
x.foo();
x.foo();
x.foo();
x.foo();
x.foo();
x.foo();
x.foo();
console.log("done");
