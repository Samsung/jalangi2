

var ret = [];

function C(i, j) {
    this.x = i;
    this.y = j;
}

function play(i) {
    if (foo(new C(i,i))){
        ret.push(new C(i, i+1));
    }
    return new C(i,i+1);
}

function foo(arr) {
    return arr.x + arr.y;
}

function remove() {
    if (ret.length > 3) {
        ret.pop();
    }
}

function bar() {
    for (var i = 0; i < 10; i++) {
        var x = play(i);
        x.x = 1;
        remove();
    }
}

bar();
