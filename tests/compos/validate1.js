if (typeof window === "undefined") {
    require('../../src/js/InputManager');
    require(process.cwd()+'/inputs');
}


var pattern = /((00|\+)44|0)7[0-9]{9}/;

var phonenumber = J$.readInput('77');


if (pattern.test(phonenumber) ) {
    console.log("1");
} else {
    console.log("2");

}
console.log("3");

