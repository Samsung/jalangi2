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

var o = {x: 1, y:2};

o.x = 3;

//o.x = null;

var o1 = {x: 4, y:5};

var o2 = {x: 3};

var o3 = {};

o3.f = o;
o3.f = o1;

var o4 = {};

o4.f1 = o1;
o4.f1 = o2;

var o5 = {};

o5.f = {x:2, y:3};


var o5 = {};
o5.g = [1,2];
o5.g = [];

var o6 = {};
o6.g1 = o1;
o6.g1 = [];

function foo() {
    console.log("Nothing");
}

var o7 = {fun1:1, fun2: function(x, y) { return x + y}};
o7.fun1 = foo;
