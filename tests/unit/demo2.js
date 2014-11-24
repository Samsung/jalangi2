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

function isValidQuery (str)
{

    console.log(str);
// (1) check that str contains "/" followed by anything not
// containing "/" and containing "?q=..."
    var lastSlash = str.lastIndexOf('/');
    if (lastSlash < 0){
        return false;
    }
    var rest = str.substring(lastSlash + 1);

    if (!(RegExp('\\\?q=[a-zA-Z]+')).test(rest)){
        return false;
    }


// (2) Check that str starts with "http://"
    if (str.indexOf("http://") !== 0){
        return false;
    }


// (3) Take the string between "http://" and the last "/".
// if it starts with "www." strip the "www." off
    var t = str.substring("http://".length,lastSlash);
    if (t.indexOf("www.")===0){
        t = t.substring("www.".length);
    }


// (4) Check that after stripping we have either "live.com"
// or "google.com"
    if (t !== "google.com" && t !== "live.com"){
        console.log("False 4");
        return false;
    }

//    if (false) {
//        console.log("Unreachable");
//    }


    console.log("Survived all tests");
// s survived all checks
    return true;
}


require('../../src/js/analyses/concolic/jtest');
test(isValidQuery, "");


