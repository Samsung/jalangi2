/*
 * Copyright (c) 2014 Samsung Electronics Co., Ltd.
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


(function (sandbox) {
    function MyAnalysis () {
        var iidToLocation = sandbox.iidToLocation;
        var Constants = sandbox.Constants;
        var HOP = Constants.HOP;
        var sort = Array.prototype.sort;

        var info = {};

        this.binary = function(iid, op, left, right, result){
            if (op === '+' && typeof result==='string' && (left===undefined || right===undefined)) {
                info[sandbox.getGlobalIID(iid)] = (info[sandbox.getGlobalIID(iid)]|0) + 1;
            }
        };

        this.endExecution = function() {
            sandbox.Utils.printInfo(info, function(x){
                sandbox.log("Concatenated undefined to a string at "+iidToLocation(x.iid)+" "+ x.count+" time(s).");

            });
        };
    }
    sandbox.analysis = new MyAnalysis();
})(J$);



