
function r() {
    this.f.apply(this, [NaN]);
}
r.prototype.f = function (p) {
    this.x = p;
};

var c = new r();
-c.x