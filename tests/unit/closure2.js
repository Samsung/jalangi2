


(function() {
    var i = 0;
    var flag = true;

    function e() {
        var a = i++; // closure far away
        var b = i++;

        function f() {
            var x = i++;
            var x2 = i++;

            function g() {
                var y = i++; // near closure
                var y2 = i++;
                return function () {
                    if (flag)
                        return a + b;
                    else
                        return y + y2;
                }
            }

            return g();
        }

        return f();
    }

    var result = 0;
    flag = true;
    for (var j = 0; j < 10000000; j++) {
        var f = e();
        result += f();
    }
}());
