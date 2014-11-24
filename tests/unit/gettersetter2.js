var o = {
    _value:0,
    get val() {
        console.log("calling getter");
        return this._value;
    },
    set val(value) {
        console.log("calling setter");
        this._value = value;
    }
};


function C() {
    this.val = 99;
}

C.prototype = o;

var x = new C();
console.log(x.val);
x.val = 5;
console.log(x.val);
console.log(o.val);


var desc = Object.getOwnPropertyDescriptor(x, 'val');

console.log(JSON.stringify(desc));