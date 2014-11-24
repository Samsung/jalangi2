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
    require('../../src/js/InputManager2');
    require(process.cwd()+'/inputs');
}

var x, y = 1, z;

function f1(x) {
    if (x>0){
        console.log("1");
        z = 2;
    } else {
        console.log("2");
        z = -4;
    }
}

function f2(x) {
    if (x==10){
        console.log("3");
        z = 5;
    } else {
        console.log("4");
        y = -1;
    }
}


function main() {
    x = J$.readInput(1);
    f1(x);
    f2(x);
    if (y + z > 3) {
        console.log("5");
    }
}

main();

console.log("6");


