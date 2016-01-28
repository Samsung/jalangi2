
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
    var branches = [];
    var testIndex = 0;
    var branchSidToFileName = [];

    function MyAnalysis() {


        this.beginExecution = function () {
            branches = [];
            branchSidToFileName = [];
        };

        this.conditional = function (iid, result) {
            var iids = J$.smap[J$.sid];
            var fileName = iids.originalCodeFileName;
            var branchInfo = branches[J$.sid-1];
            if (!branchInfo) {
                branchInfo = new Array(iids.nBranches+1);
                branches[J$.sid-1] = branchInfo;
                branchSidToFileName[J$.sid-1] = fileName;
            }
            if (result) {
                branchInfo[iid/4+1] = true;
            } else {
                branchInfo[iid/4] = true;
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

            var ret = {};
            for (var i=0; i<branches.length; i++) {
                if (branches[i] === undefined) {
                    branches[i] = [];
                }
                ret[branchSidToFileName[i]] = branches[i];
            }
            var fs = require('fs');
            console.log("coverage"+testIndex+".json");
            fs.writeFileSync("coverage"+testIndex+".json", JSON.stringify(ret), "utf8");
            testIndex++;
        };
    }

    sandbox.analysis = new MyAnalysis();
}(J$));




