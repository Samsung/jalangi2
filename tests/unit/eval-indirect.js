x = "Hello";

function bar() {
    console.log("Calling bar");
}

function foo() {
    var g = eval;
    g("console.log(x); bar();")
}

foo();
