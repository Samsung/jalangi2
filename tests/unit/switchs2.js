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
 


var x = '77';
var y = '';

function f(s) {
    console.log("s="+s);
    return s;
}

switch(x) {
    case f(y):
        console.log("This is y");
        break;
    case f('77'):
    case f('88'):
        console.log("77 and 88");
        break;
    case f('None'):
        console.log("None");
        break;
    default:
        console.log("Default");
        break;
}
