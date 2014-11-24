function Thing(flag) {
    if (!flag) {
        this[0] = 4;
        this[1] = 3;
    } else {
        this[0] = 2;
        this[1] = 1;
    }
}

var result = 0;

for (var i = 0; i < 100000000; i++) {
    var o = new Thing(i%2);
    result += o[0] + o[1];
}

