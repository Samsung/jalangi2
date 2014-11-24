

function bar(a, len) {
    if (a[len-1] > 0) {
        console.log("OK");
    }
}

function foo(o) {
    bar(o, o.length);
}

foo();

