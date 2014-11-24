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
 


function Cons1 () {
    this.x = 2;
    return null;
}

console.log((new Cons1).x === 2);

function Cons2 () {
    this.x = 2;
    return 1;
}

console.log((new Cons2).x === 2);


function Cons3 () {
    this.x = 2;
    return [6,7];
}

console.log((new Cons3).x === undefined);
console.log((new Cons3)[1] === 7);

function Cons4 () {
    this.x = 2;
    return "";
}

console.log((new Cons4).x === 2);

function Cons5 () {
    this.x = 2;
    return {"x":5};
}

console.log((new Cons5).x === 5);
