/*
 * Copyright 2013 Samsung Information Systems America, Inc.
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


if (typeof window === "undefined") {
    require('../../src/js/InputManager');
    require(process.cwd()+'/inputs');
}


var area = J$.readInput("");
var area2 = J$.readInput("");


area += "World";

function mySubstr(tis, start, length) {

    var ret = J$.readInput("",true);

    var S1 = J$.readInput("",true);
    var S2 = J$.readInput("",true);
    var s = J$.readInput(0,true);
    var l = J$.readInput(0,true);

    if (start >= tis.length) {
        s = tis.length;
    } else if (start >= 0 && start < tis.length) {
        s = start;
    } else if (start < 0 && start >= - tis.length) {
        s = tis.length + start;
    } else {
        s = 0;
    }
    if (length < 0){
        l = 0;
    } else if (length > tis.length - s) {
        l = tis.length - s;
    } else {
        l = length;
    }
    J$.addAxiom(tis === S1 + ret + S2);
    J$.addAxiom(s === S1.length);
    J$.addAxiom(l === ret.length);

    return ret;
}

if (mySubstr(area, 1,2) + area2 === "POW") {
    console.log("1");
} else {
    console.log("2");

}
console.log("3");
