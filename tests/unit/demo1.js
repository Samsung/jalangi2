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


function foo(x, y) {
    console.log("Running foo with x "+x+" y "+y);
    var z = 20;
    if (2*x == y) {
        if (x > y + 10) {
            z = z - 20;
        }
    }
    if (!z) {
        throw new Error("z cannot be falsy");
    }
}

require('../../src/js/analyses/concolic/jtest');
test(foo, 0, 0);

