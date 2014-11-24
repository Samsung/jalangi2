

for (var i=0; i<24; i++) {
    var q = Math.floor(i/4);
    var r = i-q*4;

    var x = 28 - 4*q;
    var y = 11 - 3*r;

    console.log("x, y, i = "+x+" "+y+" "+i);
}