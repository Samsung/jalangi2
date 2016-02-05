
var fs = require('fs');

String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

var files = fs.readdirSync('.');

var stmtMap = {};
var testCov = [];

var i = 0;
var file = "coverage" + i + ".json";
while (fs.existsSync(file)) {

    var coverage = JSON.parse(fs.readFileSync(file, 'utf8'));
    var fileMap = {};
    for (var jsFile in coverage) {
        if (coverage.hasOwnProperty(jsFile)) {
            if (!stmtMap.hasOwnProperty(jsFile)) {
                var smapFile = jsFile.substring(0, jsFile.length - 3) + '_jalangi_.json';
                var smap = JSON.parse(fs.readFileSync(smapFile, 'utf8'));
                var smapNew = {};
                var nBranches = smap.nBranches / 2;
                for (var k = 1; k <= nBranches; k++) {
                    var loc = smap[k * 8];
                    if (loc === undefined) {
                        console.log("k = " + k * 8 + " " + JSON.stringify(smap));
                    }
                    smapNew[k * 8 - 1] = {start: {line: loc[0], column: loc[1]}, end: {line: loc[2], column: loc[3]}};
                    smapNew[k * 8] = {start: {line: loc[0], column: loc[1]}, end: {line: loc[2], column: loc[3]}};
                }
                stmtMap[jsFile] = smapNew;
            }

            var oldCoverage = coverage[jsFile];
            var newCoverage = [];
            for (var j = 0; j < oldCoverage.length; j++) {
                if (oldCoverage[j]) {
                    if (j % 2 == 0)
                        newCoverage.push((j + 2) * 4 - 1);
                    else
                        newCoverage.push((j + 1) * 4);
                }
            }
            fileMap[jsFile] = newCoverage;
        }
    }
    testCov.push(fileMap);
    fs.unlink(file);
    i++;
    file = "coverage" + i + ".json";
}

fs.writeFileSync('allcoverage.json', JSON.stringify({statementMap: stmtMap, testCov: testCov}, null, '\t'), 'utf8');

