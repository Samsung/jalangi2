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
    var allocCount = {};

    function MyAnalysis() {

        this.literal = function (iid, val, hasGetterSetter) {
            var id = J$.getGlobalIID(iid);
            if (typeof val === 'object')
                allocCount[id] = (allocCount[id] | 0) + 1;
        };

        this.invokeFunPre = function (iid, f, base, args, isConstructor, isMethod, functionIid, functionSid) {
            var id = J$.getGlobalIID(iid);
            if (isConstructor)
                allocCount[id] = (allocCount[id] | 0) + 1;
        };

        this.endExecution = function () {
            print(allocCount);
        };
    }

    function print(map) {
        for (var id in map)
            if (map.hasOwnProperty(id)) {
                sandbox.log("Object allocated at " + J$.iidToLocation(id)+" = "+map[id]);

            }
    }

    sandbox.analysis = new MyAnalysis();
}(J$));

/*
 node src/js/commands/jalangi.js --inlineIID --inlineSource --analysis src/js/sample_analyses/pldi16/CountObjectsPerAllocationSite.js tests/pldi16/CountObjectsPerAllocationSiteTest.js
 node src/js/commands/esnstrument_cli.js --inlineIID --inlineSource --analysis src/js/sample_analyses/pldi16/CountObjectsPerAllocationSite.js --out /tmp/pldi16/CountObjectsPerAllocationSiteTest.html  tests/pldi16/CountObjectsPerAllocationSiteTest.html
 node src/js/commands/esnstrument_cli.js --inlineIID --inlineSource --analysis src/js/sample_analyses/pldi16/CountObjectsPerAllocationSite.js --out /tmp/pldi16/CountObjectsPerAllocationSiteTest.js  tests/pldi16/CountObjectsPerAllocationSiteTest.js
 open file:///tmp/pldi16/CountObjectsPerAllocationSiteTest.html
 */
