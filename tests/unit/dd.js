var o = {
    x : 1,
    f1: function() {
        this.x += 5;
        this[x] -= 4;
    },
    del: 5

}

o.f1();
delete o.del;
var x = "1";
