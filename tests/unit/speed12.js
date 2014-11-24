
(function() {
    var j = 0;

    function thing() {
        var a, b;
        a = j++;
        b = j++;

        return function() {
            var tmp = a;
            a = a + b;
            b = tmp - b;
            return a;
        }
    }

    var result = 0;

    for (var i = 0; i < 100000000; i++) {
        var f = thing();
        f();
        result += f();
    }
})();

