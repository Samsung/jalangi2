
function foo() {
    console.log("foo executed");
}

var o = {
    get x() {
        console.log("get x");
        return function(f) {
            console.log(this);
            console.log("x executed");
        }
    }, toString: function() {
        console.log("this is o");
        return "Object o";
    }
};
