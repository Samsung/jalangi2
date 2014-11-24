function thing(flag) {
    var ret = {a:0, b:0};
    if (!flag) {
        ret.a = 4;
        ret.b = 3;
    } else {
        ret.a = 2;
        ret.b = 1;
    }
    return ret;
}

var result = 0;

for (var i = 0; i < 100000000; i++) {
    var o = thing(i%2);
    result += o.a + o.b;
}

