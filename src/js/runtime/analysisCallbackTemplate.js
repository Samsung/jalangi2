
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

// Author: Koushik Sen

// do not remove the following comment
// JALANGI DO NOT INSTRUMENT

// In the following callbacks one can choose to not return anything.
// If all of the callbacks return nothing, we get a passive analysis where the
// concrete execution happens unmodified and callbacks are used to observe the execution.
// Once can choose to return suitable objects with specified fields in some callbacks
// to modify the behavior of the concrete execution.  For example, one could set the skip
// field of an object returned from putFieldPre to true to skip the actual putField operation.
// Similarly, one could set the result field of the object returned from a write callback
// to modify the value that is actually written to a variable. The result field of the object
// returned from a conditional callback can be suitably set to change the control-flow of the
// program execution.  In functionExit and scriptExit,
// one can set the isBacktrack field of the returned object to true to reexecute the body of
// the function from the beginning.  This in conjunction with the ability to change the
// control-flow of a program enables us to explore the different paths of a function in
// symbolic execution.

(function (sandbox) {
    function MyAnalysis () {
        this.invokeFunPre = function(iid, f, base, args, isConstructor, isMethod, internalIid){return {f:f,base:base,args:args,skip:false};};

        this.invokeFun = function(iid, f, base, args, result, isConstructor, isMethod, internalIid){return {result:result};};

        this.literal = function(iid, val, hasGetterSetter) {return {result:val};};

        this.forinObject = function(iid, val){return {result:val};};

        this.declare = function (iid, name, val, isArgument, argumentIndex, isCatchParam){return {result:val};};

        this.getFieldPre = function(iid, base, offset, isComputed, isOpAssign, isMethodCall){return {base:base,offset:offset,skip:false};};

        this.getField = function(iid, base, offset, val, isComputed, isOpAssign, isMethodCall){return {result:val};};

        this.putFieldPre = function(iid, base, offset, val, isComputed, isOpAssign){return {base:base,offset:offset,val:val,skip:false};};

        this.putField = function(iid, base, offset, val, isComputed, isOpAssign){return {result:val};};

        this.read = function(iid, name, val, isGlobal, isScriptLocal){return {result:val};};

        this.write = function(iid, name, val, lhs, isGlobal, isScriptLocal) {return {result:val};};

        this._return = function(iid, val){return {result:val};};

        this._throw = function(iid, val){return {result:val};};

        this._with = function(iid, val){return {result:val};};

        this.functionEnter = function (iid, f, dis, args){};

        this.functionExit = function(iid, returnVal, wrappedExceptionVal){return {returnVal:returnVal,wrappedExceptionVal:wrappedExceptionVal,isBacktrack:false};};

        this.scriptEnter = function(iid, instrumentedFileName, originalFileName){};

        this.scriptExit = function(iid, wrappedExceptionVal){return {wrappedExceptionVal:wrappedExceptionVal,isBacktrack:false};};

        this.binaryPre = function(iid, op, left, right, isOpAssign, isSwitchCaseComparison, isComputed){return {op:op,left:left,right:right,skip:false};};

        this.binary = function(iid, op, left, right, result, isOpAssign, isSwitchCaseComparison, isComputed){return {result:result};};

        this.unaryPre = function(iid, op, left) {return {op:op,left:left,skip:false};};

        this.unary = function(iid, op, left, result){return {result:result};};

        this.conditional = function(iid, result){return {result:result};};

        this.instrumentCodePre = function(iid, code){return {code:code,skip:false};};

        this.instrumentCode = function(iid, newCode, newAst){ return {result:newCode};};

        this.endExpression = function(iid) {};

        this.endExecution = function() {};

        this.runInstrumentedFunctionBody = function(iid) {return false;}; // callback called only when instrumented with Config.ENABLE_SAMPLING = true
                                                                         // if returns true, instrumented function body is executed, else uninstrumented function body is executed

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
        this.onReady = function(cb) { cb(); };
    }
    sandbox.analysis = new MyAnalysis();
})(J$);



