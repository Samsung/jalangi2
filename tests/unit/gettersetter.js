
var o = {
    _value: 0,
    get val() {
        console.log("calling getter");
        return this._value;
    },
    set val(value) {
        console.log("calling setter");
        this._value = value;
    }
};


o.val = 5;
console.log(o.val);


