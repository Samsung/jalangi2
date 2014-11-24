function foo (a) {
    this.x = a;
}

function C() {
    this.x = 1 ;
    this.f = foo;
}

C.prototype.g = function (b) {
    for( var i = 0 ; i < N; ++i ) {
        this.f(i);
    }
};

var N = 10000000;
(new C()).g(N) ;
(new C()).g(N) ;
