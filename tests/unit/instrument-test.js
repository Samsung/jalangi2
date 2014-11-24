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

var i;
var a = [1, 2, 3, 4];

lbl1: for (i=0; i < a.length; i++) {
    if (i===0) {
        continue;
    }
    console.log(a[i]);
}

function f1 (j) {

    function f2 (c) {
        var sum = c;
        var x;
        try {
            sum *= j;
            if (sum > 4) {
                sum = -sum;
            }
            i = 0;
            while(i < sum) {
                console.log(i);
                i++;
            }
            do {
                console.log(i);
                i--;
            } while (i > 0);

        } finally {
            return sum;
        }
    }

    return function f6(i) {
        return j + f2(i);
    }
}

var o = {
    x : 1,
    f1: function() {
        this.x += 5;
        this[x] -= 4;
    },
    del: 5

}

o.f1();
delete o.del;
console.log(f1(3)(5));


var arr = new Array("a", "b", "c");
var arr2 = ["a", i, o];
var regex1 = /Hello/ig;
var undef = undefined;
var infty = Infinity;
infty = NaN;

for (i in arr) {
    console.log(i);
    console.log(arr[i]);
}

function Con() {
    this.x = 1;

    this.f1 = function() {
        ++ this.x;
        --this.x;
    }
}

o = null;
if (typeof o === "object") {
    console.log("o is null");
}
o = {};
o["C"] = Con;
var c = new Con();
c["f1"]();
console.log(c.x);

c = new o.C;
c.f1();
console.log(c.x);

x = "global";

function bar(s) {
    console.log(s);
}

function foo() {
    var x = "local";
    var e = eval;
    eval = e;
    for (var i=0; i<3; i++)
        eval("if (x+1 >0) console.log(x);")
}

foo();

function f3(a, b, c) {
    var ret = null;
    try {
        ret = c.f1(), a && b || c? a : b;
        throw new Error("Test");
    } catch(e) {
        console.log("f1 is undefined");
    } finally {
        return ret;
    }
    try {
        throw new Error("Test2");
    } catch(e) {
        console.log(e);
    }
}

f3 (true, false, true);

var x = "1";

switch(x) {
    case "2":
    case "3":
        console.log("x > 1");
        break;
    case "1":
        console.log("x === 1");
        break;
    default:
        console.log("x not in {1, 2 , 3}");
}
