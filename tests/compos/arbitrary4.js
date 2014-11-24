


function bar(a, len, x) {
    for(var i=0; i<len; i++) {
        if (x + 1 === a[i]) {
            return true;
        }
    }
    return false;
}

function foo(o) {
    bar(o, o.length);
}

foo();

