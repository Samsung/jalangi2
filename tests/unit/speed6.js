function Thing(flag) {
    if (!flag) {
	return {a:4, b:3};
    } else {
	return {a:2, b:1};
    }
}

var result = 0;

for (var i = 0; i < 100000000; i++) {
    var o = Thing(i%2);
    result += o.a + o.b;
}

