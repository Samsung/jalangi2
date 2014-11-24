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
 


w = "w global";
var x = "x script local";

function bar(s) {
    console.log(s);
}

function foo() {
    var x = "x local";
    var y = "y local";
    var z = "z local1";

    function bar() {
        var z = "z local2";
        if (x === "x local")
            console.log(x);
        if (y === "y local")
            console.log(y);
        if (z === "z local2")
            console.log(z);
        if (w === "w global")
            console.log(w);
    }

    return bar;
}

foo()();
