var fs = require('fs');

String.prototype.endsWith = function (suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

var stmtMap = {};
var testCov = [];

var i = 0;
var file = "coverage" + i + ".json";
while (fs.existsSync(file)) {

    var coverage = JSON.parse(fs.readFileSync(file, 'utf8'));
    var fileMap = {};
    for (var jsFile in coverage) {
        if (coverage.hasOwnProperty(jsFile)) {
            var smapFile = jsFile.substring(0, jsFile.length - 3) + '_jalangi_.json';
            if (fs.existsSync(smapFile)) {
                var jsFileOrg = jsFile.substring(0, jsFile.length - 3) + ".org";
                var smapNew = stmtMap[jsFileOrg];
                var smap = JSON.parse(fs.readFileSync(smapFile, 'utf8'));
                if (smapNew === undefined) {
                    smapNew = {};
                    //var nBranches = smap.nBranches / 2;
                    //for (var k = 1; k <= nBranches; k++) {
                    //    var loc = smap[k * 8];
                    //    if (loc === undefined) {
                    //        console.log("k = " + k * 8 + " " + JSON.stringify(smap));
                    //    }
                    //    smapNew[k * 8 - 1] = {
                    //        start: {line: loc[0], column: loc[1] - 1},
                    //        end: {line: loc[2], column: loc[3] - 1}
                    //    };
                    //    smapNew[k * 8] = {
                    //        start: {line: loc[0], column: loc[1] - 1},
                    //        end: {line: loc[2], column: loc[3] - 1}
                    //    };
                    //}
                    stmtMap[jsFileOrg] = smapNew;
                }

                var oldCoverage = coverage[jsFile];
                var newCoverage = [];
                for (var j in oldCoverage) {
                    if (oldCoverage.hasOwnProperty(j) && (process.argv[2] | 0) == oldCoverage[j]) {
                        newCoverage.push(j);
                        var loc;
                        if (j % 8 == 7) {
                            loc = smap[(j | 0) + 1];
                        } else {
                            loc = smap[j];
                        }
                        smapNew[j] = {
                            start: {line: loc[0], column: loc[1] - 1},
                            end: {line: loc[2], column: loc[3] - 1}
                        };
                    }
                }
                fileMap[jsFile.substring(0, jsFile.length - 3) + ".org"] = newCoverage;
            }
        }
    }
    testCov.push(fileMap);
    //fs.unlink(file);
    i++;
    file = "coverage" + i + ".json";
}

fs.writeFileSync('allcoverage.json', JSON.stringify({statementMap: stmtMap, testCov: testCov}, null, '\t'), 'utf8');

//0) vi node_modules/mocha/lib/runnable.js
//   Runnable.prototype.run = function(fn) {
//   var self = this;
//   var start = new Date();
//   var ctx = this.ctx;
//   var finished;
//   var emitted;
//
//   if (this.type==='test') {
//       J$.analysis.beginExecution(this.fn.toString());
//}


//1) Instrument the folder containing js files using
//
//$JALANGI_HOME/scripts/instrument_folder_coverage.sh path_to_folder
//
//2) add the contents of $JALANGI_HOME/src/js/sample_analyses/coverage/mocha_prefix.js before the first "describe" call in the top-level mocha test in the test directory.
//
//3) call mocha test and it will generate a coverage*.json for each mocha test.
//4) run node $JALANGI_HOME/src/js/sample_analyses/coverage/ProcessCoverage.js  1|2. 1 for branch coverage and 2 for stmt coverage.  This will generate allcoverage.json.