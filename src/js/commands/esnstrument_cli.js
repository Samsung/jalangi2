/*
 * Copyright 2013 Samsung Information Systems America, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Author: Koushik Sen

/*jslint node: true browser: true */
/*global astUtil acorn escodegen J$ */

//var StatCollector = require('../utils/StatCollector');
if (typeof J$ === 'undefined') {
    J$ = {};
}


(function (sandbox) {
    acorn = require("acorn");
    escodegen = require("escodegen");
    require('../headers').headerSources.forEach(function(header){
        require("./../../../"+header);
    });


    var instrumentCode = sandbox.instrumentCode;
    var INITIAL_IID_FILE_NAME = "jalangi_initialIID.json";
    var COVERAGE_FILE_NAME = "jalangi_coverage.json";
    var SMAP_FILE_NAME = "jalangi_sourcemap.js";
    var Constants = sandbox.Constants;
    var HOP = Constants.HOP;
    var FILESUFFIX1 = "_jalangi_";
    var JALANGI_VAR = Constants.JALANGI_VAR;

    var orig2Inst = {};
    var instCodeFileName;
    var curFileName;



    //***************************
    // Node.js specific stuff
    //***************************

    function sanitizePath(path) {
        if (typeof process !== 'undefined' && process.platform === "win32") {
            return path.split("\\").join("\\\\");
        }
        return path;
    }

    function makeInstCodeFileName(name) {
        return name.replace(/.js$/, FILESUFFIX1 + ".js");
    }


    function loadInitialIID(outputDir, initIIDs) {
        var path = require('path');
        var fs = require('fs');
        var iidf = path.join(outputDir ? outputDir : process.cwd(), INITIAL_IID_FILE_NAME);
        var startIids;

        if (initIIDs) {
            startIids = sandbox.instrumentCode.getInitialIIDCounters(false);
        } else {
            try {
                var line;
                startIids = JSON.parse(line = fs.readFileSync(iidf, "utf8"));
            } catch (e) {
                startIids = sandbox.instrumentCode.getInitialIIDCounters(false);
            }
        }
        return startIids;
    }


    function storeInitialIID(outputDir, iids) {
        var path = require('path');
        var fs = require('fs');
        var line;
        var iidf = path.join(outputDir ? outputDir : process.cwd(), INITIAL_IID_FILE_NAME);
        fs.writeFileSync(iidf, JSON.stringify(iids));
    }

    function writeLineToIIDMap(fs, traceWfh, fh, str) {
        if (fh !== null) {
            fh += str;
        }
        fs.writeSync(traceWfh, str);
        return fh;
    }


    /**
     * if not yet open, open the IID map file and write the header.
     * @param {string} outputDir an optional output directory for the sourcemap file
     */
    function writeIIDMapFile(outputDir, initIIDs, isAppend, iidSourceInfo, nBranches) {
        var traceWfh, fs = require('fs'), path = require('path');
        var smapFile = path.join(outputDir, SMAP_FILE_NAME);
        if (initIIDs) {
            traceWfh = fs.openSync(smapFile, 'w');
        } else {
            traceWfh = fs.openSync(smapFile, 'a');
        }

        var fh = null;
        if (isAppend) {
            fh = "";
        }

        fh = writeLineToIIDMap(fs, traceWfh, fh, "(function (sandbox) {\n if (!sandbox.iids) {sandbox.iids = []; sandbox.orig2Inst = {}; }\n");
        fh = writeLineToIIDMap(fs, traceWfh, fh, "var iids = sandbox.iids; var orig2Inst = sandbox.orig2Inst;\n");
        fh = writeLineToIIDMap(fs, traceWfh, fh, "var fn = \"" + curFileName + "\";\n");
        // write all the data
        Object.keys(iidSourceInfo).forEach(function (iid) {
            var sourceInfo = iidSourceInfo[iid];
            fh = writeLineToIIDMap(fs, traceWfh, fh, "iids[" + iid + "] = [fn," + sourceInfo[1] + "," + sourceInfo[2] + "," + sourceInfo[3] + "," + sourceInfo[4] + "];\n");
        });
        Object.keys(orig2Inst).forEach(function (filename) {
            fh = writeLineToIIDMap(fs, traceWfh, fh, "orig2Inst[\"" + filename + "\"] = \"" + orig2Inst[filename] + "\";\n");
        });
        fh = writeLineToIIDMap(fs, traceWfh, fh, "}(typeof " + JALANGI_VAR + " === 'undefined'? " + JALANGI_VAR + " = {}:" + JALANGI_VAR + "));\n");
        fs.closeSync(traceWfh);
        //if (isAppend) {
        //    fs.closeSync(fh);
        //}
        // also write output as JSON, to make consumption easier
        var jsonFile = smapFile.replace(/.js$/, '.json');
        var outputObj = [iidSourceInfo, orig2Inst];
        if (!initIIDs && fs.existsSync(jsonFile)) {
            var oldInfo = JSON.parse(fs.readFileSync(jsonFile));
            var oldIIDInfo = oldInfo[0];
            var oldOrig2Inst = oldInfo[1];
            Object.keys(iidSourceInfo).forEach(function (iid) {
                oldIIDInfo[iid] = iidSourceInfo[iid];
            });
            Object.keys(orig2Inst).forEach(function (filename) {
                oldOrig2Inst[filename] = orig2Inst[filename];
            });
            outputObj = [oldIIDInfo, oldOrig2Inst];
        }
        fs.writeFileSync(jsonFile, JSON.stringify(outputObj));
        fs.writeFileSync(path.join(outputDir, COVERAGE_FILE_NAME), JSON.stringify({
            "covered": 0,
            "branches": nBranches,
            "coverage": []
        }), "utf8");
        return fh;
    }


    function getCode(filename) {
        var fs = require('fs');
        return fs.readFileSync(filename, "utf8");
    }

    function saveCode(n_code, isAppend) {
        var fs = require('fs');
        var path = require('path');
        //if (isAppend) {
        //    fs.appendFileSync(instCodeFileName, n_code, "utf8");
        //} else {
            fs.writeFileSync(instCodeFileName, n_code, "utf8");

//        }
    }

    // args.wrapProgram can be true or false
    // args.initIID can be true or false
    // args.dirIIDFile can be undefined
    // args.inlineIID can be true or false
    // args.fileName must be a string
    // args.instFileName must be a string

    function instrumentAux(code, args) {
        orig2Inst = {};
        if (!args.dirIIDFile) {
            throw new Error("must provide dirIIDFile");
        }
        curFileName = args.filename;
        instCodeFileName = args.instFileName;
        if (curFileName && instCodeFileName) {
            orig2Inst[curFileName] = instCodeFileName;
        }

        var startIids = loadInitialIID(args.dirIIDFile, args.initIID);

        var wrapProgram = HOP(args, 'wrapProgram') ? args.wrapProgram : true;
        var codeAndMData = instrumentCode({code:code, wrapWithTryCatch:wrapProgram, callAnalysisHooks:false, instCodeFileName:instCodeFileName, startIids:startIids});

        storeInitialIID(args.dirIIDFile, codeAndMData.startIids);
//        var extraCode = writeIIDMapFile(args.dirIIDFile, args.initIID, false, codeAndMData.iidSourceInfo, codeAndMData.nBranches);
        var extraCode = writeIIDMapFile(args.dirIIDFile, args.initIID, args.inlineIID, codeAndMData.iidSourceInfo, codeAndMData.nBranches);
        if (extraCode !== null) {
            codeAndMData.code = extraCode+codeAndMData.code;
        }
        return codeAndMData;
    }


    function instrumentFile() {
        var argparse = require('argparse');
        var parser = new argparse.ArgumentParser({
            addHelp: true,
            description: "Command-line utility to perform instrumentation"
        });
        parser.addArgument(['--initIID'], {help: "Initialize IIDs to 0", action: 'storeTrue'});
        parser.addArgument(['--inlineIID'], {help: "Inline IIDs in the instrumented file", action: 'storeTrue'});
        parser.addArgument(['--dirIIDFile'], {
            help: "Directory containing " + SMAP_FILE_NAME + " and " + INITIAL_IID_FILE_NAME,
            defaultValue: process.cwd()
        });
        parser.addArgument(['--out'], {
            help: "Instrumented file name (with path).  The default is to append _jalangi_ to the original JS file name",
            defaultValue: undefined
        });
        parser.addArgument(['file'], {
            help: "file to instrument",
            nargs: 1
        });
        var args = parser.parseArgs();

        if (args.file.length === 0) {
            console.error("must provide file to instrument");
            process.exit(1);
        }

        var fname = args.file[0];
        args.filename = sanitizePath(require('path').resolve(process.cwd(), fname));
        args.instFileName = args.out ? args.out : makeInstCodeFileName(fname);

        var codeAndMData = instrumentAux(getCode(fname), args);
        saveCode(codeAndMData.code, args.inlineIID);
    }


    if (typeof window === 'undefined' && (typeof require !== "undefined") && require.main === module) {
        instrumentFile();
    } else {
        exports.instrumentCodeInternal = instrumentAux;
    }
}(J$));


// depends on J$.instrumentCode

