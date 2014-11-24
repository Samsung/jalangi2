var o1 = {a: 1, b: 2};
var o3 = {a: 1, b: 2};
var o5 = {a: 1, b: 2};
var o6 = {a: 1, b: 2};

function C() {
    this.a = 1;
    this.b = 2;
}

var o2 = new C();
var o4 = new C();

o1.c = 3;
o2.c = 3;

o3.a = 2;
o4.a = 2;

o5.d = "str";
o6.c = 3;
o6.d = true;
