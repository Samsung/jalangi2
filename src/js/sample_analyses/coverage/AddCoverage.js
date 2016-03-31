(function (sandbox) {
    var fs = require('fs');
    var coverageType = 1;
    var unusedCoverageType = 3;
    var featuresFile = "tmp/features.json";
    var resultFile = "tmp/results.json";
    var prefixTestFile = "tmpTestPrefix.js";
    var postfixTestFile = 'tmpTestPostfix.js';
    var tmpTestFile = "tmpTestFile.js";
    var newTestFileName = "newtest";
    var minTestFileName = "mintest";
    var MAX_COST = 100000;

    function Set(map) {
        if (map === undefined) {
            this.set = false;
            this.count = 0;
        } else {
            this.set = map.set;
            this.count = map.count;
        }
    }

    Set.prototype.add = function () {
        var base = this;
        var offset = "set";
        var val = base[offset];
        for (var i = 0; i < arguments.length; i++) {
            if (typeof val !== "object") {
                base[offset] = val = {isFinal: val, children: new Object(null)}
            }
            var valc = val.children[arguments[i]];
            if (valc === undefined) {
                valc = false;
                val.children[arguments[i]] = valc;
            }
            base = val.children;
            offset = arguments[i];
            val = valc;
        }
        if (typeof val !== "object") {
            if (base[offset] !== true) {
                this.count++;
            }
            base[offset] = true;
        } else {
            if (val.isFinal !== true) {
                this.count++;
            }
            val.isFinal = true;
        }
    };

    Set.prototype.contains = function () {
        var val = this.set;
        for (var i = 0; i < arguments.length; i++) {
            if (typeof val !== "object") {
                return false;
            }
            var valc = val.children[arguments[i]];
            if (valc === undefined) {
                return false;
            }
            val = valc;
        }
        if (typeof val !== "object") {
            return val;
        } else {
            return val.isFinal;
        }
    };

    Set.prototype.remove = function () {
        var base = this;
        var offset = "set";
        var val = base[offset];
        for (var i = 0; i < arguments.length; i++) {
            if (typeof val !== "object") {
                return false;
            }
            var valc = val.children[arguments[i]];
            if (valc === undefined) {
                return false;
            }
            base = val.children;
            offset = arguments[i];
            val = valc;
        }
        if (typeof val !== "object") {
            if (base[offset] !== false) {
                this.count--;
            } else {
                return false;
            }
            base[offset] = true;
        } else {
            if (val.isFinal !== false) {
                this.count--;
            } else {
                return false;
            }
            val.isFinal = true;
        }
        return true;
    };

    Set.prototype.clone = function () {
        var ret = new Set();
        this.forEach(null, function () {
            ret.add.apply(ret, arguments);
        });
        return ret;
    };

    function forEach(obj, f, dis) {
        if (obj === true || (typeof obj === "object" && obj.isFinal)) {
            f();
        }
        if (typeof obj === "object") {
            Object.keys(obj.children).forEach(function (key) {
                forEach(obj.children[key], f.bind(dis, key), dis);
            });
        }
    }

    Set.prototype.forEach = function (dis, f) {
        forEach(this.set, f, dis);
    };

    Set.prototype.print = function () {
        var ret = "[", flag = true;
        this.forEach(null, function () {
            if (flag) {
                flag = false;
            } else {
                ret += ", ";
            }
            for (var i = 0; i < arguments.length; i++) {
                ret += arguments[i];
                if (i !== arguments.length - 1) {
                    ret += ":";
                }
            }
        });
        ret += "]";
        process.stdout.write(ret);
    };

    function getMapElement(obj, args) {
        var ret = obj;
        for (var i = 0; i < args.length; i++) {
            ret = ret[args[i]];
            if (ret === undefined) {
                return ret;
            }
        }
        return ret;
    }

    function putMapElement(obj, args, val) {
        var ret = obj;
        for (var i = 0; i < args.length; i++) {
            if (i === args.length - 1) {
                ret[args[i]] = val;
            } else {
                ret = ret[args[i]];
                if (ret === undefined) {
                    return ret;
                }
            }
        }
        return ret;
    }

    Set.prototype.split = function (coverage) {
        var intersection = new Set();
        var difference = new Set();
        this.forEach(null, function () {
            if (getMapElement(coverage, arguments) == coverageType) {
                intersection.add.apply(intersection, arguments);
                putMapElement(coverage, arguments, unusedCoverageType);
            } else {
                difference.add.apply(difference, arguments);
            }
        });
        return {intersection: intersection, difference: difference};
    };

    Set.prototype.size = function () {
        return this.count;
    };

    Set.prototype.isEmpty = function () {
        return this.count === 0;
    };

    var features = [];
    var tests = [];
    var featureGraph = new Object(null);

    function addEdge(x, y) {
        if (x == y) throw new Error("x " + x + " === y " + y);
        var children = featureGraph[x];
        if (children === undefined) {
            children = featureGraph[x] = new Object(null);
        }
        children[y] = true;
    }

    function containsEdge(x, y) {
        var children = featureGraph[x];
        if (children === undefined) {
            return false;
        }
        return children[y];
    }

    function removeEdge(x, y) {
        var children = featureGraph[x];
        if (children === undefined) {
            return;
        }
        delete children[y];
        if (Object.keys(children).length === 0) {
            delete featureGraph[x];
        }
    }

    function forEachEdge(x, f) {
        var children = featureGraph[x];
        if (children) {
            Object.keys(children).forEach(function (y) {
                f(y);
            });
        }
    }

    function resetEdges(x, testIndex) {
        var mod = false;
        forEachEdge(x, function (y) {
            var feature3 = features[y];
            if (!feature3.tests.contains(testIndex)) {
                removeEdge(x, y);
                mod = true;
            }
        });
        return mod;
    }

    function readData() {
        try {
            var data = JSON.parse(fs.readFileSync(featuresFile, "utf8"));
            features = data.features;
            tests = data.tests;
            featureGraph = data.featureGraph;
        } catch (e) {
            features = [];
            tests = [];
            featureGraph = new Object(null);
            console.log("Cannot read features data " + e);
        }
        for (var i = 0; i < features.length; i++) {
            var feature = features[i];
            feature = features[i];
            feature.coverage =  new Set(feature.coverage);
            feature.tests =  new Set(feature.tests);
        }

    }

    function saveData() {
        try {
            var data = {features: features, tests: tests, featureGraph: featureGraph};
            fs.writeFileSync(featuresFile, JSON.stringify(data, null, "    "), "utf8");
        } catch (e) {
            console.log("Cannot save feature data");
            console.log(e);
        }
    }

    function addCoverage(testCode, coverage, forceAdd) {
        readData();

        var testIndex = tests.length;
        var feature, feature2, feature3;
        var mod = false;
        var modFeatures = new Object(null);
        var featuresCovered = new Object(null);

        var i;
        for (i = 0; i < features.length; i++) {
            feature = features[i];
            var split = feature.coverage.split(coverage);
            if (!split.intersection.isEmpty() && !split.difference.isEmpty()) {
                features.push(feature2 = {
                    coverage: split.difference,
                    tests: feature.tests.clone(),
                    index: features.length
                });
                feature.coverage = split.intersection;
                feature.tests.add(testIndex);
                featuresCovered[feature.index] = true;
                modFeatures[feature.index] = true;
                mod = true;

                addEdge(feature2.index, feature.index);
                forEachEdge(feature.index, function (y) {
                    addEdge(feature2.index, y);
                });
                resetEdges(feature.index, testIndex);
                Object.keys(featureGraph).forEach(function (x) {
                    if (containsEdge(x, feature.index)) {
                        if (x != feature2.index) addEdge(x, feature2.index);
                    }
                });
            } else if (!split.intersection.isEmpty()) {
                feature.tests.add(testIndex);
                featuresCovered[feature.index] = true;
                modFeatures[feature.index] = true;
                // mod = resetEdges(feature.index, testIndex) || mod;
            }
        }

        var newFeature = new Set();
        Object.keys(coverage).forEach(function (keyf) {
            var o = coverage[keyf];
            Object.keys(o).forEach(function (keyi) {
                if (o[keyi] === coverageType) {
                    newFeature.add(keyf, keyi);
                }
            });
        });
        if (!newFeature.isEmpty()) {
            features.push(feature = {coverage: newFeature, tests: new Set(), index: features.length});
            feature.tests.add(testIndex);
            featuresCovered[feature.index] = true;
            featureGraph[feature.index] = modFeatures;
            mod = true;
        }
        if (forceAdd) {
            tests.push(testCode);
            saveData();
        }
        //printGraph();
        var results = {modified: mod, featuresCovered: featuresCovered, testIndex: testIndex};
        fs.writeFileSync(resultFile, JSON.stringify(results, null, "    "), "utf8");
        return results;
    }

    /**
     *
     * @returns {Array({coverage: Set, tests: Set, index: number})}
     */

    function getFeatures() {
        return features;
    }

    function getFeaturesFromTest(testIndex) {
        var i, ret = new Object(null);
        for (i = 0; i < features.length; i++) {
            if (features[i].tests.contains(testIndex)) {
                ret[i] = true;
            }
        }
        return ret;
    }

    function getFeatureCountForTests() {
        var i, ret = new Object(null);
        for (i = 0; i < features.length; i++) {
            for (var j = 0; j<tests.length; j++) {
                if (features[i].tests.contains(j)) {
                    ret[j] = (ret[j]|0)+1;
                }
            }
        }
        return ret;
    }

    function getTestWithMinFeatures(featureCountForTests, tests) {
        var min = MAX_COST, ti;
        tests.forEach(null, function(testIndex){
            if (min > featureCountForTests[testIndex]) {
                min = featureCountForTests[testIndex];
                ti = testIndex;
            }
        });
        return {min: min, testIndex: ti};
    }


    function getTestsFromFeature(index) {
        return features[index].tests;
    }

    function printGraph() {
        process.stdout.write("Printing graph:\n");
        if (featureGraph) {
            Object.keys(featureGraph).forEach(function (x) {
                var children = featureGraph[x];
                if (children) {
                    var feature = features[x];
                    process.stdout.write(x);
                    feature.tests.print();
                    process.stdout.write("<-");
                    Object.keys(children).forEach(function (y) {
                        process.stdout.write(y + " ");
                    });
                    process.stdout.write("\n");
                }

            });
        }
    }

    function getTestCode(testIndex) {
        return tests[testIndex];
    }


    var deltaDebug = (function () {
        function get_deltasmall(str, $i, $n, $size) {
            var ret;
            if ($i === $n) {
                ret = str.substring(($i - 1) * $size);
            } else {
                ret = str.substring(($i - 1) * $size, $i * $size);
            }
            return ret;
        }

        function get_deltalarge(str, $i, $n, $size) {
            var ret;
            if ($i === $n) {
                ret = str.substring(0, ($i - 1) * $size);
            } else {
                ret = str.substring(0, ($i - 1) * $size) + str.substring($i * $size);
            }
            return ret;
        }


        function deltaDebug(str, pred) {
            var MAX_COST = 100000;
            var $n = 2;
            var cost = MAX_COST;
            var tmpn, tmpstr;
            L1: while (true) {
                var $len = str.length;
                var $size = Math.floor($len / $n);
                console.log("len = "+$len);


                while ($size >= 1) {
                    var found = false;
                    for (var $i = 1; $i <= $n; $i++) {
                        var str1 = get_deltasmall(str, $i, $n, $size);
                        var $ret = pred(str1);
                        if ($ret <= cost) {
                            tmpn = 2;
                            tmpstr = str1;
                            found = true;
                        }
                        var str2 = get_deltalarge(str, $i, $n, $size);
                        $ret = pred(str2);
                        if ($ret < cost) {
                            tmpn = $n - 1;
                            tmpstr = str2;
                            found = true;
                        }
                    }
                    if (found) {
                        $n = tmpn;
                        str = tmpstr;
                        continue L1;
                    }
                    $n = $n * 2;
                    $size = $len / $n;
                }
                return str;
            }
        }

        return deltaDebug;
    }());

    function getMinTestForEachFeature() {
        var shelljs = require('shelljs');
        readData();
        var featureCountForTests = getFeatureCountForTests();
        var min = MAX_COST;
        var newTestIndex = 0;
        for (var i = features.length - 1; i >= 0; i--) {
            var thisTests = features[i].tests;
            var combinedTest = "";
            thisTests.forEach(null, function (testIndex) {
                combinedTest += tests[testIndex];
            });
            console.log("Running dd");
            //console.log(combinedTest);

            function predicate(str) {
                var prefix = fs.readFileSync(prefixTestFile, "utf8");
                var postfix = fs.readFileSync(postfixTestFile, "utf8");
                fs.writeFileSync(tmpTestFile, prefix + str + postfix, "utf8");
                process.stdout.write('.');
                var result = shelljs.exec("gtimeout 30s node " + tmpTestFile+ " > /dev/null 2>&1");
                if (result.code !== 0) {
                    return MAX_COST + 1;
                } else {
                    var results = JSON.parse(fs.readFileSync(resultFile, "utf8"));
                    if (results.featuresCovered[i]) {
                        if (results.modified) {
                            console.log("New feature splitting test found: " + str);
                            console.log("Writing test to " + newTestFileName + newTestIndex + ".js. Ignoring the test.");
                            fs.writeFileSync(newTestFileName + newTestIndex + ".js", prefix + str + postfix, "utf8");
                            return MAX_COST + 1;
                        } else {
                            var curMin = Object.keys(results.featuresCovered).length;
                            if (min > curMin) {
                                min = curMin;
                            }
                            console.log("Found a passing test");
                            console.log(str);
                            return curMin;
                        }
                    } else {
                        return MAX_COST + 1;
                    }
                }
            }

            min = MAX_COST;
            var mintest = deltaDebug(combinedTest, predicate);
            var oldmins = getTestWithMinFeatures(featureCountForTests, thisTests);
            if (min < oldmins.min) {
                var prefix = fs.readFileSync(prefixTestFile, "utf8");
                var postfix = fs.readFileSync(postfixTestFile, "utf8");
                fs.writeFileSync(minTestFileName+i+".js", prefix + mintest + postfix, "utf8");
                console.log("Found minimal test old minimal features = "+oldmins+" new minimal features "+min);
                console.log("---------------old minimal------------------");
                console.log(tests[oldmins.testIndex]);
                console.log("----------------computed minimal-----------------");
                console.log(mintest);
                console.log("---------------------------------");
            } else {
                console.log("Failed to find min test for feature "+i);
                console.log("---------------old minimal------------------");
                console.log(tests[oldmins.testIndex]);
                console.log("----------------computed minimal-----------------");
                console.log(mintest);
                console.log("---------------------------------");
            }
        }
    }


    sandbox.Features = {
        Set: Set,
        addCoverage: addCoverage,
        getFeaturesFromTest: getFeaturesFromTest,
        getTestsFromFeature: getTestsFromFeature,
        getTestCode: getTestCode,
        loadFeatures: readData,
        storeFeatures: saveData
    };

    if (require.main === module) {
        getMinTestForEachFeature();
    }

}((typeof J$ === 'undefined') ? module.exports : J$));

