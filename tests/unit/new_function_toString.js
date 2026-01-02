var sideEffect = 0;

var a = {
    toString: function () {
        sideEffect++;
        return 'a';
    }
};

// Regression: new Function should not coerce argument twice.
new Function(a, 'return a');

console.log(sideEffect);
