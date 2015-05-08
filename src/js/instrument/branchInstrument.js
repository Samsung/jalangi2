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
    var sid;

    var Config = sandbox.Config;
    var Constants = sandbox.Constants;

    var JALANGI_VAR = Constants.JALANGI_VAR;
    var RP = JALANGI_VAR + "_";

    var logFunctionEnterFunName = JALANGI_VAR + ".Fe";
    var logFunctionReturnFunName = JALANGI_VAR + ".Fr";
    var logLitFunName = JALANGI_VAR + ".T";
    var logScriptEntryFunName = JALANGI_VAR + ".Se";
    var logScriptExitFunName = JALANGI_VAR + ".Sr";
    var logConditionalFunName = JALANGI_VAR + ".C";
    var logSwitchLeftFunName = JALANGI_VAR + ".C1";
    var logSwitchRightFunName = JALANGI_VAR + ".C2";
    var logLastFunName = JALANGI_VAR + "._";
    var logCtrVarName = JALANGI_VAR + "cntr";
    var logSwitchVarName = JALANGI_VAR + "switch";
    var logSampleFunName = JALANGI_VAR + ".S";



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
        node.declaredFunNodes = [];
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

    function printIidToLoc(ast0) {
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

    function idsOfGetterSetter(node) {
        var ret = {}, isEmpty  = true;
        if (node.type === "ObjectExpression") {
            var kind, len = node.properties.length;
            for (var i = 0; i < len; i++) {
                if ((kind = node.properties[i].kind) === 'get' || kind === 'set') {
                    ret[kind + node.properties[i].key.name] = node.properties[i].value.funId;
                    isEmpty = false;
                }
            }
        }
        return isEmpty?undefined:ret;
    }

    function wrapReturn(node, expr) {
        var lid = (expr === null) ? node : expr;
        if (expr === null) {
            expr = createIdentifierAst("undefined");
        }
        var id = getIid();
        if (!Config.requiresInstrumentation || Config.requiresInstrumentation(id, currentFunctionNode.funId, sid, logFunctionReturnFunName)) {
            printIidToLoc(lid);
            var ret = replaceInExpr(
                logFunctionReturnFunName + "(" + RP + "1, " + currentFunctionNode.funId + ","+sid+", " + logCtrVarName + ", " + RP + "2)",
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
        if (!Config.requiresInstrumentation || Config.requiresInstrumentation(id, currentFunctionNode.funId, sid, logConditionalFunName)) {
            printIidToLoc(node);
            var ret = replaceInExpr(
                logConditionalFunName + "(" + RP + "1, " + currentFunctionNode.funId + ","+sid+", " + logCtrVarName + "," + RP + "2)?" + RP + "3:" + logLastFunName + "()",
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
        if (!Config.requiresInstrumentation || Config.requiresInstrumentation(id, currentFunctionNode.funId, sid, logConditionalFunName)) {
            printIidToLoc(node);
            var ret = replaceInExpr(
                logConditionalFunName + "(" + RP + "1, " + currentFunctionNode.funId + ","+sid+", " + logCtrVarName + "," + RP + "2)?" + logLastFunName + "():" + RP + "3",
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

    function wrapSwitchDiscriminant(node, discriminant) {
        var id = getIid();
        if (!Config.requiresInstrumentation || Config.requiresInstrumentation(id, currentFunctionNode.funId, sid, logSwitchLeftFunName)) {
            printIidToLoc(node);
            var ret = replaceInExpr(
                logSwitchVarName+" = "+logSwitchLeftFunName + "(" + RP + "1, "+ currentFunctionNode.funId + ","+sid+", " + logCtrVarName + "," + RP + "2)",
                createLiteralAst(id),
                discriminant
            );
            transferLoc(ret, node);
            return ret;
        } else {
            return node;
        }
    }



    function wrapSwitchTest(node, test) {
        var id = getIid();
        if (!Config.requiresInstrumentation || Config.requiresInstrumentation(id, currentFunctionNode.funId, sid, logSwitchRightFunName)) {
            printIidToLoc(node);
            var ret = replaceInExpr(
                logSwitchRightFunName + "(" + RP + "1, " + currentFunctionNode.funId + ","+sid+", " + logCtrVarName + "," + logSwitchVarName+"," + RP + "2)",
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
        if (!Config.requiresInstrumentation || Config.requiresInstrumentation(id, currentFunctionNode.funId, sid, logConditionalFunName)) {
            printIidToLoc(node);
            var ret = replaceInExpr(
                logConditionalFunName + "(" + RP + "1, " + currentFunctionNode.funId + ","+sid+", " + logCtrVarName + "," + RP + "2)",
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

    function createCallAsFunEnterStatement(node) {
        var id = getIid();
        if (!Config.requiresInstrumentation || Config.requiresInstrumentation(id, currentFunctionNode.funId, sid, logFunctionEnterFunName)) {
            printIidToLoc(node);
            var ret = replaceInStatement(
                "var " + logSwitchVarName + "," + logCtrVarName + "=" + logFunctionEnterFunName + "(" + RP + "1, " + currentFunctionNode.funId + ","+sid+")",
                createLiteralAst(id)
            );
            transferLoc(ret, node);
            return ret;
        } else {
            return [];
        }
    }

    function createCallAsFunExitStatement(node) {
        var id = getIid();
        if (!Config.requiresInstrumentation || Config.requiresInstrumentation(id, currentFunctionNode.funId, sid, logFunctionReturnFunName)) {
            printIidToLoc(node);
            var ret = replaceInStatement(
                logFunctionReturnFunName + "(" + RP + "1," + currentFunctionNode.funId + ","+sid+", " + logCtrVarName + ")",
                createLiteralAst(id)
            );
            transferLoc(ret[0].expression, node);
            return ret;
        } else {
            return [];
        }
    }


    function createCallAsScriptEnterStatement(node) {
        var id = getIid();
        if (!Config.requiresInstrumentation || Config.requiresInstrumentation(id, currentFunctionNode.funId, sid, logScriptEntryFunName)) {
            printIidToLoc(node);
            var ret = replaceInStatement(
                "var " + logCtrVarName + "=" + logScriptEntryFunName + "(" + RP + "1," + currentFunctionNode.funId + ","+sid+")",
                createLiteralAst(id)
            );
            transferLoc(ret, node);
            return ret;
        } else {
            return [];
        }
    }

    function createCallAsScriptExitStatement(node) {
        var id = getIid();
        if (!Config.requiresInstrumentation || Config.requiresInstrumentation(id, currentFunctionNode.funId, sid, logScriptExitFunName)) {
            printIidToLoc(node);
            var ret = replaceInStatement(
                logScriptExitFunName + "(" + RP + "1," + currentFunctionNode.funId + ","+sid+", " + logCtrVarName + ")",
                createLiteralAst(id)
            );
            transferLoc(ret[0].expression, node);
            return ret;
        } else {
            return [];
        }
    }

    function createExpressionStatement(node) {
        var ret;
        ret = replaceInStatement(
            RP + "1", node
        );
        transferLoc(ret[0].expression, node);
        return ret;
    }

    function wrapLiteral(node, funId) {
        var id = getIid();
        if (!Config.requiresInstrumentation || Config.requiresInstrumentation(id, currentFunctionNode.funId, sid, logLitFunName)) {
            printIidToLoc(node);
            var idsOfGetterSetters = idsOfGetterSetter(node);

            var ret;
            if (funId || idsOfGetterSetters) {
                ret = replaceInExpr(
                    logLitFunName + "(" + RP + "1," + currentFunctionNode.funId + ","+sid+", " + logCtrVarName + ", " + funId + "," + RP + "2, "+JSON.stringify(idsOfGetterSetters)+")",
                    createLiteralAst(id),
                    node
                );
                transferLoc(ret, node);
                return ret;
            }
        }
        return node;
    }

    function syncDefuns(node) {
        var ret = [], ident, declaredFunNodes = currentFunctionNode.declaredFunNodes, len = declaredFunNodes.length;
        for (var i = 0; i < len; i++) {
            var name = declaredFunNodes[i].id.name;
            var id = declaredFunNodes[i].funId;
            ident = createIdentifierAst(name);
            ret = ret.concat(
                createExpressionStatement(wrapLiteral(ident, id)));
        }
        delete currentFunctionNode.declaredFunNodes;
        return ret;
    }

    function instrumentFunctionEntryExit(node, ast) {
        var body;
        body = createCallAsFunEnterStatement(node);
        body = body.concat(syncDefuns(node)).concat(ast);
        body = body.concat(createCallAsFunExitStatement(node));
        return body;
    }

    function instrumentScriptEntryExit(node, body0) {
        var body;
        body = createCallAsScriptEnterStatement(node);
        body = body.concat(syncDefuns(node)).concat(body0);
        body = body.concat(createCallAsScriptExitStatement(node));
        return body;
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
            currentFunctionNode.declaredFunNodes.push(node);
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
            var dis = wrapSwitchDiscriminant(node.discriminant, node.discriminant);
            var cases = MAP(node.cases, function (acase) {
                var test;
                if (acase.test) {
                    acase.test = wrapSwitchTest(acase.test, acase.test);
                }
                return acase;
            });
            node.discriminant = dis;
            node.cases = cases;
            return node;
        },
        "ConditionalExpression": funCond,
        "IfStatement": funCond,
        "WhileStatement": funCond,
        "DoWhileStatement": funCond,
        "ForStatement": funCond
    };


    function mergeBodies(node) {
        var id = getIid();
        if (!Config.requiresInstrumentation || Config.requiresInstrumentation(id, node.funId, sid, logSampleFunName)) {
            printIidToLoc(node);
            var ret = replaceInStatement(
                "function n() { if (!" + logSampleFunName + "(" + RP + "1, " + node.funId + ","+sid+")){" + RP + "2} else {" + RP + "3}}",
                createLiteralAst(id),
                node.bodyOrig.body,
                node.body.body
            );

            node.body.body = ret[0].body.body;
            delete node.bodyOrig;
        }
        return node;
    }

    RegExp.prototype.toJSON = function () {
        var str = this.source;
        var glb = this.global;
        var ignoreCase = this.ignoreCase;
        var multiline = this.multiline;
        var obj = {
            type: 'J$.AST.REGEXP',
            value: str,
            glb: glb,
            ignoreCase: ignoreCase,
            multiline: multiline
        };
        return obj;
    };

    function JSONStringifyHandler(key, value) {
        if (key === 'scope' || key === 'funId' || key === 'declaredFunNodes') {
            return undefined;
        } else {
            return value;
        }
    }

    function JSONParseHandler(key, value) {
        var ret = value, flags = '';
        if (typeof value === 'object' && value && value.type === 'J$.AST.REGEXP') {
            if (value.glb)
                flags += 'g';
            if (value.ignoreCase)
                flags += 'i';
            if (value.multiline)
                flags += 'm';
            ret = RegExp(value.value, flags);
        }
        return ret;
    }

    function clone(src) {
        var ret = JSON.parse(JSON.stringify(src, JSONStringifyHandler), JSONParseHandler);
        return ret;
    }

    var visitorCloneBodyPost = {
        "FunctionExpression": function (node) {
            node.bodyOrig = clone(node.body);
            return node;
        },
        "FunctionDeclaration": function (node) {
            node.bodyOrig = clone(node.body);
            return node;
        }
    };

    var visitorMergeBodyPost = {
        "FunctionExpression": mergeBodies,
        "FunctionDeclaration": mergeBodies
    };


    function hoistFunctionDeclaration(ast, hoisteredFunctions) {
        var key, child, startIndex = 0;
        if (ast.body) {
            var newBody = [];
            if (ast.body.length > 0) { // do not hoister function declaration before J$.Fe or J$.Se
                if (ast.body[0].type === 'ExpressionStatement') {
                    if (ast.body[0].expression.type === 'CallExpression') {
                        if (ast.body[0].expression.callee.object &&
                            ast.body[0].expression.callee.object.name === 'J$'
                            && ast.body[0].expression.callee.property
                            &&
                            (ast.body[0].expression.callee.property.name === 'Se' || ast.body[0].
                                expression.callee.property.name === 'Fe')) {

                            newBody.push(ast.body[0]);
                            startIndex = 1;
                        }
                    }
                }
            }
            for (var i = startIndex; i < ast.body.length; i++) {

                if (ast.body[i].type === 'FunctionDeclaration') {
                    newBody.push(ast.body[i]);
                    if (newBody.length !== i + 1) {
                        hoisteredFunctions.push(ast.body[i].id.name);
                    }
                }
            }
            for (var i = startIndex; i < ast.body.length; i++) {
                if (ast.body[i].type !== 'FunctionDeclaration') {
                    newBody.push(ast.body[i]);
                }
            }
            while (ast.body.length > 0) {
                ast.body.pop();
            }
            for (var i = 0; i < newBody.length; i++) {
                ast.body.push(newBody[i]);
            }
        } else {
            //console.log(typeof ast.body);
        }
        for (key in ast) {
            if (ast.hasOwnProperty(key)) {
                child = ast[key];
                if (typeof child === 'object' && child !== null && key !==
                    "scope") {
                    hoistFunctionDeclaration(child, hoisteredFunctions);
                }

            }
        }

        return ast;
    }


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

    function initializeIIDCounters() {
        var adj = 0;
        iid = IID_INC_STEP + adj;
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
     * @param {{code: string, origCodeFileName: string, instCodeFileName: string, url: string, sid: number }} options
     * @return {{code:string, instAST: object, sourceMapObject: object, sourceMapString: string}}
     *
     */
    function instrumentCode(options) {
        var code = options.code,  url = options.url;

        iidSourceInfo = {};
        sid = options.sid;
        initializeIIDCounters();
        instCodeFileName = options.instCodeFileName;
        origCodeFileName = options.origCodeFileName;


        if (typeof code === 'string' && code.indexOf(noInstr) < 0) {
            try {
                code = removeShebang(code);
                iidSourceInfo = {};
                var newAst;
                newAst = transformString(code, [visitorCloneBodyPost, visitorRRPost, visitorMergeBodyPost], [undefined, visitorRRPre, undefined]);
//                var hoistedFcts = [];
//                newAst = hoistFunctionDeclaration(newAst, hoistedFcts);
                var newCode = esotope.generate(newAst, {comment: true});
                code = newCode + "\n" + noInstr + "\n";
            } catch (ex) {
                console.log("Failed to instrument " + code);
                throw ex;
            }
        }

        iidSourceInfo.originalCodeFileName = origCodeFileName;
        iidSourceInfo.instrumentedCodeFileName = instCodeFileName;
        if (url) {
            iidSourceInfo.url = url;
        }
        iidSourceInfo.sid = sid;

        return {code: code, instAST: newAst, sourceMapObject: iidSourceInfo, sourceMapString: JSON.stringify(iidSourceInfo)};

    }

    sandbox.instrumentCode = instrumentCode;
}(J$));

//@todo: hoist functions
//@todo: implement backend


// exports J$.instrumentCode
// exports J$.instrumentEvalCode
// depends on acorn
// depends on esotope
// depends on J$.Constants
// depends on J$.Config
// depends on J$.astUtil

