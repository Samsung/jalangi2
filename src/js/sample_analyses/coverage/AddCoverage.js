(function (sandbox) {
    var coverageType = 1;
    var unusedCoverageType = 3;


    function isSubset(tests1, tests2) {
        Objects.keys(tests1).forEach(function(test1){
            if (!tests2.hasOwnProperty(test1)) {
                return false;
            }
        });
        return true;
    }

    function diffCoverage(old, coverage) {
        var one = {}, two = {}, onef = false, twof = false;
        Object.keys(old).forEach(function (keyf) {
            Object.keys(old[keyf]).forEach(function (keyi) {
                    var o = coverage[keyf];
                    if (o && o[keyi] === coverageType) {
                        if (one[keyf] === undefined) {
                            one[keyf] = {};
                        }
                        one[keyf][keyi] = true;
                        o[keyi] = unusedCoverageType;
                        onef = true;
                    } else {
                        if (two[keyf] === undefined) {
                            two[keyf] = {};
                        }
                        two[keyf][keyi] = true;
                        twof = true;
                    }
                }
            );
        });
        return {one: one, onef: onef, two: two, twof: twof};
    }

    var features = [];
    var tests = [];

    function addCoverage(testCode, coverage) {
        var testIndex = tests.length;
        var feature, feature2;
        var mod = false;

        var i;
        for (i = 0; i < features.length; i++) {
            feature = features[i];
            var split = diffCoverage(feature.coverage, coverage);
            if (split.onef && split.twof) {
                features.push(feature2 = {coverage: split.two, tests: {}});
                Object.keys(feature.tests).forEach(function (ti) {
                    feature2.tests[ti] = true;
                });

                feature.coverage = split.one;
                feature.tests[testIndex] = true;
                mod = true;
            } else if (split.onef) {
                feature.tests[testIndex] = true;
            }
        }

        var newFeature = {};
        var newFeaturef = false;
        Object.keys(coverage).forEach(function (keyf) {
            var o = coverage[keyf];
            Object.keys(o).forEach(function (keyi) {
                if (o[keyi] === coverageType) {
                    newFeaturef = true;
                    if (newFeature[keyf] === undefined) {
                        newFeature[keyf] = {};
                    }
                    newFeature[keyf][keyi] = true;
                }
            });
        });
        if (newFeaturef) {
            features.push(feature = {coverage: newFeature, tests: {}});
            feature.tests[testIndex] = true;
            mod = true;
        }
        if (mod) {
            tests.push(testCode);
        } else {
            tests.push(null);
        }

    }


}(module.exports));