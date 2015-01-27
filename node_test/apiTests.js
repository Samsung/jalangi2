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

// Author: Manu Sridharan

/*global describe */
/*global it */
var jalangi = require('./../src/js/utils/api');
var fs = require('fs');
var assert = require('assert');

describe('api tests', function () {
    it('should do basic instrumentation', function () {
        var testCode = "var x = 3;";
        var options = {
            inputFileName: 'input.js',
            outputFile: 'test.js'
        };
        var instResult = jalangi.instrumentString(testCode, options);
        //console.log(instResult.code);
        //console.log(instResult.sourceMapObject);
        // couple of random asserts
        assert.deepEqual(instResult.sourceMapObject['9'],[1,9,1,10]);
        assert.deepEqual(instResult.sourceMapObject['25'],[1,9,1,10]);
    });
    it('should inline source map', function () {
        var testCode = "var x = 3;";
        var options = {
            inputFileName: 'input.js',
            outputFile: 'test.js',
            inlineSourceMap: true
        };
        var instResult = jalangi.instrumentString(testCode, options);
        // couple of random asserts
        assert.deepEqual(instResult.sourceMapObject['9'],[1,9,1,10]);
        assert.deepEqual(instResult.sourceMapObject['25'],[1,9,1,10]);
        assert(instResult.code.indexOf('J$.iids = {"9":[1,9,1,10],"17":[1,9,1,10]') !== -1);
    });
    it('should run ast handler', function () {
        var testCode = "var x = 3;";
        var astHandler = function(ast) {
            return { "itworks": true };
        }
        var options = {
            inputFileName: 'input.js',
            outputFile: 'test.js',
            inlineSourceMap: true,
            astHandler: astHandler
        };
        var instResult = jalangi.instrumentString(testCode, options);
        assert(instResult.code.indexOf('J$.ast_info = {"itworks":true};') === 0);
    });

});