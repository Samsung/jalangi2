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
    var trueBranches = {};
    var falseBranches = {};

    function MyAnalysis() {

        this.conditional = function (iid, result) {
            var id = J$.getGlobalIID(iid);
            if (result)
                trueBranches[id] = (trueBranches[id]|0) + 1;
            else
                falseBranches[id] = (falseBranches[id]|0) + 1;
        };

        this.endExecution = function () {
            print(trueBranches, "True");
            print(falseBranches, "False");
        };
    }

    function print(map, str) {
        for (var id in map)
            if (map.hasOwnProperty(id)) {
                sandbox.log(str + " branch taken at " + J$.iidToLocation(id) + " " + map[id] + " times");
            }
    }

    sandbox.analysis = new MyAnalysis();
}(J$));


// node src/js/commands/jalangi.js --inlineIID --inlineSource --analysis src/js/sample_analyses/pldi16/BranchCoverage.js tests/pldi16/BranchCoverageTest.js 
// node src/js/commands/esnstrument_cli.js --inlineIID --inlineSource --analysis src/js/sample_analyses/pldi16/BranchCoverage.js --out /tmp/pldi16/BranchCoverageTest.html  tests/pldi16/BranchCoverageTest.html
// node src/js/commands/esnstrument_cli.js --inlineIID --inlineSource --analysis src/js/sample_analyses/pldi16/BranchCoverage.js --out /tmp/pldi16/BranchCoverageTest.js  tests/pldi16/BranchCoverageTest.js
// open file:///tmp/pldi16/BranchCoverageTest.html
