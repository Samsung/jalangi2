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

/**
 * @file A Jalangi 2 analysis to record branches taken during an execution
 * @author  Koushik Sen
 *
 */

(function (sandbox) {
    var branches = {};

    function MyAnalysis() {

        /**
         * This callback is called after a condition check before branching.
         * Branching can happen in various statements
         * including if-then-else, switch-case, while, for, ||, &&, ?:.
         *
         * @param {number} iid - Static unique instruction identifier of this callback
         * @param {*} result - The value of the conditional expression
         * @returns {{result: *}|undefined} - If an object is returned, the result of
         * the conditional expression is replaced with the value stored in the
         * <tt>result</tt> property of the object.
         */
        this.conditional = function (iid, result) {
            var id = J$.getGlobalIID(iid);
            var branchInfo = branches[id];
            if (!branchInfo) {
                branchInfo = branches[id] = {trueCount: 0, falseCount: 0};
            }
            if (result) {
                branchInfo.trueCount++;
            } else {
                branchInfo.falseCount++;
            }
        };

        /**
         * This callback is called when an execution terminates in node.js.  In a browser
         * environment, the callback is called if ChainedAnalyses.js or ChainedAnalysesNoCheck.js
         * is used and Alt-Shift-T is pressed.
         *
         * @returns {undefined} - Any return value is ignored
         */
        this.endExecution = function () {
            for (var id in branches) {
                if (branches.hasOwnProperty(id)) {
                    var branchInfo = branches[id];
                    console.log("At location " + J$.iidToLocation(id) +
                    " 'true' branch was taken " + branchInfo.trueCount +
                    " time(s) and 'false' branch was taken " + branchInfo.falseCount + " time(s).");
                }
            }
        };
    }

    sandbox.analysis = new MyAnalysis();
}(J$));




