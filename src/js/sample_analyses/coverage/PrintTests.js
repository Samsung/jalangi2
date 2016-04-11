var Features = require('./AddCoverage').Features;

Features.loadFeatures();
var tests = Features.getTests();

tests.forEach(function(test){
    console.log(test);
});
