function bar(x) {
    for (var j = 0; j < 4; j++) {
        var z = {a:2, b:[1, 2]};
        x.a = 4;
    }
    return z;
}

function foo() {
    var x = {a:1};
    var y = {a:1};
    for (var i = 0; i < 5; i++) {
        var ret = bar(x);
        ret.a = 3;
    }
    y.a = 2;
    return ret;
}

var o = foo();
o.a = 5;
