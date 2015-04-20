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
// do not remove the following comment
// JALANGI DO NOT INSTRUMENT
if (typeof J$ === 'undefined') {
    J$ = {};
}

(function (sandbox) {
    if (typeof sandbox.Config !== 'undefined') {
        return;
    }

    var Config = sandbox.Config = {};

    Config.DEBUG = false;
    Config.WARN = false;
    Config.SERIOUS_WARN = false;
// make MAX_BUF_SIZE slightly less than 2^16, to allow over low-level overheads
    Config.MAX_BUF_SIZE = 64000;
    Config.LOG_ALL_READS_AND_BRANCHES = false;

    //**********************************************************
    //  Functions for selective instrumentation of operations
    //**********************************************************
    // In the following functions
    // return true in a function, if you want the ast node (passed as the second argument) to be instrumented
    // ast node gets instrumented if you do not define the corresponding function
    Config.ENABLE_SAMPLING = false;
//    Config.INSTR_INIT = function(name, ast) { return false; };
//    Config.INSTR_READ = function(name, ast) { return false; };
//    Config.INSTR_WRITE = function(name, ast) { return true; };
//    Config.INSTR_GETFIELD = function(offset, ast) { return true; }; // offset is null if the property is computed
//    Config.INSTR_PUTFIELD = function(offset, ast) { return true; }; // offset is null if the property is computed
//    Config.INSTR_BINARY = function(operator, ast) { return true; };
//    Config.INSTR_PROPERTY_BINARY_ASSIGNMENT = function(operator, offset, ast) { return true; }; // a.x += e or a[e1] += e2
//    Config.INSTR_UNARY = function(operator, ast) { return true; };
//    Config.INSTR_LITERAL = function(literal, ast) { return true;}; // literal gets some dummy value if the type is object, function, or array
//    Config.INSTR_CONDITIONAL = function(type, ast) { return true; }; // type could be "&&", "||", "switch", "other"
//    Config.INSTR_TRY_CATCH_ARGUMENTS = function(ast) {return false; }; // wrap function and script bodies with try catch block and use arguments in J$.Fe.  DO NOT USE THIS.
//    Config.INSTR_END_EXPRESSION = function(ast) {return true; }; // top-level expression marker
}(J$));
