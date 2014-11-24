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


var x, y;

x = J$.readInput(1);
y = J$.readInput(1);

J$.addAxiom("begin");

J$.addAxiom("begin");
J$.addAxiom(x > 20);
J$.addAxiom(x < 30);
J$.addAxiom("and");
J$.addAxiom(x === 100);
J$.addAxiom("or");


if (x > 50) {
    console.log("1");
} else if (x > 2) {
    console.log("2");
} else {
    console.log("5");
}
console.log("3");
