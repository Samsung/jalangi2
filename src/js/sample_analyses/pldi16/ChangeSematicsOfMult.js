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

        this.binaryPre = function (iid, op, left, right, isOpAssign, isSwitchCaseComparison, isComputed) {
            if (op === "*")
                return {op: op, left: left, right: right, skip: true};
        };

        this.binary = function (iid, op, left, right, result, isOpAssign, isSwitchCaseComparison, isComputed) {
            if (op === "*")
                return {result: left+right};
        };

    }

    sandbox.analysis = new MyAnalysis();
}(J$));

/*
 node src/js/commands/jalangi.js --inlineIID --inlineSource --analysis src/js/sample_analyses/pldi16/ChangeSematicsOfMult.js tests/pldi16/ChangeSematicsOfMultTest.js
 */

