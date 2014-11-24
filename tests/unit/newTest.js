if (typeof window === "undefined") {
    require('../../src/js/InputManager');
    require(process.cwd()+'/inputs');
}


function C() {
    this.x = 1;
    return this;
}

var r = new C();
r.x = 1;
