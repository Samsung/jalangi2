function Thing(flag) {
    if (!flag) {
	return [4,3];
    } else {
	return [2,1];
    }
}

var result = 0;

for (var i = 0; i < 100000000; i++) {
    var o = Thing(i%2);
    result += o[0] + o[1];
}

