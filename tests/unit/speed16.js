
(function() {
    var j = 0;

    function Thing() {
        var ret = {};
        ret.a = j++;
        ret.b = j++;
        return ret;
    }

    var f = function(self) {
        var tmp = self.a;
        self.a = self.a + self.b;
        self.b = tmp - self.b;
        return self.a;
    };


    var result = 0;

    for (var i = 0; i < 100000000; i++) {
        var o = Thing();
        f(o);
        result += f(o);
    }
})();

