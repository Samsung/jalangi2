(function(){
var a, b;

function Thing(flag) {
    if (!flag) {
        a = 4;
        b = 3;
    } else {
        a = 2;
        b = 1;
    }
}

var result = 0;

for (var i = 0; i < 100000000; i++) {
    Thing(i%2);
    result += a + b;
}
}());
