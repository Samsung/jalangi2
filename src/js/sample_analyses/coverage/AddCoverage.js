(function (sandbox) {
    var fs = require('fs');
    var shelljs = require('shelljs');
    var coverageType = 1;
    var unusedCoverageType = 3;
    var featuresFile = "tmp/features.json";
    var testFile = "tmp/tests.json";
    var resultFile = "tmp/results.json";
    var tmpTestFile = "tmpTestFile.js";
    var configFile = "tmp/config-cov.json";
    var minTestFileName = "tmp/mintest";
    var orgTestFileName = "tmp/orgtest";
    var MAX_COST = 100000;
    var EXTERNAL = "./EsprimaConfig";

    var external = require(EXTERNAL).external;
    var testProcessor = external.testProcessor;
    var runTest = external.runTest;
    var predicate = external.predicate;

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

    Set.prototype.subsetOf = function (other) {
        var ret = true;
        this.forEach(null, function () {
            ret = ret && other.contains.apply(other, arguments);
        });
        return ret;
    };

    Set.prototype.isDisjoint = function (other) {
        var ret = true;
        this.forEach(null, function () {
            ret = ret && !other.contains.apply(other, arguments);
        });
        return ret;
    };

    Set.prototype.intersect = function (other) {
        var ret = new Set();
        this.forEach(null, function () {
            if (other.contains.apply(other, arguments)) {
                ret.add.apply(ret, arguments);
            }
        });
        return ret;
    };

    Set.prototype.addAll = function (other) {
        other.forEach(this, function () {
            this.add.apply(this, arguments);
        });
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
            feature.coverage = new Set(feature.coverage);
            feature.tests = new Set(feature.tests);
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

    var config;
    var mode = {FORCEADD: "FORCEADD", RECORDTEST: "RECORDTEST", NOADD: "NOADD"};

    function readConfig() {
        try {
            config = JSON.parse(fs.readFileSync(configFile, "utf8"));
        } catch (e) {
            //console.log("Error in reading config: "+ e);
            config = {mode: mode.RECORDTEST};
        }
        //console.log("config.mode = "+config.mode);
    }


    function checkFeatureGraph() {
        for (var i = 0; i < features.length; i++) {
            for (var j = 0; j < features.length; j++) {
                if (i !== j) {
                    if (features[i].tests.subsetOf(features[j].tests)) {
                        if (!featureGraph[i][j]) {
                            features[i].tests.print();
                            process.stdout.write(" is subset of ");
                            features[j].tests.print();
                            process.stdout.write("\n but edge (" + i + "," + j + ") is missing from feature graph ");
                            throw new Error("Validation failed");
                        }
                    }
                }
            }
        }
    }

    function checkTestFeatures(testCode, featuresCovered) {
        var ti = tests.indexOf(testCode);
        var oldFeaturesCovered = getFeaturesFromTest(ti);
        Object.keys(featuresCovered).forEach(function (key) {
            if (oldFeaturesCovered[key] === true) {
                delete oldFeaturesCovered[key];
                delete featuresCovered[key];
            }
        });
        if (Object.keys(oldFeaturesCovered).length > 0 || Object.keys(featuresCovered).length > 0) {
            console.log("********** Feature check failed.  For test " + ti + ". OldFeatures - NewFeatures " + JSON.stringify(oldFeaturesCovered, null, "  ") +
                ". OldFeatures - NewFeatures " + JSON.stringify(featuresCovered, null, "  ") + ". Test is " + testCode);
            return false;
        }
        process.stdout.write(".");
        return true;
    }

    //function testProcessor(testCode) {
    //    var src = "", type = "ignore";
    //    if (testCode.case !== undefined) {
    //        src = testCode.case;
    //    } else if (testCode.source !== undefined) {
    //        src = testCode.source;
    //    }
    //    if (testCode.tree !== undefined) {
    //        type = "tree";
    //    } else if (testCode.tokens !== undefined) {
    //        type = "tokens";
    //    } else if (testCode.failure !== undefined) {
    //        type = "failure";
    //    }
    //    if (type === "ignore") {
    //        return null;
    //    } else {
    //        return {str: src, type: type};
    //    }
    //}
    //
    //function runTest(str) {
    //    var prefix = fs.readFileSync(prefixTestFile, "utf8");
    //    var postfix = fs.readFileSync(postfixTestFile, "utf8");
    //    var ret = prefix + JSON.stringify(str) + postfix;
    //    fs.writeFileSync(tmpTestFile, ret, "utf8");
    //    return shelljs.exec("gtimeout 30s node " + tmpTestFile + " > /dev/null 2>&1");
    //}
    //
    //
    //var newTestIndex = 0;
    //function predicate(test, extra, MAX_COST) {
    //    process.stdout.write('.');
    //    var result = runTest(test);
    //    if (result.code !== 0) {
    //        return MAX_COST + 1;
    //    } else {
    //        var results = JSON.parse(fs.readFileSync(resultFile, "utf8"));
    //        if (results.featuresCovered[extra]) {
    //            if (results.modified) {
    //                console.log("New feature splitting test found: " + test.str);
    //                console.log("Writing test to " + newTestFileName + newTestIndex + ".js. Ignoring the test.");
    //                fs.writeFileSync(newTestFileName + newTestIndex + ".js", test.str, "utf8");
    //                newTestIndex++;
    //                return MAX_COST + 1;
    //            } else {
    //                var curMin = Object.keys(results.featuresCovered).length;
    //                console.log("Found a passing test curMin = " + curMin);
    //                console.log(test.str);
    //                return curMin;
    //            }
    //        } else {
    //            return MAX_COST + 1;
    //        }
    //    }
    //}

    function addCoverage(testCode, coverage) {
        readConfig();
        //console.log("config.mode = " +config.mode);
        if (config.mode === mode.RECORDTEST) {
            //console.log("Adding "+JSON.stringify(testCode, null, "  "));
            addTestOnly(testCode, testProcessor);
        } else if (config.mode === mode.FORCEADD) {
            processCoverage(testCode, coverage, true);
        } else if (config.mode === mode.NOADD) {
            processCoverage(testCode, coverage, false);
        }
    }

    function addTestOnly(testCode, pred) {
        var ret = pred(testCode);
        if (ret !== null) {
            fs.appendFileSync(testFile, JSON.stringify(ret) + "\n", "utf8");
        } else {
            console.log("Failed to add:" + JSON.stringify(testCode, null, "  "));
        }
    }

    function processCoverage(testCode, coverage, forceAdd) {
        readData();

        var testIndex = tests.length;
        var feature, feature2, feature3;
        var mod = false;
        var modFeatures = new Object(null);
        var featuresCovered = new Object(null);

        try {
            fs.unlinkSync(resultFile)
        } catch (e) {
        }
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
                resetEdges(feature.index, testIndex);
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
            tests.push(JSON.stringify(testCode, null, "  "));
            saveData();
        }
        var results = {modified: mod, featuresCovered: featuresCovered};
        fs.writeFileSync(resultFile, JSON.stringify(results, null, "    "), "utf8");
        if (!forceAdd && config.test) {
            checkTestFeatures(JSON.stringify(testCode, null, "  "), featuresCovered);
        }
        return results;
    }

    function runAllTests() {
        var i = 0;
        try {
            fs.unlinkSync(featuresFile);
        } catch (e) {
        }
        fs.readFileSync(testFile).toString().split('\n').forEach(function (line) {
            i++;
            console.log("Executing :" + i);
            var test;
            try {
                test = JSON.parse(line);
                runTest(test);
            } catch (e) {
                console.log("JSON.parse failed on " + line);
                console.log(e)
            }
        });
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
            for (var j = 0; j < tests.length; j++) {
                if (features[i].tests.contains(j)) {
                    ret[j] = (ret[j] | 0) + 1;
                }
            }
        }
        return ret;
    }

    function getTestWithMinFeatures(featureCountForTests, tests) {
        var min = MAX_COST, ti;
        tests.forEach(null, function (testIndex) {
            if (min > featureCountForTests[testIndex]) {
                min = featureCountForTests[testIndex];
                ti = testIndex;
            }
        });
        return {min: min, testIndex: ti};
    }


    function getTests() {
        return tests;
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


        function deltaDebug(test, pred, extra) {
            var $n = 2;
            var cost = MAX_COST, max = MAX_COST;
            var tmpn, tmpstr;
            if (($ret = pred(test, extra, MAX_COST)) <= cost) {
                console.log("Running dd");
                max = cost = $ret;
                L1: while (true) {
                    var str = test.str;
                    var $len = str.length;
                    if ($len <= 1) {
                        break;
                    }
                    var $size = ($len / $n) | 0;
                    console.log("len = " + $len);

                    while ($size >= 1) {
                        var found = false;
                        for (var $i = 1; $i <= $n; $i++) {
                            test.str = get_deltasmall(str, $i, $n, $size);
                            //console.log("small $i = " + $i + " $n = " + $n + " $size = " + $size);
                            var $ret = pred(test, extra, MAX_COST);
                            //console.log("cost = " + cost + " ret = " + $ret);
                            if ($ret <= cost) {
                                tmpn = 2;
                                tmpstr = test.str;
                                found = true;
                                cost = $ret;
                            }
                            test.str = get_deltalarge(str, $i, $n, $size);
                            //console.log("large $i = " + $i + " $n = " + $n + " $size = " + $size);
                            $ret = pred(test, extra, MAX_COST);
                            //console.log("cost = " + cost + " ret = " + $ret);
                            if ($ret <= cost) {
                                tmpn = $n - 1;
                                tmpstr = test.str;
                                found = true;
                                cost = $ret;
                            }
                        }
                        if (found) {
                            $n = tmpn;
                            test.str = tmpstr;
                            continue L1;
                        }
                        $n = $n * 2;
                        $size = ($len / $n) | 0;
                        if ($size < 1) {
                            test.str = str;
                            break L1;
                        }
                    }
                }
            } else {
                console.log("Original test cannot be executed " + JSON.stringify(test) + " $ret " + $ret + " cost " + cost);
            }
            return {test: test, min: cost, max: max};
        }

        return deltaDebug;
    }());

    function getMinTestForEachFeature() {
        readData();
        var featureCountForTests = getFeatureCountForTests();
        var min = MAX_COST;
        for (var i = features.length - 1; i >= 0; i--) {
            var thisTests = features[i].tests;
            var oldmins = getTestWithMinFeatures(featureCountForTests, thisTests);
            var combinedTest = "";

            combinedTest = JSON.parse(tests[oldmins.testIndex]);

            var str = combinedTest.str;
            var mintest = deltaDebug(combinedTest, predicate, i);
            if (mintest.min < mintest.max) {
                fs.writeFileSync(orgTestFileName + i + "-" + oldmins.testIndex + "-" + oldmins.min + ".js", str, "utf8");
                fs.writeFileSync(minTestFileName + i + "-" + oldmins.testIndex + "-" + mintest.min + ".js", mintest.test.str, "utf8");
                console.log("Found minimal test old minimal features = " + oldmins.min + " new minimal features " + mintest.min);
                console.log("---------------old minimal------------------");
                console.log(tests[oldmins.testIndex]);
                console.log("----------------computed minimal-----------------");
                console.log(mintest.test.str);
                console.log("---------------------------------");
            } else {
                fs.writeFileSync(orgTestFileName + i + "-" + oldmins.testIndex + "-" + oldmins.min + ".js", str, "utf8");
                console.log("Failed to find min test for feature " + i);
                console.log("---------------old minimal------------------");
                console.log(tests[oldmins.testIndex]);
                console.log("----------------computed minimal-----------------");
                console.log(mintest.test.str);
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
        getTests: getTests,
        loadFeatures: readData,
        storeFeatures: saveData,
        checkFeatureGraph: checkFeatureGraph
    };

    if (require.main === module) {
        if (process.argv[2] === "collect") {
            fs.writeFileSync(configFile, JSON.stringify({mode: mode.FORCEADD}), "utf8");
            runAllTests();
        } else if (process.argv[2] === "minimize") {
            fs.writeFileSync(configFile, JSON.stringify({mode: mode.NOADD}), "utf8");
            getMinTestForEachFeature();
        } else {
            console.log("Usage: node " + process.argv[1] + " collect|minimize");
        }
    }

}((typeof J$ === 'undefined') ? module.exports : J$));

