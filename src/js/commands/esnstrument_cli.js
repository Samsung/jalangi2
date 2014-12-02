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
    require('../headers').headerSources.forEach(function (header) {
        require("./../../../" + header);
    });

    var proxy = require("rewriting-proxy");
    var instUtil = require("../instrument/instUtil");
    var fs = require('fs');
    var path = require('path');

    var instrumentCode = sandbox.instrumentCode;
    var Constants = sandbox.Constants;
    var FILESUFFIX1 = "_jalangi_";
    var JALANGI_VAR = Constants.JALANGI_VAR;
    var EXTRA_SCRIPTS_DIR = "__jalangi_extra";
    var outDir;


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


    function createOrigScriptFilename(name) {
        return name.replace(new RegExp(".js$"), "_orig_.js");
    }



    function rewriteInlineScript(src, metadata) {
        var instname = instUtil.createFilenameForScript(metadata.url);
        var origname = createOrigScriptFilename(instname);

        var instCodeAndData = instrumentCode(
            {
                code: src,
                wrapWithTryCatch: true,
                callAnalysisHooks: false,
                origCodeFileName: sanitizePath(origname),
                instCodeFileName: sanitizePath(instname)
            });
        var preprend = JSON.stringify(instCodeAndData.iidSourceInfo);
        var instCode = JALANGI_VAR + ".iids = " + preprend + ";\n" + instCodeAndData.code;

        fs.writeFileSync(path.join(outDir, origname), src, "utf8");
        fs.writeFileSync(makeSMapFileName(path.join(outDir, instname)), preprend, "utf8");
        fs.writeFileSync(path.join(outDir, instname), instCode, "utf8");
        return instCode;
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
        parser.addArgument(['--inlineIID'], {help: "Inline IIDs in the instrumented file", action: 'storeTrue'});
        parser.addArgument(['--outDir'], {
            help: "Directory containing scripts inlined in html",
            defaultValue: process.cwd()
        });
        parser.addArgument(['--out'], {
            help: "Instrumented file name (with path).  The default is to append _jalangi_ to the original JS file name",
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

        var inlineIID = args.inlineIID;
        outDir = args.outDir;

        var analyses = args.analysis;
        var extraAppScripts = [];
        if (args.extra_app_scripts) {
            extraAppScripts = args.extra_app_scripts.split(path.delimiter);
        }

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
                    wrapWithTryCatch: true,
                    callAnalysisHooks: false,
                    origCodeFileName: sanitizePath(fileName),
                    instCodeFileName: sanitizePath(instFileName)
                });
            var preprend = JSON.stringify(instCodeAndData.iidSourceInfo);
            if (inlineIID) {
                instCode = JALANGI_VAR + ".iids = " + preprend + ";\n" + instCodeAndData.code;
            } else {
                instCode = instCodeAndData.code;
            }
            fs.writeFileSync(makeSMapFileName(instFileName), preprend, "utf8");
            fs.writeFileSync(instFileName, instCode, "utf8");
        } else {
            instCode = proxy.rewriteHTML(origCode, "http://foo.com", rewriteInlineScript, instUtil.getInlinedScripts(analyses, extraAppScripts, EXTRA_SCRIPTS_DIR, getJalangiRoot()));
            fs.writeFileSync(instFileName, instCode, "utf8");
        }
    }


    if (typeof window === 'undefined' && (typeof require !== "undefined") && require.main === module) {
        instrumentFile();
    }
}(J$));


// depends on J$.instrumentCode

