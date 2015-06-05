
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
        this.literal = function(iid, funid, sid, fid, f) {};

        this.functionEnter = function (iid, funid, sid, invocationCount){};

        this.functionExit = function(iid, funid, sid, invocationCount){};

        this.invokeFunPre = function(iid, funid, sid, invocationCounter, isConstructor, isMethod, base, f, args) {};

        this.invokeFun = function(iid, funid, sid, invocationCounter, isConstructor, isMethod, base, f, args, result) {};

        this.scriptEnter = function(iid, funid, sid, invocationCount){};

        this.scriptExit = function(iid, funid, sid, invocationCount){};

        this.conditional = function(iid, funid, sid, invocationCount, result){};

        this.endExecution = function() {};

        this.runInstrumentedFunctionBody = function(iid, funid, sid) {return false;};

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



