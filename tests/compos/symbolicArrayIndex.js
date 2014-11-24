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

var a = [3 , 5, "r", 9, "j", 3, 2, 1, 8, "Hello"];
var i = J$.readInput(0);
var j = J$.readInput(0);

function getItem(base, offset) {
    var ret;

    for (var j = 0; j < base.length; j++) {
        if (j === offset) {
            ret = base[j];
        }
    }
    return ret;
}

if (getItem(a,i) === 3) {
    console.log("1");
}
if (getItem(a,j) === 8) {
    console.log("2");
}
