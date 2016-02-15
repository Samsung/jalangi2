/*
 * Copyright 2016 Samsung Information Systems America, Inc.
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

/**
 * @file A Jalangi 2 analysis to log all callbacks
 * @author  Koushik Sen
 *
 */

(function (sandbox) {
    function MyAnalysis() {

        function getValue(v) {
            var type = typeof v;
            if ((type === 'object' || type ==='function') && v!== null) {
                var shadowObj = sandbox.smemory.getShadowObjectOfObject(v);
                return sandbox.smemory.getIDFromShadowObjectOrFrame(shadowObj);
            } else {
                return v;
            }
        }


        this.invokeFunPre = function (iid, f, base, args, isConstructor, isMethod, functionIid) {
            return {f: f, base: base, args: args, skip: false};
        };

        this.invokeFun = function (iid, f, base, args, result, isConstructor, isMethod, functionIid) {
            return {result: result};
        };

        this.literal = function (iid, val, hasGetterSetter) {
            return {result: val};
        };

        this.forinObject = function (iid, val) {
            return {result: val};
        };

        this.declare = function (iid, name, val, isArgument, argumentIndex, isCatchParam) {
            return {result: val};
        };

        this.getFieldPre = function (iid, base, offset, isComputed, isOpAssign, isMethodCall) {
            return {base: base, offset: offset, skip: false};
        };

        this.getField = function (iid, base, offset, val, isComputed, isOpAssign, isMethodCall) {
            var shadowObj = sandbox.smemory.getShadowObject(base, offset, true);
            var args = {base: sandbox.smemory.getIDFromShadowObjectOrFrame(shadowObj.owner), offset: offset, val: getValue(val), isComputed: isComputed, isOpAssign: isOpAssign, isMethodCall: isMethodCall};
            console.log("getField("+JSON.stringify(args)+") at " + J$.iidToLocation(J$.sid, iid));
            return {result: val};
        };

        this.putFieldPre = function (iid, base, offset, val, isComputed, isOpAssign) {
            return {base: base, offset: offset, val: val, skip: false};
        };

        this.putField = function (iid, base, offset, val, isComputed, isOpAssign) {
            var shadowObj = sandbox.smemory.getShadowObject(base, offset, true);
            var args = {base: sandbox.smemory.getIDFromShadowObjectOrFrame(shadowObj.owner), offset: offset, val: getValue(val), isComputed: isComputed, isOpAssign: isOpAssign};
            console.log("putField("+JSON.stringify(args)+") at " + J$.iidToLocation(J$.sid, iid));
            return {result: val};
        };

        this.read = function (iid, name, val, isGlobal, isScriptLocal) {
            return {result: val};
        };

        this.write = function (iid, name, val, lhs, isGlobal, isScriptLocal) {
            return {result: val};
        };

        this._return = function (iid, val) {
            return {result: val};
        };

        this._throw = function (iid, val) {
            return {result: val};
        };

        this._with = function (iid, val) {
            return {result: val};
        };

        this.functionEnter = function (iid, f, dis, args) {
        };

        this.functionExit = function (iid, returnVal, wrappedExceptionVal) {
            return {returnVal: returnVal, wrappedExceptionVal: wrappedExceptionVal, isBacktrack: false};
        };

        this.scriptEnter = function (iid, instrumentedFileName, originalFileName) {
        };

        this.scriptExit = function (iid, wrappedExceptionVal) {
            return {wrappedExceptionVal: wrappedExceptionVal, isBacktrack: false};
        };

        this.binaryPre = function (iid, op, left, right, isOpAssign, isSwitchCaseComparison, isComputed) {
            return {op: op, left: left, right: right, skip: false};
        };

        this.binary = function (iid, op, left, right, result, isOpAssign, isSwitchCaseComparison, isComputed) {
            return {result: result};
        };

        this.unaryPre = function (iid, op, left) {
            return {op: op, left: left, skip: false};
        };

        this.unary = function (iid, op, left, result) {
            return {result: result};
        };

        this.conditional = function (iid, result) {
            return {result: result};
        };

        this.instrumentCodePre = function (iid, code, isDirect) {
            return {code: code, skip: false};
        };

        this.instrumentCode = function (iid, newCode, newAst, isDirect) {
            return {result: newCode};
        };

        this.endExpression = function (iid) {
        };

        this.endExecution = function () {
        };

        this.runInstrumentedFunctionBody = function (iid, f, functionIid) {
            return false;
        };

        /**
         * onReady is useful if your analysis is running on node.js (i.e., via the direct.js or jalangi.js commands)
         * and needs to complete some asynchronous initialization before the instrumented program starts.  In such a
         * case, once the initialization is complete, invoke the cb function to start execution of the instrumented
         * program.
         *
         * Note that this callback is not useful in the browser, as Jalangi has no control over when the
         * instrumented program runs there.
         * @param cb
         */
        this.onReady = function (cb) {
            cb();
        };
    }

    sandbox.analysis = new MyAnalysis();
})(J$);


// node src/js/commands/jalangi.js --inlineIID --inlineSource --analysis src/js/sample_analyses/ChainedAnalyses.js --analysis src/js/runtime/SMemory.js --analysis src/js/sample_analyses/tutorial/LogAll.js tests/octane/deltablue.js

