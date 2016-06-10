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

// Author: Manu Sridharan

/*jslint node: true */

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
    var fs = require('fs');
    var path = require("path");
    var mkdirp = require('mkdirp');
    var ncp = require('graceful-ncp').ncp;
    var stream = require("stream");
    var util = require("util");
    var assert = require('assert');
    var temp = require('temp').track();
    var ArgumentParser = require('argparse').ArgumentParser;


    var EXTRA_SCRIPTS_DIR = "__jalangi_extra";
    var JALANGI_RUNTIME_DIR = "jalangiRuntime";

    /**
     * computes the Jalangi root directory based on the directory of the script
     */
    function getJalangiRoot() {
        return path.join(__dirname, '../../..');
    }

    /**
     * Instruments all .js files found under dir, and re-writes index.html
     * so that inline scripts are instrumented.  Output is written as a full
     * copy of dir, within outputDir.
     *
     * In addition to the command-line options, the options argument can also
     * include in property astHandler a function that takes the instrumented AST
     * as a parameter and returns a JSON object.  The instrumented code will store
     * the result object in J$.ast_info, so it will be available to analyses at the
     * scriptEnter() callback.
     */
    function instrument(options, cb) {

        if (!cb) {
            throw new Error("must pass in a callback");
        }
        //
        // parse out options
        //

        var verbose = options.verbose;

        var excludePattern = options.exclude;

        var onlyIncludeList = null;

        if (options.only_include) {
            onlyIncludeList = options.only_include.split(path.delimiter);
        }

        var jalangiRoot = getJalangiRoot();

        // should we store instrumented app directly in the output directory?
        var directInOutput = options.direct_in_output;

        instUtil.setHeaders();

        var instrumentInline = options.instrumentInline;
        var inlineJalangi = options.inlineJalangi;
        var inlineIID = options.inlineIID;
        var inlineSource = options.inlineSource;

        var copyRuntime = options.copy_runtime;

        // directory in which original app sits
        var appDir;

        // directory to which app is being copied
        var copyDir;

        // analyses to run in browser
        var analyses = options.analysis;

        // initialization parameters for analysis
        var initParams = options.initParam;

        var astHandler = options.astHandler;


        /**
         * extra scripts to inject into the application and instrument
         * @type {Array.<String>}
         */
        var extraAppScripts = [];
        if (options.extra_app_scripts) {
            extraAppScripts = options.extra_app_scripts.split(path.delimiter);
        }


        function createOrigScriptFilename(name) {
            return name.replace(new RegExp(".js$"), "_orig_.js");
        }

        function rewriteInlineScript(src, metadata) {
            var instname = instUtil.createFilenameForScript(metadata.url);
            var origname = createOrigScriptFilename(instname);

            var options = {
                code: src,
                isEval: false,
                origCodeFileName: origname,
                instCodeFileName: instname,
                inlineSourceMap: inlineIID,
                inlineSource: inlineSource
            };

            var instResult = sandbox.instrumentCode(options);
            var instrumentedCode = instUtil.applyASTHandler(instResult, astHandler, sandbox);
            fs.writeFileSync(path.join(copyDir, instname).replace(/.js$/, "_jalangi_.json"), instResult.sourceMapString, "utf8");
            fs.writeFileSync(path.join(copyDir, origname), src);
            fs.writeFileSync(path.join(copyDir, instname), instrumentedCode);
            return instrumentedCode;
        }

        /**
         * shared between HTMLRewriteStream and InstrumentJSStream
         */
        function accumulateData(chunk, enc, cb) {
            this.data = this.data == null ? chunk : Buffer.concat([this.data,chunk]);;
            cb();
        }

        var Transform = stream.Transform;

        function HTMLRewriteStream(options, filename) {
            Transform.call(this, options);
            this.data = null;
            this.filename = filename;
        }

        util.inherits(HTMLRewriteStream, Transform);

        HTMLRewriteStream.prototype._transform = accumulateData;

        var jalangiRuntimeDir = JALANGI_RUNTIME_DIR;


        HTMLRewriteStream.prototype._flush = function (cb) {
            function getContainedRuntimeScriptTags() {
                var result = "";
                var addScript = function (file) {
                    var fileName = "/" + jalangiRuntimeDir + "/" + path.basename(file);
                    result += "<script src=\"" + fileName + "\"></script>";
                };
                instUtil.headerSources.forEach(addScript);
                if (analyses) {
                    result += instUtil.genInitParamsCode(initParams);
                    analyses.forEach(addScript);
                }
                return result;
            }


            var newHTML;
            var headerLibs;
            var metaStr = '<meta http-equiv="Content-Type" content="text/html; charset=utf-8">\n';

            if (instrumentInline) {
                newHTML = proxy.rewriteHTML(String(this.data), "http://foo.com", rewriteInlineScript, "");
            } else {
                newHTML = String(this.data);

            }
            if (inlineJalangi) {
                headerLibs = instUtil.getInlinedScripts(analyses, initParams, extraAppScripts, EXTRA_SCRIPTS_DIR, jalangiRoot);
            } else {
                if (copyRuntime) {
                    headerLibs = getContainedRuntimeScriptTags();
                } else {
                    var tmp3 = "";
                    if (analyses) {
                        analyses.forEach(function (src) {
                            src = path.resolve(src);
                            tmp3 += "<script src=\"" + src + "\"></script>";
                        });
                    }

                    headerLibs = instUtil.getHeaderCodeAsScriptTags(jalangiRoot);
                    headerLibs = headerLibs + instUtil.genInitParamsCode(initParams);
                    headerLibs = headerLibs + tmp3;
                }
                if (extraAppScripts.length > 0) {
                    // we need to inject script tags for the extra app scripts,
                    // which have been copied into the app directory
                    extraAppScripts.forEach(function (script) {
                        var scriptSrc = path.join(EXTRA_SCRIPTS_DIR, path.basename(script));
                        headerLibs += "<script src=\"" + scriptSrc + "\"></script>";
                    });
                }
            }
            // just inject our header code
            var headIndex = newHTML.indexOf("<head>");
            if (headIndex === -1) {
                headIndex = newHTML.indexOf("<HEAD>");
                if (headIndex === -1) {
                    console.error("WARNING: could not find <head> element in HTML file " + this.filename);
                    this.push(newHTML);
                } else {
                    newHTML = newHTML.slice(0, headIndex + 6) + metaStr + headerLibs + newHTML.slice(headIndex + 6);
                    this.push(newHTML);
                }
            } else {
                newHTML = newHTML.slice(0, headIndex + 6) + metaStr + headerLibs + newHTML.slice(headIndex + 6);
                this.push(newHTML);
            }

            cb();
        };

        function rewriteHtml(readStream, writeStream, filename) {
            readStream.pipe(new HTMLRewriteStream(null, filename)).pipe(writeStream);
        }

        function InstrumentJSStream(options, origScriptName, instScriptName) {
            Transform.call(this, options);
            this.origScriptName = origScriptName;
            this.instScriptName = instScriptName;
            this.data = null;
        }

        util.inherits(InstrumentJSStream, Transform);

        InstrumentJSStream.prototype._transform = accumulateData;


        function writeMetadataToFile(metadata, path) {
            var fd = fs.openSync(path, 'w');
            fs.writeSync(fd, "{\n");
            Object.keys(metadata).forEach(function (iid, ind, arr) {
                fs.writeSync(fd, "  \"" + iid + "\": ");
                fs.writeSync(fd, JSON.stringify(metadata[iid], undefined, 2));
                if (ind < arr.length - 1) {
                    fs.writeSync(fd, ",");
                }
                fs.writeSync(fd, "\n");
            });
            fs.writeSync(fd, "}\n");
            fs.closeSync(fd);
        }

        InstrumentJSStream.prototype._flush = function (cb) {
            if (require.main === module || verbose) {
                console.log("instrumenting " + this.origScriptName);
            }
            var options = {
                code: String(this.data),
                isEval: false,
                origCodeFileName: this.origScriptName,
                instCodeFileName: this.instScriptName,
                inlineSourceMap: inlineIID,
                inlineSource: inlineSource
            };

            var instResult;
            try {
                instResult = sandbox.instrumentCode(options);
            } catch (e) {
                if (e instanceof SyntaxError) {
                    // just output the same file
                    console.log("WARNING: syntax error when instrumenting " + this.origScriptName);
                    this.push(this.data);
                } else {
                    throw e;
                }
            }
            if (instResult) {
                var instrumentedCode = instUtil.applyASTHandler(instResult, astHandler, sandbox);
                fs.writeFileSync(this.instScriptName.replace(/.js$/, "_jalangi_.json"), instResult.sourceMapString, "utf8");
                this.push(instrumentedCode);
            }
            cb();
        };

        function instrumentJS(readStream, writeStream, fileName) {
            // we need to write the original file in addition to piping the instrumented file
            assert.ok(fileName.indexOf(appDir) === 0, "oops");
            var scriptRelativePath = fileName.substring(appDir.length + 1);
            var origScriptCopyName = createOrigScriptFilename(scriptRelativePath);
            readStream.pipe(new InstrumentJSStream(undefined, path.join(copyDir, origScriptCopyName), path.join(copyDir, scriptRelativePath))).pipe(writeStream);
            readStream.pipe(fs.createWriteStream(path.join(copyDir, origScriptCopyName)));
        }

        /**
         * determine if a file is in the include list
         * @param fileName
         * @returns {boolean}
         */
        function includedFile(fileName) {
            var relativePath = fileName.substring(appDir.length + 1);
            var result = false;
            for (var i = 0; i < onlyIncludeList.length; i++) {
                var prefix = onlyIncludeList[i];
                if (relativePath.indexOf(prefix) === 0) {
                    result = true;
                    break;
                }
            }
            return result;
        }

        function transform(readStream, writeStream, file) {
            var extension = path.extname(file.name);
            if (extension === '.html') {
                if (options.no_html || (onlyIncludeList && !includedFile(file.name))) {
                    readStream.pipe(writeStream);
                } else {
                    rewriteHtml(readStream, writeStream, file.name);
                }
            } else if (extension === '.js') {
                // we instrument a JS file iff:
                // (1) it's an extra app script, or
                // (2) an include list is specified and the file name is included, or
                // (3) an include list is not specified, and the file path does not
                //     contain the excludePattern
                var instrumentJSFile = file.name.indexOf(EXTRA_SCRIPTS_DIR) !== -1 ||
                    (onlyIncludeList && includedFile(file.name)) ||
                    (!onlyIncludeList && (!excludePattern || file.name.indexOf(excludePattern) === -1));
                if (instrumentJSFile) {
                    instrumentJS(readStream, writeStream, file.name);
                } else {
//                console.log("excluding " + file.name);
                    readStream.pipe(writeStream);
                }
            } else {
                readStream.pipe(writeStream);
            }
        }

        /**
         * copy the Jalangi runtime files into the directory with
         * instrumented code, so they can be loaded with relative paths
         */
        var copyJalangiRuntime = function () {
            var outputDir = path.join(copyDir, jalangiRuntimeDir);
            mkdirp.sync(outputDir);
            var copyFile = function (srcFile) {
                if (jalangiRoot) {
                    srcFile = path.join(jalangiRoot, srcFile);
                }
                var outputFile = path.join(outputDir, path.basename(srcFile));
                fs.writeFileSync(outputFile, String(fs.readFileSync(srcFile)));
            };
            instUtil.headerSources.forEach(copyFile);
            if (analyses) {
                analyses.forEach(function (f) {
                    var outputFile = path.join(outputDir, path.basename(f));
                    fs.writeFileSync(outputFile, String(fs.readFileSync(f)));
                });
            }
        };

        var outputDir = options.outputDir;

        function initOutputDir(copyDir) {
            mkdirp.sync(copyDir);
//        esnstrument.openIIDMapFile(copyDir);
            // write an empty 'inputs.js' file here, to make replay happy
            // TODO make this filename more robust against name collisions
            // fs.writeFileSync(path.join(copyDir, "inputs.js"), "");
        }

        // are we instrumenting a directory?
        var instDir = options.inputFiles.length === 1 && fs.lstatSync(options.inputFiles[0]).isDirectory();
        var inputDir;
        if (instDir) {
            inputDir = options.inputFiles[0];
        } else {
            // we're instrumenting a list of JavaScript files.  copy them
            // all to a temporary directory and call that the inputDir
            inputDir = temp.mkdirSync("instFiles");
            options.inputFiles.forEach(function (inputFile) {
                assert(!fs.lstatSync(inputFile).isDirectory(), "can't handle multiple directories and files");
                fs.writeFileSync(path.join(inputDir, path.basename(inputFile)), fs.readFileSync(inputFile));
            });

            // also set directInOutput so we get instrumented files directly in output directory
            directInOutput = true;
        }
        appDir = path.resolve(process.cwd(), inputDir);
        if (directInOutput) {
            copyDir = outputDir;
        } else {
            var basename = path.basename(inputDir);
            copyDir = path.join(outputDir, basename);
        }
        initOutputDir(copyDir);
        if (copyRuntime) {
            copyJalangiRuntime();
        }
        if (extraAppScripts.length > 0) {
            // first check that all extra app scripts exist
            extraAppScripts.forEach(function (script) {
                if (!fs.existsSync(script)) {
                    throw new Error("extra script " + script + " does not exist");
                }
            });
            // temporarily copy the scripts to the appDir, so
            // they get instrumented like everything else
            var extraScriptDir = path.join(appDir, EXTRA_SCRIPTS_DIR);
            mkdirp.sync(extraScriptDir);
            extraAppScripts.forEach(function (script) {
                fs.writeFileSync(path.join(extraScriptDir, path.basename(script)), fs.readFileSync(script));
            });
        }

        var callback = function (err) {
//        esnstrument.closeIIDMapFile();
            if (extraAppScripts.length > 0) {
                var extraScriptDir = path.join(appDir, EXTRA_SCRIPTS_DIR);
                extraAppScripts.forEach(function (script) {
                    fs.unlinkSync(path.join(extraScriptDir, path.basename(script)));
                });
                fs.rmdirSync(extraScriptDir);
            }
            cb(err);
        };
        ncp(inputDir, copyDir, {transform: transform}, callback);

    }

    if (require.main === module) { // main script
        var parser = new ArgumentParser({
            addHelp: true,
            description: "Utility to apply Jalangi instrumentation to files or a folder."
        });
        parser.addArgument(['-x', '--exclude'], {help: "do not instrument any scripts whose file path contains this substring"});
        parser.addArgument(['--only_include'], {help: "list of path prefixes specifying which sub-directories should be instrumented, separated by path.delimiter"});
        parser.addArgument(['-i', '--instrumentInline'], {help: "instrument inline scripts", action: 'storeTrue'});
        parser.addArgument(['--inlineIID'], {
            help: "Inline IID to (beginLineNo, beginColNo, endLineNo, endColNo) in J$.iids in the instrumented file",
            action: 'storeTrue'
        });
        parser.addArgument(['--inlineSource'], {
            help: "Inline original source as string in J$.iids.code in the instrumented file",
            action: 'storeTrue'
        });
        parser.addArgument(['--inlineJalangi'], {
            help: "Inline Jalangi runtime source code into HTML files",
            action: 'storeTrue'
        });
        parser.addArgument(['--analysis'], {
            help: "Analysis script.",
            action: "append"
        });
        parser.addArgument(['--initParam'], { help:"initialization parameter for analysis, specified as key:value", action:'append'});
        parser.addArgument(['-d', '--direct_in_output'], {
            help: "Store instrumented app directly in output directory (by default, creates a sub-directory of output directory)",
            action: 'storeTrue'
        });
        parser.addArgument(['-c', '--copy_runtime'], {
            help: "Copy Jalangi runtime files into instrumented app in jalangi_rt sub-directory",
            action: 'storeTrue'
        });
        parser.addArgument(['--extra_app_scripts'], {help: "list of extra application scripts to be injected and instrumented, separated by path.delimiter"});
        parser.addArgument(['--no_html'], {help: "don't inject Jalangi runtime into HTML files", action: 'storeTrue'});
        parser.addArgument(['--outputDir'], {help: "directory in which to place instrumented files", required: true});
        parser.addArgument(['--verbose'], {help: "print verbose output", action: 'storeTrue'});
        parser.addArgument(['--astHandlerModule'], {help: "Path to a node module that exports a function to be used for additional AST handling after instrumentation"});
        parser.addArgument(['inputFiles'], {
            help: "either a list of JavaScript files to instrument, or a single directory under which all JavaScript and HTML files should be instrumented (modulo the --no_html and --exclude flags)",
            nargs: '+'
        });

        var args = parser.parseArgs();

        if (args.astHandlerModule) {
            args.astHandler = require(args.astHandlerModule);
        }

        instrument(args, function (err) {
            if (err) {
                console.error(err);
            }
            console.log('done!');
        });

    } else {
        exports.instrument = instrument;
        exports.EXTRA_SCRIPTS_DIR = EXTRA_SCRIPTS_DIR;
        exports.JALANGI_RUNTIME_DIR = JALANGI_RUNTIME_DIR;
    }
}(J$));

