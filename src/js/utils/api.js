/*
 * Copyright 2014 Samsung Information Systems America, Inc.
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

/**
 * API for invoking Jalangi programatically from node.js code
 */

// places required functions on J$
require('./../Constants.js');
require('./../Config.js');
require('./../instrument/astUtil.js');
require('./../instrument/esnstrument.js');
// TODO making globals here is kind of gross, but esnstrument relies on it
acorn = require('acorn');
esotope = require('esotope');

var path = require('path');
var temp = require('temp');
var Q = require("q");
var instDir = require('./../commands/instrument');
var cp = require('child_process');


function getInstOutputFile(filePath) {
    if (filePath) {
        return path.resolve(filePath);
    } else {
        return temp.path({suffix: '.js'});
    }
}

/**
 * setup the global Config object based on the given instrumentation handler object
 * @param instHandler
 */
function setupConfig(instHandler) {
    var conf = J$.Config;
    conf.INSTR_READ = instHandler.instrRead;
    conf.INSTR_WRITE = instHandler.instrWrite;
    conf.INSTR_GETFIELD = instHandler.instrGetfield;
    conf.INSTR_PUTFIELD = instHandler.instrPutfield;
    conf.INSTR_BINARY = instHandler.instrBinary;
    conf.INSTR_PROPERTY_BINARY_ASSIGNMENT = instHandler.instrPropBinaryAssignment;
    conf.INSTR_UNARY = instHandler.instrUnary;
    conf.INSTR_LITERAL = instHandler.instrLiteral;
    conf.INSTR_CONDITIONAL = instHandler.instrConditional;
}

/**
 * clear any configured instrumentation control functions from the global Config object
 */
function clearConfig() {
    var conf = J$.Config;
    conf.INSTR_READ = null;
    conf.INSTR_WRITE = null;
    conf.INSTR_GETFIELD = null;
    conf.INSTR_PUTFIELD = null;
    conf.INSTR_BINARY = null;
    conf.INSTR_PROPERTY_BINARY_ASSIGNMENT = null;
    conf.INSTR_UNARY = null;
    conf.INSTR_LITERAL = null;
    conf.INSTR_CONDITIONAL = null;
}

/**
 * instruments a code string, returning an object with the following fields:
 * - code: the instrumented code string
 * - instAST: AST for the instrumented code
 * - sourceMapObject: mapping from IIDs to source info
 *
 * The options parameter can contain the following parameters:
 *
 * - inputFileName: this name will be associated
 * with the original code in the source map.
 * - outputFile: file name for instrumented code.  note that this
 * method does *not* write the file; this information is just for
 * the source map
 * - inlineSourceMap: should source map information be embedded in the
 * instrumented source code?
 * - inlineSource: should the original source code be embedded in the
 * instrument source code?
 * - instHandler: An instrumentation handler object, for controlling which
 * constructs get instrumented.  Possible properties are instrRead, instrWrite, instrGetfield,
 * instrPutfield, instrBinary, instrPropBinaryAssignment, instrUnary, instrLiteral, and instrConditional,
 * corresponding to the similarly-named properties documented in Config.js.
 * - astHandler: a function that takes the instrumented AST as a parameter and returns a JSON
 * object.  The instrumented code will store the result object in J$.ast_info, so it will be
 * available to analyses at the scriptEnter() callback.
 *
 * @param code
 */
function instrumentString(code, options) {
    if (!options) {
        options = {};
    }
    var outputFileName = getInstOutputFile(options.outputFile);
    var instCodeOptions = {
        code: code,
        origCodeFileName: options.inputFileName,
        instCodeFileName: outputFileName,
        inlineSourceMap: options.inlineSourceMap,
        inlineSource: options.inlineSource
    };
    if (options.instHandler) {
        setupConfig(options.instHandler);
    }
    var result = J$.instrumentCode(instCodeOptions);
    clearConfig();
    if (options.astHandler) {
        var info = options.astHandler(result.instAST);
        if (info) {
            result.code = J$.Constants.JALANGI_VAR + ".ast_info = " + JSON.stringify(info) + ";\n" + result.code;
        }
    }
    return result;
}


