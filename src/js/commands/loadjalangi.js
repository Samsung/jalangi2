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
/*global astUtil acorn esotope J$ */

//var StatCollector = require('../utils/StatCollector');
if (typeof J$ === 'undefined') {
    J$ = {};
}


(function (sandbox) {
    acorn = require("acorn");
    esotope = require("esotope");
    require('../headers').headerSources.forEach(function (header) {
        require("./../../../" + header);
    });

    var proxy = require("rewriting-proxy");
    var instUtil = require("../instrument/instUtil");
    instUtil.setHeaders();
    var fs = require('fs');
    var path = require('path');
    var md5 = require('./md5');

    var instrumentCode = sandbox.instrumentCode;
    var FILESUFFIX1 = "_jalangi_";
    var EXTRA_SCRIPTS_DIR = "__jalangi_extra";
    var outDir, inlineIID, inlineSource, url;


    String.prototype.endsWith = function (suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };

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
        return name.replace(/.js$/, FILESUFFIX1 + ".js").replace(/.html$/, FILESUFFIX1 + ".html");
    }

    function makeSMapFileName(name) {
        return name.replace(/.js$/, ".json");
    }


    function getJalangiRoot() {
        return path.join(__dirname, '../../..');
    }


    function instrumentFile() {
        var argparse = require('argparse');
        var parser = new argparse.ArgumentParser({
            addHelp: true,
            description: "Command-line utility to perform instrumentation"
        });
        parser.addArgument(['--inlineIID'], {help: "Inline IID to (beginLineNo, beginColNo, endLineNo, endColNo) in J$.iids in the instrumented file", action: 'storeTrue'});
        parser.addArgument(['--inlineSource'], {help: "Inline original source as string in J$.iids.code in the instrumented file", action: 'storeTrue'});
        parser.addArgument(['--initParam'], { help: "initialization parameter for analysis, specified as key:value", action:'append'});
        parser.addArgument(['--noResultsGUI'], { help: "disable insertion of results GUI code in HTML", action:'storeTrue'});
        parser.addArgument(['--astHandlerModule'], {help: "Path to a node module that exports a function to be used for additional AST handling after instrumentation"});
        parser.addArgument(['--outDir'], {
            help: "Directory containing scripts inlined in html",
            defaultValue: process.cwd()
        });
        parser.addArgument(['--out'], {
            help: "Instrumented file name (with path).  The default is to append _jalangi_ to the original JS file name",
            defaultValue: undefined
        });
        parser.addArgument(['--url'], {
            help: "URL of the file to be instrumented.  The URL is stored as metadata in the source map and is not used for retrieving the file.",
            defaultValue: undefined
        });
        parser.addArgument(['--extra_app_scripts'], {help: "list of extra application scripts to be injected and instrumented, separated by path.delimiter"});
        parser.addArgument(['--analysis'], {
            help: "Analysis script.",
            action: "append"
        });

        parser.addArgument(['file'], {
            help: "file to instrument",
            nargs: 1
        });
        var args = parser.parseArgs();

        var astHandler = null;
        if (args.astHandlerModule) {
            astHandler = require(args.astHandlerModule);
        }
        var initParams = args.initParam;
        inlineIID = args.inlineIID;
        inlineSource = args.inlineSource;
        outDir = args.outDir;
        url = args.url;

        var prefix = 'if (typeof J$ === "undefined") {\n';
        prefix += " acorn = require('"+path.resolve(__dirname, "./../../../node_modules/acorn/dist/acorn.js")+"');\n";
        prefix += " esotope = require('"+path.resolve(__dirname, "./../../../node_modules/esotope/esotope.js")+"');\n";
        require('../headers').headerSources.forEach(function (header) {
            prefix += " require('"+path.resolve(__dirname, "./../../../" + header)+"');\n";
        });
        if (args.analysis) {
            args.analysis.forEach(function (src) {
                prefix += " require('"+path.resolve(src)+"');\n";
            });
        }
        prefix += "}\n";


        if (args.file.length === 0) {
            console.error("must provide file to instrument");
            process.exit(1);
        }

        var fileName = args.file[0];
        var instFileName = args.out ? args.out : makeInstCodeFileName(fileName);

        var origCode = fs.readFileSync(fileName, "utf8");
        var instCodeAndData, instCode;

        if (fileName.endsWith(".js")) {
            instCodeAndData = instrumentCode(
                {
                    code: origCode,
                    isEval: false,
                    origCodeFileName: sanitizePath(fileName),
                    instCodeFileName: sanitizePath(instFileName),
                    inlineSourceMap: inlineIID,
                    inlineSource: inlineSource,
                    url: url
                });
            instUtil.applyASTHandler(instCodeAndData, astHandler, sandbox);
            fs.writeFileSync(makeSMapFileName(instFileName), instCodeAndData.sourceMapString, "utf8");
            fs.writeFileSync(instFileName, prefix+instCodeAndData.code, "utf8");
        }
    }


    if (typeof window === 'undefined' && (typeof require !== "undefined") && require.main === module) {
        instrumentFile();
    }
}(J$));


// depends on J$.instrumentCode

