var b = require('./d');

var baz = b.baz;
baz.f = function() {
    console.log("Do nothing");
}
baz.p = 7;

console.log(baz.g);
