/**
 * Created by marija on 26.10.15.
 */
/*
 * Copyright 2014 Samsung Information Systems America, Inc.
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

// do not remove the following comment
// JALANGI DO NOT INSTRUMENT

/**
 * @file A template for writing a Jalangi 2 analysis
 * @author  Koushik Sen
 *
 */

(function (sandbox) {
    require('./Frames.js');

    function MyAnalysis() {

        var smemory = new sandbox.SMemory();
        sandbox.smemory = smemory;


        this.literal = function (iid, val, hasGetterSetter) {

            if (typeof val === 'function') {
                smemory.defineFunction(val);
            }

        };

        this.declare = function (iid, name, val, isArgument, argumentIndex, isCatchParam) {
            smemory.initialize(name);
        };

        this.functionEnter = function (iid, f, dis, args) {
            smemory.functionEnter(f);
        };


        this.functionExit = function (iid, returnVal, wrappedExceptionVal) {
            smemory.functionReturn();

        };


        this.scriptEnter = function (iid, instrumentedFileName, originalFileName) {
            smemory.scriptEnter();

        };

        this.scriptExit = function (iid, wrappedExceptionVal) {
            smemory.scriptReturn();

        };


        this.instrumentCodePre = function (iid, code) {
            smemory.evalBegin();

        };


        this.instrumentCode = function (iid, newCode, newAst) {
            smemory.evalEnd();


        };

    }

    sandbox.analysis = new MyAnalysis();
})(J$);




