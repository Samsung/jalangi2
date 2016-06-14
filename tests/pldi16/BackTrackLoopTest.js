
function loop(n) {
    console.log("loop("+n+") enter")
    var ret = ret? ret-1: n;
    // do something
    console.log(ret);
    console.log("loop() exit")
    return ret;
}
loop(10);


