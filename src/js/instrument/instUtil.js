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

// do not remove the following comment
// JALANGI DO NOT INSTRUMENT

/*jslint node: true */
var fs = require('fs');
var path = require('path');
var urlParser = require('url');


var headerSources = ["node_modules/esotope/esotope.js",
    "node_modules/acorn/dist/acorn.js"];

var headersSet = false;

/**
 * concatenates required scripts for Jalangi to run in the browser into a single string
 */
var headerCode = "";

function setHeaders() {
    if (!headersSet) {
        headerSources = headerSources.concat(require("../headers").headerSources);
        exports.headerSources = headerSources;
        headersSet = true;
    }
}


function getInlinedScripts(analyses, initParams, extraAppScripts, EXTRA_SCRIPTS_DIR, jalangiRoot, cdn) {
    if (!headerCode) {
        if (cdn) {
            headerCode += "<script type=\"text/javascript\" src=\"" + cdn + "/jalangi.js\"></script>";
        } else {
            headerSources.forEach(function (src) {
                if (jalangiRoot) {
                    src = path.join(jalangiRoot, src);
                }
                headerCode += "<script type=\"text/javascript\">";
                headerCode += fs.readFileSync(src);
                headerCode += "</script>";
            });
        }

        if (analyses) {
            var initParamsCode = genInitParamsCode(initParams);
            if (initParamsCode) {
                headerCode += initParamsCode;
            }
            if (cdn) {
                headerCode += "<script type=\"text/javascript\" src=\"" + cdn + "/analyses.js\"></script>";
            } else {
                analyses.forEach(function (src) {
                    src = path.resolve(src);
                    headerCode += "<script type=\"text/javascript\">";
                    headerCode += fs.readFileSync(src);
                    headerCode += "</script>";
                });
            }
        }

        if (extraAppScripts.length > 0) {
            // we need to inject script tags for the extra app scripts,
            // which have been copied into the app directory
            if (cdn) {
                headerCode += "<script type=\"text/javascript\" src=\"" + cdn + "/extras.js\"></script>";
            } else {
                extraAppScripts.forEach(function (script) {
                    var scriptSrc = path.join(EXTRA_SCRIPTS_DIR, path.basename(script));
                    headerCode += "<script type=\"text/javascript\">";
                    headerCode += fs.readFileSync(scriptSrc);
                    headerCode += "</script>";
                });
            }
        }
    }
    return headerCode;
}

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
};

function getFooterString(jalangiRoot) {
    var footerSources = require("../footers").footerSources;
    var footerCode = "";
    footerSources.forEach(function (src) {
        if (jalangiRoot) {
            src = path.join(jalangiRoot, src);
        }
        if (endsWith(src, ".js")) {
            footerCode += "<script type=\"text/javascript\">";
            footerCode += fs.readFileSync(src);
            footerCode += "</script>";
        } else {
            footerCode += fs.readFileSync(src);
        }
    });

    return footerCode;
}

function genInitParamsCode(initParams) {
    var initParamsObj = {};
    if (initParams) {
        initParams.forEach(function (keyVal) {
            var split = keyVal.split(':');
            if (split.length !== 2) {
                throw new Error("invalid initParam " + keyVal);
            }
            initParamsObj[split[0]] = split[1];
        });
    }
    return "<script>J$.initParams = " + JSON.stringify(initParamsObj) + ";</script>";
}

function applyASTHandler(instResult, astHandler, sandbox) {
    if (astHandler && instResult.instAST) {
        var info = astHandler(instResult.instAST);
        if (info) {
            instResult.code = sandbox.Constants.JALANGI_VAR + ".ast_info = " + JSON.stringify(info) + ";\n" + instResult.code;
        }
    }
    return instResult.code;
}

function headerCodeInit(root) {
    headerSources.forEach(function (src) {
        if (root) {
            src = path.join(root, src);
        }
        headerCode += fs.readFileSync(src);
    });
}

function getHeaderCode(root) {
    if (!headerCode) {
        headerCodeInit(root);
    }
    return headerCode;
}

/**
 * returns an HTML string of <script> tags, one of each header file, with the
 * absolute path of the header file
 */
function getHeaderCodeAsScriptTags(root) {
    var ret = "";
    headerSources.forEach(function (src) {
        if (root) {
            src = path.join(root, src);
        }
        src = path.resolve(src);
        ret += "<script src=\"" + src + "\"></script>";
    });
    return ret;
}

var inlineRegexp = /#(inline|event-handler|js-url)/;

/**
 * Does the url (obtained from rewriting-proxy) represent an inline script?
 */
function isInlineScript(url) {
    return inlineRegexp.test(url);
}

/**
 * generate a filename for a script with the given url
 */
function createFilenameForScript(url) {
    // TODO make this much more robust
    console.log("url:" + url);
    var parsed = urlParser.parse(url);
    if (inlineRegexp.test(url)) {
        return parsed.hash.substring(1) + ".js";
    } else {
        return parsed.pathname.substring(parsed.pathname.lastIndexOf("/") + 1);
    }
}

exports.setHeaders = setHeaders;
exports.getHeaderCode = getHeaderCode;
exports.getHeaderCodeAsScriptTags = getHeaderCodeAsScriptTags;
exports.genInitParamsCode = genInitParamsCode;
exports.applyASTHandler = applyASTHandler;
exports.isInlineScript = isInlineScript;
exports.headerSources = headerSources;
exports.createFilenameForScript = createFilenameForScript;
exports.getInlinedScripts = getInlinedScripts;
exports.getFooterString = getFooterString;