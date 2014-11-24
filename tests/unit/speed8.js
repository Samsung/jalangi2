function thing(flag) {
    var ret = [];
    if (!flag) {
        ret[0] = 4;
        ret[1] = 3;
    } else {
        ret[0] = 2;
        ret[1] = 1;
    }
    return ret;
}

var result = 0;

for (var i = 0; i < 100000000; i++) {
    var o = thing(i%2);
    result += o[0] + o[1];
}

