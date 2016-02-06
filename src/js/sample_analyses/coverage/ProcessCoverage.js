
var fs = require('fs');

String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

var files = fs.readdirSync('.');

var stmtMap = {};
var testCov = [];

for(var i=0; i<files.length; i++) {
    var file = files[i];
    if (file.endsWith(".json") && file.indexOf('coverage') === 0) {
        var coverage = JSON.parse(fs.readFileSync(file, 'utf8'));
        var fileMap = {};
        for (var jsFile in coverage) {
            if (coverage.hasOwnProperty(jsFile)) {
                if (!stmtMap.hasOwnProperty(jsFile)) {
                    var smapFile = jsFile.substring(0, jsFile.length-3)+'_jalangi_.json';
                    var smap = JSON.parse(fs.readFileSync(smapFile, 'utf8'));
                    var smapNew = {};
                    var nBranches = smap.nBranches/2;
                    for (var k = 1; k<= nBranches; k++) {
                        var loc = smap[k*8];
                        if (loc === undefined) {
                            console.log("k = "+k*8+" "+JSON.stringify(smap));
                        }
                        smapNew[k*8-1] = {start: {line: loc[0], column: loc[1]-1}, end: {line: loc[2], column: loc[3]-1}};
                        smapNew[k*8] = {start: {line: loc[0], column: loc[1]-1}, end: {line: loc[2], column: loc[3]-1}};
                    }
                    stmtMap[jsFile.substring(0, jsFile.length-3)+".org"] = smapNew;
                }

                var oldCoverage = coverage[jsFile];
                var newCoverage = [];
                for (var j=0; j<oldCoverage.length; j++) {
                    if (oldCoverage[j]) {
                        if (j%2 == 0)
                            newCoverage.push((j+2)*4-1);
                        else
                            newCoverage.push((j+1)*4);
                    }
                }
                fileMap[jsFile.substring(0, jsFile.length-3)+".org"] = newCoverage;
            }
        }
        testCov.push(fileMap);
        fs.unlink(file);
    }
}

fs.writeFileSync('allcoverage.json', JSON.stringify({statementMap: stmtMap, testCov: testCov}, null, '\t'), 'utf8');

//1) Instrument the folder containing js files using
//
//$JALANGI_HOME/scripts/instrument_folder_coverage.sh path_to_folder
//
//2) add the contents of $JALANGI_HOME/src/js/sample_analyses/coverage/mocha_prefix.js before the first "describe" call in the top-level mocha test in the test directory.
//
//3) call mocha test and it will generate a coverage*.json for each mocha test.
//4) run node $JALANGI_HOME/src/js/sample_analyses/coverage/ProcessCoverage.js  . This will generate allcoverage.json.