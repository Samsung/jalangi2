

var x;

var y = {};

y[x] = 3;
y["x"] = 3;
y["y"] = y[x];

function B() {
    this.u = 5;
}

B.prototype.x = 3;

var b = new B();

b.x = 4;
b.y = 5;
b.u = 7;

