/*
 * Copyright (c) 2014 Samsung Electronics Co., Ltd.
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
    function ChainedAnalyses() {

        function clientAnalysisException(e) {
            console.error("analysis exception!!!");
            console.error(e.stack);
            if (typeof process !== 'undefined' && process.exit) {
                process.exit(1);
            } else {
                throw e;
            }
        }

        var funList = ["_return", "_throw", "_with",
            "binaryPre", "binary", "conditional",
            "declare", "endExecution", "endExpression",
            "forinObject", "functionEnter", "functionExit",
            "getFieldPre", "getField", "instrumentCodePre",
            "instrumentCode", "invokeFunPre", "invokeFun",
            "literal", "onReady","putFieldPre",
            "putField", "read", "runInstrumentedFunctionBody",
            "scriptEnter", "scriptExit",  "unaryPre",
            "unary", "write"];

        this.globals = {};

        this.addAnalysis = function (analysis) {
            var self = this, tmp, length = funList.length;

            for (var i = 0; i < length; i++) {
                var field = funList[i];
                if (tmp = analysis[field]) {
                    var fun = self[field];
                    if (!fun) {
                        fun = self[field] = function () {
                            try {
                                var ret1;
                                var thisFun = arguments.callee;
                                var len = thisFun.afs.length;
                                var args = [];
                                for(var x=0;x<arguments.length;x++) {
                                    args[x] = arguments[x];
                                }
                                for (var i = 0; i < len; i++) {
                                    ret1 = thisFun.afs[i].apply(thisFun.afThis[i], args);
                                }
                                return ret1;
                            } catch (e) {
                                clientAnalysisException(e);
                            }

                        };
                        fun.afs = [];
                        fun.afThis = [];
                        fun.afName = field;
                    }
                    fun.afs.push(tmp);
                    fun.afThis.push(analysis);
                }
            }
        };
    }

    var thisAnalysis = new ChainedAnalyses();
    Object.defineProperty(sandbox, 'analysis', {
        get:function () {
            return thisAnalysis;
        },
        set:function (a) {
            thisAnalysis.addAnalysis(a);
        }
    });

    if (sandbox.Constants.isBrowser) {
        window.addEventListener('keydown', function (e) {
            // keyboard shortcut is Alt-Shift-T for now
            if (e.altKey && e.shiftKey && e.keyCode === 84) {
                sandbox.analysis.endExecution();
            }
        });
    }

}(J$));