/**
 * instruments a directory.  see src/js/commands/instrument.js for details.
 * creates a temporary output directory if none specified.
 * @param options instrument options.  see src/js/commands/instrument.js
 * @return promise|Q.promise promise that gets resolved at the end of instrumentation
 */
function instrumentDir(options) {
    if (!options.outputDir) {
        options.outputDir = temp.mkdirSync();
    }
    if (options.instHandler) {
        setupConfig(options.instHandler);
    }
    var deferred = Q.defer();
    instDir.instrument(options, function (err) {
        clearConfig();
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve({ outputDir: options.outputDir});
        }
    });
    return deferred.promise;
}

function convertToString(buffer_parts, bufferLength) {
    var buf = new Buffer(bufferLength);
    var pos = 0;
    for (var i = 0; i < buffer_parts.length; i++) {
        buffer_parts[i].copy(buf, pos, 0, buffer_parts[i].length);
        pos += buffer_parts[i].length;
    }
    return buf.toString();
}

/**
 * Runs a process created via the node child_process API and captures its output.
 *
 * @param forkedProcess the process
 * @returns {promise|Q.promise} A promise that, when process execution completes normally, is
 * resolved with an object with the following properties:
 *     'stdout': the stdout output of the process
 *     'stderr': the stderr output of the process
 *
 *     If process completes abnormally (with non-zero exit code), the promise is rejected
 *     with a value similar to above, except that 'exitCode' holds the exit code.
 *
 */
function runChildAndCaptureOutput(forkedProcess) {
    var stdout_parts = [], stdoutLength = 0, stderr_parts = [], stderrLength = 0,
        deferred = Q.defer();
    forkedProcess.stdout.on('data', function (data) {
        stdout_parts.push(data);
        stdoutLength += data.length;
    });
    forkedProcess.stderr.on('data', function (data) {
        stderr_parts.push(data);
        stderrLength += data.length;
    });
    forkedProcess.on('close', function (code) {
        var child_stdout = convertToString(stdout_parts, stdoutLength),
            child_stderr = convertToString(stderr_parts, stderrLength);
        var resultVal = {
            exitCode: code,
            stdout: child_stdout,
            stderr: child_stderr,
            toString: function () {
                return child_stderr;
            }
        };
        if (code !== 0) {
            deferred.reject(resultVal);
        } else {
            deferred.resolve(resultVal);
        }
    });
    return deferred.promise;

}

/**
 * direct analysis of an instrumented file using analysis2 engine
 * @param {string} script the instrumented script to analyze
 * @param {string[]} clientAnalyses the analyses to run
 * @param {object} [initParam] parameter to pass to client init() function
 * @return promise|Q.promise promise that gets resolved at the end of analysis.  The promise
 * is resolved with an object with properties:
 *     'exitCode': the exit code from the process doing replay
 *     'stdout': the stdout of the replay process
 *     'stderr': the stderr of the replay process
 *     'result': the result returned by the analysis, if any
 */
function analyze(script, clientAnalyses, initParam) {
    var directJSScript = path.resolve(__dirname, "../commands/direct.js");
    var cliArgs = [];
    if (!script) {
        throw new Error("must provide a script to analyze");
    }
    if (!clientAnalyses) {
        throw new Error("must provide an analysis to run");
    }
    clientAnalyses.forEach(function (analysis) {
        cliArgs.push('--analysis');
        cliArgs.push(analysis);
    });
    if (initParam) {
        Object.keys(initParam).forEach(function (k) {
            cliArgs.push('--initParam')
            cliArgs.push(k + ':' + initParam[k]);
        });
    }
    cliArgs.push(script);
    var proc = cp.fork(directJSScript, cliArgs, { silent: true });
    return runChildAndCaptureOutput(proc);
}


exports.instrumentString = instrumentString;
exports.instrumentDir = instrumentDir;
exports.analyze = analyze;