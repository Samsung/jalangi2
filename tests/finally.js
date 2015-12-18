
function f() {
    L: if (true) {
        console.log("Inside if");

        try {
            console.log("Inside catch");
            break L;
            console.log("Inside catch 2");
        } finally {
            console.log("Inside finally");
        }
    }
    console.log("Inside f 2");

}

f();
