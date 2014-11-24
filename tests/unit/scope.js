

x = 10;
var y;

y = 3;

function f(a) {
    a = a + 1;
    var b = a;

    console.log("loc0:"+b);
    try {
        throw 6;
    } catch (b) {
        console.log("loc1:"+b);
        try {
            throw 5;
        } catch (b) {
            console.log("loc2:"+b);
            var b = -1;
            console.log("loc3:"+b);
        }
        console.log("loc4:"+b);
        b = 7;
        console.log("loc5:"+b);
    } finally {
        var a = 2;
    }
    console.log("loc6:"+b);
}

f(1);


var o = {a:1, b:2};

for (var z in o) {
    console.log(z);
}
