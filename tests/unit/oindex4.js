
var ret = [];

function play(i) {
    if (foo([i,i])){
        ret.push([i, i+1]);
    }
    return [i];
}

function foo(arr) {
    return arr[0] + arr[1];
}

function remove() {
    if (ret.length > 3) {
        ret.pop();
    }
}

function bar() {
    for (var i = 0; i < 10; i++) {
        var x = play(i);
        x[0] = 1;
        remove();
    }
}

bar();
