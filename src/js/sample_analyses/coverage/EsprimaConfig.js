
(function (sandbox) {
    var fs = require('fs');
    var shelljs = require('shelljs');
    var tmpTestFile = "tmpTestFile.js";
    var newTestFileName = "tmp/newtest";
    var resultFile = "tmp/results.json";

    function testProcessor(testCode) {
        var src = "", type = "ignore";
        if (testCode.case !== undefined) {
            src = testCode.case;
        } else if (testCode.source !== undefined) {
            src = testCode.source;
        }
        if (testCode.tree !== undefined) {
            type = "tree";
        } else if (testCode.tokens !== undefined) {
            type = "tokens";
        } else if (testCode.failure !== undefined) {
            type = "failure";
        }
        if (type === "ignore") {
            return null;
        } else {
            return {str: src, type: type};
        }
    }

    function runTest(str) {
        var tmplt = template.toString();

        tmplt = tmplt.substring(tmplt.indexOf("{")+1, tmplt.lastIndexOf("}"));
        var prefix = tmplt.substring(0, tmplt.indexOf("$R1"));
        var postfix = tmplt.substring(tmplt.indexOf("$R1")+3, tmplt.length);
        var ret = prefix + JSON.stringify(str) + postfix;
        fs.writeFileSync(tmpTestFile, ret, "utf8");
        return shelljs.exec("gtimeout 30s node " + tmpTestFile + " > /dev/null 2>&1");
    }


    var newTestIndex = 0;
    function predicate(test, extra, MAX_COST) {
        process.stdout.write('.');
        var result = runTest(test);
        if (result.code !== 0) {
            return MAX_COST + 1;
        } else {
            var results = JSON.parse(fs.readFileSync(resultFile, "utf8"));
            if (results.featuresCovered[extra]) {
                if (results.modified) {
                    console.log("New feature splitting test found: " + test.str);
                    console.log("Writing test to " + newTestFileName + newTestIndex + ".js. Ignoring the test.");
                    fs.writeFileSync(newTestFileName + newTestIndex + ".js", test.str, "utf8");
                    newTestIndex++;
                    return MAX_COST + 1;
                } else {
                    var curMin = Object.keys(results.featuresCovered).length;
                    console.log("Found a passing test curMin = " + curMin);
                    console.log(test.str);
                    return curMin;
                }
            } else {
                return MAX_COST + 1;
            }
        }
    }

    function template() {
        var esprima = require('./dist/esprima');
        var test = $R1;
        J$.analysis.beginExecution(test);

        if (test.type==="tree") {
            esprima.parse(test.str);
        } else if (test.type==="tokens") {
            esprima.parse(test.str);
        } else {
            try {
                esprima.parse(test.str);
            } catch(e) {
                if (e instanceof ReferenceError) {
                    throw e;
                }
            }
        }
        J$.analysis.endExecution();
    }

    sandbox.external = {
        testProcessor : testProcessor,
        runTest: runTest,
        predicate: predicate
    }

}(module.exports));
