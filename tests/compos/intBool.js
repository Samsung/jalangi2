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
var c = J$.readInput(1);

function main() {


    var x = 0, y = 0, z = 0;

    if (a) {
        x = -2;
        console.log("4");
    }
    if (b < 5) {
        if (!a && c) {
            y = 1;
            if (a) {
                y = 2*y;
                console.log("9");
            }
            console.log("1");
        }
        z = 2;
    }

    if (x + y + z === 3) {
        console.log("2");
    } else {
        console.log("3");
    }
}

main();
console.log("5");

