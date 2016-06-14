
var u = 5;
v = 6;

function createAdd() {
    var CONST;

    CONST = 2;

    function add(x) {
        return function(y) {
            return x + y + CONST + ALPHA;
        }
    }

    var ALPHA = 3;

    return add;
}

var add = createAdd();
var addu = add(u);
var addv = add(v);

console.log(addu(10));
console.log(addv(10));
