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

zvar = 1;
var xvar = 2;

zvar = zvar + 1;
xvar = xvar + 1;

function f1(avar ) {
    var yvar = 3;
    yvar = yvar + 1;
    zvar = zvar + 1;
    xvar = xvar + 1;
    avar  = avar  + 1;

    function f2(bvar) {
        var wvar = 4;
        wvar = wvar + 1;
        yvar = yvar + 1;
        zvar = zvar + 1;
        xvar = xvar + 1;
        avar  = avar  + 1;
        bvar = bvar + 1;

        eval("xvar = 0; yvar = 0; zvar = 0; wvar = 0; avar  = 0; bvar = 0; console.log('eval');");

//        console.log(xvar);
//        console.log(yvar);
//        console.log(zvar);
//        console.log(wvar);
//        console.log(avar );
//        console.log(bvar);
    }

    function f3(bvar) {
        var tvar = 4;
        tvar = tvar + 1;
        yvar = yvar + 1;
        zvar = zvar + 1;
        xvar = xvar + 1;
        avar  = avar  + 1;
        bvar = bvar + 1;

        console.log(xvar);
        console.log(yvar);
        console.log(zvar);
        console.log(tvar);
        console.log(avar );
        console.log(bvar);
    }

    return [f2,f3];
}

var fs = f1(5);
fs[0](6);
fs[1](7);

