function f() {
    try {
        var x = 0;
        x.f();
    } catch (e) {
        throw e;
    }

}

f();
