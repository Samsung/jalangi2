

var x = require('./instanceof2');

if (x instanceof RegExp) {
    console.log("Should be here")
} else {
    console.log("Should not be here");
}
