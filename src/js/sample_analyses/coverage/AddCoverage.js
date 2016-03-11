(function (sandbox) {
    var coverageType = 1;
    var unusedCoverageType = 3;

    function Set(map) {
        this.set = false;
        this.count = 0;
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
            }  else {
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
        var children = featureGraph[x];
        if (children === undefined) {
            children = featureGraph[x] = new Object(null);
        }
        children[y] = true;
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
            Object.keys(children).forEach(function(y){
                f(y);
            });
        }
    }

    function resetEdges(x, testIndex) {
        var mod = false;
        forEachEdge(x, function(y){
            var feature3 = features[y];
            if (!feature3.tests.contains(testIndex)) {
                removeEdge(x, y);
                mod = true;
            }
        });
        return mod;
    }

    function addCoverage(testCode, coverage, forceAdd) {
        var testIndex = tests.length;
        var feature, feature2, feature3;
        var mod = false;
        var modFeatures = new Object(null);

        var i;
        for (i = 0; i < features.length; i++) {
            feature = features[i];
            var split = feature.coverage.split(coverage);
            if (!split.intersection.isEmpty() && !split.difference.isEmpty()) {
                features.push(feature2 = {coverage: split.difference, tests: feature.tests.clone(), index: features.length});
                feature.coverage = split.intersection;
                feature.tests.add(testIndex);
                modFeatures[feature.index] = true;
                mod = true;

                addEdge(feature2.index, feature.index);
                forEachEdge(feature.index, function(y) {
                   addEdge(feature2.index, y);
                });
                resetEdges(feature.index, testIndex)
            } else if (!split.intersection.isEmpty()) {
                feature.tests.add(testIndex);
                modFeatures[feature.index] = true;
                mod = resetEdges(feature.index, testIndex) || mod;
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
            featureGraph[feature.index] = modFeatures;
            mod = true;
        }
        if (mod) {
            tests.push(testCode);
        } else {
            tests.push(null);
        }
    }

    module.exports.Set = Set;

}(module.exports));
