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
    var testCode;
    var Feature = sandbox.Features;

    function MyAnalysis() {

        function getBranchInfo() {
            var branchInfo = branches[J$.sid - 1];
            if (!branchInfo) {
                var iids = J$.smap[J$.sid];
                var fileName = iids.originalCodeFileName;
                branchInfo = {};
                branches[J$.sid - 1] = branchInfo;
                branchSidToFileName[J$.sid - 1] = fileName;
            }
            return branchInfo;
        }

        this.beginExecution = function (code) {
            testCode = code;
            branches = [];
            branchSidToFileName = [];
        };

        this.conditional = function (iid, result) {
            var branchInfo = getBranchInfo();
            if (result) {
                branchInfo[iid] = 1;
            } else {
                branchInfo[iid - 1] = 1;
            }
        };

        this.endExpression = function (iid) {
            var branchInfo = getBranchInfo();
            branchInfo[iid] = 2;
        };

        this.endExecution = function (noadd) {

            var ret = {};
            for (var i = 0; i < branches.length; i++) {
                if (branches[i] !== undefined) {
                    ret[branchSidToFileName[i]] = branches[i];
                }
            }
            //var fs = require('fs');
            //console.log("coverage" + testIndex + ".json");
            //fs.writeFileSync("tmp/coverage" + testIndex + ".json", JSON.stringify(ret), "utf8");
            testIndex++;
            var stat = Feature.addCoverage(testCode, ret, !noadd);
            console.log("Modified feature graph "+stat.modified);
        };
    }

    sandbox.analysis = new MyAnalysis();
}(J$));




