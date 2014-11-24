
String.prototype.sc_toDisplayString = function() {
    if (this.charAt(0) === '1')
        return 0;
    else if (this.charAt(0) === '2')
        return 1;
};

var x = "123".sc_toDisplayString();
console.log(x);
