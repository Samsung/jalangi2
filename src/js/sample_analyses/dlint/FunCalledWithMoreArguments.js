
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
        var iidToLocation = sandbox.iidToLocation;

        function isNative(f) {
            return f.toString().indexOf('[native code]') > -1 || f.toString().indexOf('[object ') === 0;
        }


        var info = {};

        this.invokeFunPre = function(iid, f, base, args, isConstructor, isMethod){
            if (f.length < args.length && !isNative(f)) {
                info[sandbox.getGlobalIID(iid)] = (info[sandbox.getGlobalIID(iid)]|0) + 1;
            }
        };


        this.endExecution = function() {
            sandbox.Utils.printInfo(info, function(x) {
                sandbox.log("Function at "+iidToLocation(x.iid)+" called "+ x.count+" time(s) with more arguments that expected.");

            });
        };
    }
    sandbox.analysis = new MyAnalysis();
})(J$);



