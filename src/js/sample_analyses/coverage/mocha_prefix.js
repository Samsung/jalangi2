beforeEach(function() {
    J$.analysis.beginExecution();
});

afterEach(function() {
    J$.analysis.endExecution();
});

// tmpTestPrefix.js

var assert = require('assert'),
    approx = require('./tools/approx'),
    math = require('./index');


J$.analysis.beginExecution("");

// tmpTestPostfix.js

J$.analysis.endExecution(true);

