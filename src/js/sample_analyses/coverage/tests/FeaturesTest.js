var assert = require('assert');
var Features = require('./../AddCoverage').Features;

describe("Set functionality", function () {
        it("1", function () {
            Features.addCoverage("test0", {0: 2, 1: 2, 5:2, 7:2, 2:2}, true);
            Features.addCoverage("test1", {0: 2, 1: 2, 5:2, 3:2, 13:2}, true);
            Features.addCoverage("test2", {0: 2, 1: 2, 5:2, 9:2, 2:2, 3:2, 4:2}, true);
            Features.addCoverage("test3", {0: 2, 1: 2, 2:2, 3:2, 6:2, 4:2, 10:2}, true);
            Features.addCoverage("test4", {0: 2, 1: 2, 5:2, 2:2, 7:2, 11:2}, true);
            Features.addCoverage("test5", {0: 2, 1: 2, 5:2, 2:2, 9:2, 11:2, 3:2, 4:2}, true);
            Features.addCoverage("test6", {0: 2, 1: 2, 2:2, 7:2, 6:2, 8:2, 12:2}, true);
            Features.addCoverage("test7", {0: 2, 1: 2, 2:2, 9:2, 6:2, 3:2, 4:2, 8:2, 12:2}, true);
            Features.addCoverage("test8", {0: 2, 1: 2, 2:2, 6:2, 3:2, 4:2, 8:2, 12:2, 10:2}, true);
            Features.addCoverage("test9", {0: 2, 2:2, 6:2, 3:2, 11:2, 4:2, 8:2, 14:2, 10:2, 13:2}, true);
        })
});