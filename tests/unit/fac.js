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

var a = J$.readInput(1);
var b = J$.readInput(1);

function exp(n, k) {
    var i, ret = 1;
    for (i = 0; i < k; k++) {
        ret *= n;
    }
    return ret;
}

//function exp(n, k)  {
//    if (n<0) {
//        throw new Error("n is negative");
//    }
//    if (k < 0) {
//        throw new Error("k is negative");
//    }
//    if (k + n === 100) {
//        throw new Error("bad arguments");
//    }
//}

exp(a,b);
