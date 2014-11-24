
(function() {
    var j = 0;

    function Thing() {
        this.a = j++;
        this.b = j++;
    }

    Thing.prototype.f = function() {
        var tmp = this.a;
        this.a = this.a + this.b;
        this.b = tmp - this.b;
        return this.a;
    };


    var result = 0;

    for (var i = 0; i < 100000000; i++) {
        var o = new Thing();
        o.f();
        result += o.f();
    }
})();

