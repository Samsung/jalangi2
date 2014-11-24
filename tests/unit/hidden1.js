

function C () {
    this._key = 1;
}


Object.defineProperty(C.prototype, "key", {
    enumerable: false,
    configurable: true,
    set: function (b) {
        this._key = b;
    },
    get: function() {
        return this._key;
    }
});


var x = new C();

x.key = 1;
x.key = 1;
x.key = 1;
x.key = 1;
console.log(x.key);
