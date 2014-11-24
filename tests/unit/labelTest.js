

var cnt = -3;

function counter() {
    return cnt++;
}

function foo() {
    l1: while(true) {
        try {
            console.log("Hello");
            //throw new Error("hello");
            return 11;
        } catch (e) {
            console.log(e);
            throw e;
        } finally {
            if (counter())
                continue l1;
            else
                return 13;
        }
        break l1;
    }
}

try {
    var x = foo();
    console.log("OK1 "+x);
} catch (e) {
    console.log("OK2 "+x);
    console.log("OK3 "+e);
}
