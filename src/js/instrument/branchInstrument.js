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

// do not remove the following comment
// JALANGI DO NOT INSTRUMENT

/*jslint node: true browser: true */
/*global astUtil acorn esotope J$ */

//var StatCollector = require('../utils/StatCollector');
if (typeof J$ === 'undefined') {
    J$ = {};
}


(function (sandbox) {
    if (typeof sandbox.instrumentCode !== 'undefined') {
        return;
    }

    var global = this;
    var JSON = {parse: global.JSON.parse, stringify: global.JSON.stringify};

    var astUtil = sandbox.astUtil;

    var Config = sandbox.Config;
    var Constants = sandbox.Constants;

    var JALANGI_VAR = Constants.JALANGI_VAR;
    var RP = JALANGI_VAR + "_";

    var logFunctionEnterFunName = JALANGI_VAR + ".Fe";
    var logFunctionReturnFunName = JALANGI_VAR + ".Fr";
    var logFunCallFunName = JALANGI_VAR + ".F";
    var logLitFunName = JALANGI_VAR + ".T";
    var logMethodCallFunName = JALANGI_VAR + ".M";
    var logScriptEntryFunName = JALANGI_VAR + ".Se";
    var logScriptExitFunName = JALANGI_VAR + ".Sr";
    var logTmpVarName = JALANGI_VAR + "._tm_p";
    var logConditionalFunName = JALANGI_VAR + ".C";
    var logSwitchLeftFunName = JALANGI_VAR + ".C1";
    var logSwitchRightFunName = JALANGI_VAR + ".C2";
    var logLastFunName = JALANGI_VAR + "._";
    var logCtrVarName = JALANGI_VAR + "ctr";

    var instrumentCodeFunName = JALANGI_VAR + ".instrumentEvalCode";


    var Syntax = {
        AssignmentExpression: 'AssignmentExpression',
        ArrayExpression: 'ArrayExpression',
        BlockStatement: 'BlockStatement',
        BinaryExpression: 'BinaryExpression',
        BreakStatement: 'BreakStatement',
        CallExpression: 'CallExpression',
        CatchClause: 'CatchClause',
        ConditionalExpression: 'ConditionalExpression',
        ContinueStatement: 'ContinueStatement',
        DoWhileStatement: 'DoWhileStatement',
        DebuggerStatement: 'DebuggerStatement',
        EmptyStatement: 'EmptyStatement',
        ExpressionStatement: 'ExpressionStatement',
        ForStatement: 'ForStatement',
        ForInStatement: 'ForInStatement',
        FunctionDeclaration: 'FunctionDeclaration',
        FunctionExpression: 'FunctionExpression',
        Identifier: 'Identifier',
        IfStatement: 'IfStatement',
        Literal: 'Literal',
        LabeledStatement: 'LabeledStatement',
        LogicalExpression: 'LogicalExpression',
        MemberExpression: 'MemberExpression',
        NewExpression: 'NewExpression',
        ObjectExpression: 'ObjectExpression',
        Program: 'Program',
        Property: 'Property',
        ReturnStatement: 'ReturnStatement',
        SequenceExpression: 'SequenceExpression',
        SwitchStatement: 'SwitchStatement',
        SwitchCase: 'SwitchCase',
        ThisExpression: 'ThisExpression',
        ThrowStatement: 'ThrowStatement',
        TryStatement: 'TryStatement',
        UnaryExpression: 'UnaryExpression',
        UpdateExpression: 'UpdateExpression',
        VariableDeclaration: 'VariableDeclaration',
        VariableDeclarator: 'VariableDeclarator',
        WhileStatement: 'WhileStatement',
        WithStatement: 'WithStatement'
    };


    function HOP(obj, prop) {
        return Object.prototype.hasOwnProperty.call(obj, prop);
    }


    function isArr(val) {
        return Object.prototype.toString.call(val) === '[object Array]';
    }

    function MAP(arr, fun) {
        var len = arr.length;
        if (!isArr(arr)) {
            throw new TypeError();
        }
        if (typeof fun !== "function") {
            throw new TypeError();
        }

        var res = new Array(len);
        for (var i = 0; i < len; i++) {
            if (i in arr) {
                res[i] = fun(arr[i]);
            }
        }
        return res;
    }

    // name of the file containing the instrumented code

    var IID_INC_STEP = 2;
    var iid;
    var origCodeFileName;
    var instCodeFileName;
    var iidSourceInfo;

    var functionNodeStack = [];
    var currentFunctionNode;
    var funCounter = 0;

    function pushFunctionNode(node) {
        functionNodeStack.push(node);
        currentFunctionNode = node;
        node.declaredFunNames = [];
        node.funId = ++funCounter;

    }

    function popFunctionNode() {
        functionNodeStack.pop();
        currentFunctionNode = functionNodeStack[functionNodeStack.length - 1];
    }

    function getIid() {
        var tmpIid = iid;
        iid = iid + IID_INC_STEP;
        return tmpIid;
    }

    function printLineInfoAux(i, ast) {
        if (ast && ast.loc) {
            iidSourceInfo[i] = [ast.loc.start.line, ast.loc.start.column + 1, ast.loc.end.line, ast.loc.end.column + 1];
        }
    }

    function printCondIidToLoc(ast0) {
        printLineInfoAux(iid, ast0);
    }

// J$_i in expression context will replace it by an AST
// {J$_i} will replace the body of the block statement with an array of statements passed as argument

    function replaceInStatement(code) {
        var asts = arguments;
        var visitorReplaceInExpr = {
            'Identifier': function (node) {
                if (node.name.indexOf(RP) === 0) {
                    var i = parseInt(node.name.substring(RP.length));
                    return asts[i];
                } else {
                    return node;
                }
            },
            'BlockStatement': function (node) {
                if (node.body[0].type === 'ExpressionStatement' && isArr(node.body[0].expression)) {
                    node.body = node.body[0].expression;
                }
                return node;
            }
        };
        var ast = acorn.parse(code);
        var newAst = astUtil.transformAst(ast, visitorReplaceInExpr, undefined, undefined, true);
        return newAst.body;
    }

    function replaceInExpr(code) {
        var ret = replaceInStatement.apply(this, arguments);
        return ret[0].expression;
    }

    function createLiteralAst(name) {
        return {type: Syntax.Literal, value: name};
    }

    function createIdentifierAst(name) {
        return {type: Syntax.Identifier, name: name};
    }

    function transferLoc(newNode, oldNode) {
        if (oldNode.loc)
            newNode.loc = oldNode.loc;
        if (oldNode.raw)
            newNode.raw = oldNode.loc;
    }

    function ifObjectExpressionHasGetterSetter(node) {
        if (node.type === "ObjectExpression") {
            var kind, len = node.properties.length;
            for (var i = 0; i < len; i++) {
                if ((kind = node.properties[i].kind) === 'get' || kind === 'set') {
                    return true;
                }
            }
        }
        return false;
    }

    function wrapReturn(node, expr) {
        var lid = (expr === null) ? node : expr;
        if (expr === null) {
            expr = createIdentifierAst("undefined");
        }
        var id = getIid();
        if (!Config.requiresInstrumentation || Config.requiresInstrumentation(id, logFunctionReturnFunName)) {
            printCondIidToLoc(lid);
            var ret = replaceInExpr(
                logFunctionReturnFunName + "(" + RP + "1, " + currentFunctionNode.funId + ", " + logCtrVarName + ", " + RP + "2)",
                createLiteralAst(id),
                expr
            );
            transferLoc(ret, lid);
        } else {
            ret = node;
        }
        return ret;
    }

    function wrapLogicalAnd(node, left, right) {
        var id = getIid();
        if (!Config.requiresInstrumentation || Config.requiresInstrumentation(id, logConditionalFunName)) {
            printCondIidToLoc(node);
            var ret = replaceInExpr(
                logConditionalFunName + "(" + RP + "1, " + currentFunctionNode.funId + ", " + logCtrVarName + "," + RP + "2)?" + RP + "3:" + logLastFunName + "()",
                createLiteralAst(id),
                left,
                right
            );
            transferLoc(ret, node);
            return ret;
        } else {
            return node;
        }
    }

    function wrapLogicalOr(node, left, right) {
        var id = getIid();
        if (!Config.requiresInstrumentation || Config.requiresInstrumentation(id, logConditionalFunName)) {
            printCondIidToLoc(node);
            var ret = replaceInExpr(
                logConditionalFunName + "(" + RP + "1, " + currentFunctionNode.funId + ", " + logCtrVarName + "," + RP + "2)?" + logLastFunName + "():" + RP + "3",
                createLiteralAst(id),
                left,
                right
            );
            transferLoc(ret, node);
            return ret;
        } else {
            return node;
        }
    }

    function wrapSwitchTest(node, test) {
        var id = getIid();
        if (!Config.requiresInstrumentation || Config.requiresInstrumentation(id, logSwitchRightFunName)) {
            printCondIidToLoc(node);
            var ret = replaceInExpr(
                logSwitchRightFunName + "(" + RP + "1, " + currentFunctionNode.funId + ", " + logCtrVarName + "," + RP + "2)",
                createLiteralAst(id),
                test
            );
            transferLoc(ret, node);
            return ret;
        } else {
            return node;
        }
    }

    function wrapConditional(node, test) {
        if (node === null) {
            return node;
        } // to handle for(;;) ;

        var id = getIid();
        if (!Config.requiresInstrumentation || Config.requiresInstrumentation(id, logConditionalFunName)) {
            printCondIidToLoc(node);
            var ret = replaceInExpr(
                logConditionalFunName + "(" + RP + "1, " + currentFunctionNode.funId + ", " + logCtrVarName + "," + RP + "2)",
                createLiteralAst(id),
                test
            );
            transferLoc(ret, node);
            return ret;
        } else {
            return node;
        }

    }

    function funCond(node) {
        var ret = wrapConditional(node.test, node.test);
        node.test = ret;
        return node;
    }

    function createCallAsFunEnterStatement(node, id) {
        printCondIidToLoc(node);
        var ret = replaceInStatement(
            "var " + logCtrVarName + "=" + logFunctionEnterFunName + "(" + RP + "1, " + currentFunctionNode.funId + ")",
            createLiteralAst(id)
        );
        transferLoc(ret, node);
        return ret;
    }

    function createCallAsFunExitStatement(node, id) {
        printCondIidToLoc(node);
        var ret = replaceInStatement(
            logFunctionReturnFunName + "(" + RP + "1," + currentFunctionNode.funId + ", " + logCtrVarName + ")",
            createLiteralAst(id)
        );
        transferLoc(ret[0].expression, node);
        return ret;
    }


    function createCallAsScriptEnterStatement(node, id) {
        printCondIidToLoc(node);
        var ret = replaceInStatement(
            "var " + logCtrVarName + "=" + logScriptEntryFunName + "(" + RP + "1," + currentFunctionNode.funId + ")",
            createLiteralAst(id)
        );
        transferLoc(ret, node);
        return ret;
    }

    function createCallAsScriptExitStatement(node, id) {
        printCondIidToLoc(node);
        var ret = replaceInStatement(
            logScriptExitFunName + "(" + RP + "1," + currentFunctionNode.funId + ", " + logCtrVarName + ")",
            createLiteralAst(id)
        );
        transferLoc(ret[0].expression, node);
        return ret;
    }

    function createExpressionStatement(node) {
        var ret;
        ret = replaceInStatement(
            RP + "1", node
        );
        transferLoc(ret[0].expression, node);
        return ret;
    }

    function syncDefuns(node) {
        var ret = [], ident, declaredFunNames = currentFunctionNode.declaredFunNames, len = declaredFunNames.length;
        for (var i = 0; i < len; i++) {
            var name = declaredFunNames[i];
            ident = createIdentifierAst(name);
            ret = ret.concat(
                createExpressionStatement(wrapLiteral(ident, currentFunctionNode.funId)));
        }
        return ret;
    }

    function instrumentFunctionEntryExit(node, ast) {
        var body, id;
        id = getIid();
        if (!Config.requiresInstrumentation || Config.requiresInstrumentation(id, logFunctionEnterFunName)) {
            body = createCallAsFunEnterStatement(node, id);
        } else {
            body = [];
        }
        body = body.concat(syncDefuns(node)).concat(ast);
        id = getIid();
        if (!Config.requiresInstrumentation || Config.requiresInstrumentation(id, logFunctionReturnFunName)) {
            body = body.concat(createCallAsFunExitStatement(node, id));
        }
        return body;
    }

    function instrumentScriptEntryExit(node, body0) {
        var body, id;
        id = getIid();
        if (!Config.requiresInstrumentation || Config.requiresInstrumentation(id, logScriptEntryFunName)) {
            body = createCallAsScriptEnterStatement(node, id)
        } else {
            body = [];
        }
        body = body.concat(syncDefuns(node)).concat(body0);
        id = getIid();
        if (!Config.requiresInstrumentation || Config.requiresInstrumentation(id, logScriptExitFunName)) {
            body = body.concat(createCallAsScriptExitStatement(node, id));
        }
        return body;
    }

    function wrapLiteral(node, funId) {
        var id = getIid();
        if (!Config.requiresInstrumentation || Config.requiresInstrumentation(id, logLitFunName)) {
            printCondIidToLoc(node);
            var hasGetterSetter = ifObjectExpressionHasGetterSetter(node);

            var ret;
            if (funId || hasGetterSetter) {
                ret = replaceInExpr(
                    logLitFunName + "(" + RP + "1," + currentFunctionNode.funId + ", " + logCtrVarName + ", " + funId + "," + RP + "2)",
                    createLiteralAst(id),
                    node
                );
                transferLoc(ret, node);
                return ret;
            }
        }
        return node;
    }

    var visitorRRPre = {
        'Program': pushFunctionNode,
        'FunctionDeclaration': pushFunctionNode,
        'FunctionExpression': pushFunctionNode
    };


    var visitorRRPost = {
        "Program": function (node) {
            var ret = instrumentScriptEntryExit(node, node.body);
            node.body = ret;
            popFunctionNode();
            return node;
        },
        "FunctionExpression": function (node, context) {
            node.body.body = instrumentFunctionEntryExit(node, node.body.body);
            popFunctionNode();

            var ret1;
            if (context === astUtil.CONTEXT.GETTER || context === astUtil.CONTEXT.SETTER) {
                ret1 = node;
            } else {
                ret1 = wrapLiteral(node, node.funId);
            }
            return ret1;
        },
        "FunctionDeclaration": function (node) {
            node.body.body = instrumentFunctionEntryExit(node, node.body.body);
            popFunctionNode();
            currentFunctionNode.declaredFunNames.push(node.id.name);
            return node; //@todo: need to add wrapLiteral for FunctionDeclaration
        },
        "ReturnStatement": function (node) {
            var ret = wrapReturn(node, node.argument);
            node.argument = ret;
            return node;
        },
        "ObjectExpression": function (node) {
            var ret1 = wrapLiteral(node);
            return ret1;
        },
        'LogicalExpression': function (node) {
            var ret;
            if (node.operator === "&&") {
                ret = wrapLogicalAnd(node, node.left, node.right);
            } else if (node.operator === "||") {
                ret = wrapLogicalOr(node, node.left, node.right);
            }
            return ret;
        },
        "SwitchStatement": function (node) {
            var cases = MAP(node.cases, function (acase) {
                var test;
                if (acase.test) {
                    acase.test = wrapSwitchTest(acase.test, acase.test);
                }
                return acase;
            });
            node.cases = cases;
            return node;
        },
        "ConditionalExpression": funCond,
        "IfStatement": funCond,
        "WhileStatement": funCond,
        "DoWhileStatement": funCond,
        "ForStatement": funCond
    };


    //function mergeBodies(node) {
    //    printIidToLoc(node);
    //    var ret = replaceInStatement(
    //        "function n() { if (!" + logSampleFunName + "(" + RP + "1, arguments.callee)){" + RP + "2} else {" + RP + "3}}",
    //        getIid(),
    //        node.bodyOrig.body,
    //        node.body.body
    //    );
    //
    //    node.body.body = ret[0].body.body;
    //    delete node.bodyOrig;
    //    return node;
    //}
    //
    //RegExp.prototype.toJSON = function () {
    //    var str = this.source;
    //    var glb = this.global;
    //    var ignoreCase = this.ignoreCase;
    //    var multiline = this.multiline;
    //    var obj = {
    //        type: 'J$.AST.REGEXP',
    //        value: str,
    //        glb: glb,
    //        ignoreCase: ignoreCase,
    //        multiline: multiline
    //    }
    //    return obj;
    //}
    //
    //function JSONStringifyHandler(key, value) {
    //    if (key === 'scope') {
    //        return undefined;
    //    } else {
    //        return value;
    //    }
    //}
    //
    //function JSONParseHandler(key, value) {
    //    var ret = value, flags = '';
    //    if (typeof value === 'object' && value && value.type === 'J$.AST.REGEXP') {
    //        if (value.glb)
    //            flags += 'g';
    //        if (value.ignoreCase)
    //            flags += 'i';
    //        if (value.multiline)
    //            flags += 'm';
    //        ret = RegExp(value.value, flags);
    //    }
    //    return ret;
    //}
    //
    //function clone(src) {
    //    var ret = JSON.parse(JSON.stringify(src, JSONStringifyHandler), JSONParseHandler);
    //    return ret;
    //}
    //
    //var visitorCloneBodyPre = {
    //    "FunctionExpression": function (node) {
    //        node.bodyOrig = clone(node.body);
    //        return node;
    //    },
    //    "FunctionDeclaration": function (node) {
    //        node.bodyOrig = clone(node.body);
    //        return node;
    //    }
    //};
    //
    //var visitorMergeBodyPre = {
    //    "FunctionExpression": mergeBodies,
    //    "FunctionDeclaration": mergeBodies
    //};


    //function hoistFunctionDeclaration(ast, hoisteredFunctions) {
    //    var key, child, startIndex = 0;
    //    if (ast.body) {
    //        var newBody = [];
    //        if (ast.body.length > 0) { // do not hoister function declaration before J$.Fe or J$.Se
    //            if (ast.body[0].type === 'ExpressionStatement') {
    //                if (ast.body[0].expression.type === 'CallExpression') {
    //                    if (ast.body[0].expression.callee.object &&
    //                        ast.body[0].expression.callee.object.name === 'J$'
    //                        && ast.body[0].expression.callee.property
    //                        &&
    //                        (ast.body[0].expression.callee.property.name === 'Se' || ast.body[0].
    //                            expression.callee.property.name === 'Fe')) {
    //
    //                        newBody.push(ast.body[0]);
    //                        startIndex = 1;
    //                    }
    //                }
    //            }
    //        }
    //        for (var i = startIndex; i < ast.body.length; i++) {
    //
    //            if (ast.body[i].type === 'FunctionDeclaration') {
    //                newBody.push(ast.body[i]);
    //                if (newBody.length !== i + 1) {
    //                    hoisteredFunctions.push(ast.body[i].id.name);
    //                }
    //            }
    //        }
    //        for (var i = startIndex; i < ast.body.length; i++) {
    //            if (ast.body[i].type !== 'FunctionDeclaration') {
    //                newBody.push(ast.body[i]);
    //            }
    //        }
    //        while (ast.body.length > 0) {
    //            ast.body.pop();
    //        }
    //        for (var i = 0; i < newBody.length; i++) {
    //            ast.body.push(newBody[i]);
    //        }
    //    } else {
    //        //console.log(typeof ast.body);
    //    }
    //    for (key in ast) {
    //        if (ast.hasOwnProperty(key)) {
    //            child = ast[key];
    //            if (typeof child === 'object' && child !== null && key !==
    //                "scope") {
    //                hoistFunctionDeclaration(child, hoisteredFunctions);
    //            }
    //
    //        }
    //    }
    //
    //    return ast;
    //}


    function transformString(code, visitorsPost, visitorsPre) {
        var newAst = acorn.parse(code, {locations: true});
        var len = visitorsPost.length;
        for (var i = 0; i < len; i++) {
            newAst = astUtil.transformAst(newAst, visitorsPost[i], visitorsPre[i], astUtil.CONTEXT.RHS);
        }
        return newAst;
    }

    // if this string is discovered inside code passed to instrumentCode(),
    // the code will not be instrumented
    var noInstr = "// JALANGI DO NOT INSTRUMENT";

    function initializeIIDCounters(forEval) {
        var adj = forEval ? IID_INC_STEP / 2 : 0;
        iid = IID_INC_STEP + adj;
    }


    function instrumentEvalCode(code, iid) {
        return instrumentCode({
            code: code,
            thisIid: iid,
            isEval: true,
            inlineSourceMap: true,
            inlineSource: true
        }).code;
    }

    function removeShebang(code) {
        if (code.indexOf("#!") == 0) {
            return code.substring(code.indexOf("\n") + 1);
        }
        return code;
    }

    /**
     * Instruments the provided code.
     *
     * @param {{isEval: boolean, code: string, thisIid: int, origCodeFileName: string, instCodeFileName: string, inlineSourceMap: boolean, inlineSource: boolean, url: string }} options
     * @return {{code:string, instAST: object, sourceMapObject: object, sourceMapString: string}}
     *
     */
    function instrumentCode(options) {
        var aret, skip = false;
        var isEval = options.isEval,
            code = options.code, thisIid = options.thisIid, inlineSource = options.inlineSource, url = options.url;

        iidSourceInfo = {};
        initializeIIDCounters(isEval);
        instCodeFileName = options.instCodeFileName ? options.instCodeFileName : "eval";
        origCodeFileName = options.origCodeFileName ? options.origCodeFileName : "eval";


        if (sandbox.analysis && sandbox.analysis.instrumentCodePre) {
            aret = sandbox.analysis.instrumentCodePre(thisIid, code);
            if (aret) {
                code = aret.code;
                skip = aret.skip;
            }
        }

        if (!skip && typeof code === 'string' && code.indexOf(noInstr) < 0) {
            try {
                code = removeShebang(code);
                iidSourceInfo = {};
                var newAst;
                newAst = transformString(code, [visitorRRPost], [visitorRRPre]);
//                console.log(JSON.stringify(newAst, null, '\t'));
                // post-process AST to hoist function declarations (required for Firefox)
                var hoistedFcts = [];
//                newAst = hoistFunctionDeclaration(newAst, hoistedFcts);
                var newCode = esotope.generate(newAst, {comment: true});
                code = newCode + "\n" + noInstr + "\n";
            } catch (ex) {
                console.log("Failed to instrument " + code);
                throw ex;
            }
        }

        var tmp = {};

        tmp.nBranches = iidSourceInfo.nBranches = iid / IID_INC_STEP * 2;
        tmp.originalCodeFileName = iidSourceInfo.originalCodeFileName = origCodeFileName;
        tmp.instrumentedCodeFileName = iidSourceInfo.instrumentedCodeFileName = instCodeFileName;
        if (url) {
            tmp.url = iidSourceInfo.url = url;
        }
        if (isEval) {
            tmp.evalSid = iidSourceInfo.evalSid = sandbox.sid;
            tmp.evalIid = iidSourceInfo.evalIid = thisIid;
        }
        if (inlineSource) {
            tmp.code = iidSourceInfo.code = options.code;
        }

        var prepend = JSON.stringify(iidSourceInfo);
        var instCode;
        if (options.inlineSourceMap) {
            instCode = JALANGI_VAR + ".iids = " + prepend + ";\n" + code;
        } else {
            instCode = JALANGI_VAR + ".iids = " + JSON.stringify(tmp) + ";\n" + code;
        }

        if (isEval && sandbox.analysis && sandbox.analysis.instrumentCode) {
            aret = sandbox.analysis.instrumentCode(thisIid, instCode, newAst);
            if (aret) {
                instCode = aret.result;
            }
        }

        return {code: instCode, instAST: newAst, sourceMapObject: iidSourceInfo, sourceMapString: prepend};

    }

    sandbox.instrumentCode = instrumentCode;
    sandbox.instrumentEvalCode = instrumentEvalCode;

}(J$));

//@todo: handle eval
//@todo: hoist functions
//@todo: ENABLE_SAMPLING
//@todo: implement backend


// exports J$.instrumentCode
// exports J$.instrumentEvalCode
// depends on acorn
// depends on esotope
// depends on J$.Constants
// depends on J$.Config
// depends on J$.astUtil

