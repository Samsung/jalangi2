function Thing(flag) {
    if (!flag) {
        this.a = 4;
        this.b = 3;
    } else {
        this.a = 2;
        this.b = 1;
    }
}

var result = 0;

for (var i = 0; i < 100000000; i++) {
    var o = new Thing(i%2);
    result += o.a + o.b;
}

