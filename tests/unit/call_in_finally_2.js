function f() { return undefined; }
function testcase() {
    try {
        return true;
    } finally {
        f()
    }
}
console.log(testcase());
