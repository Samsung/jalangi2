function f() {}
function testcase() {
    try {
        return true;
    } finally {
        f()
    }
}
console.log(testcase());
