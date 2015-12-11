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

(function (sandbox) {
    require('./Frames.js');

    function MyAnalysis() {

        var frames = new sandbox.Frames();
        sandbox.frames = frames;


        this.literal = function (iid, val, hasGetterSetter) {

            if (typeof val === 'function') {
                frames.defineFunction(val);
            }

        };

        this.declare = function (iid, name, val, isArgument, argumentIndex, isCatchParam) {
            frames.initialize(name);
        };

        this.functionEnter = function (iid, f, dis, args) {
            frames.functionEnter(f);
        };


        this.functionExit = function (iid, returnVal, wrappedExceptionVal) {
            frames.functionReturn();

        };


        this.scriptEnter = function (iid, instrumentedFileName, originalFileName) {
            frames.scriptEnter();

        };

        this.scriptExit = function (iid, wrappedExceptionVal) {
            frames.scriptReturn();

        };


        this.instrumentCodePre = function (iid, code) {
            frames.evalBegin();

        };


        this.instrumentCode = function (iid, newCode, newAst) {
            frames.evalEnd();


        };

    }

    sandbox.analysis = new MyAnalysis();
})(J$);




