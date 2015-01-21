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

var inst = require('./../src/js/commands/instrument');
var assert = require('assert');
var fs = require('fs');
var path = require('path');
var temp = require('temp');


describe('instrument dir tests', function () {
    it('should handle extra app scripts', function (done) {
        var options = {
            inputFiles: ["tests/html/unitApps/app1"],
            outputDir: temp.mkdirSync(),
            // the exact script doesn't matter for this test
            extra_app_scripts: "tests/unit/date-conversion.js"
        };
        inst.instrument(options, function (err) {
            assert(!err, err);
            assert(fs.existsSync(path.join(options.outputDir, "app1", inst.EXTRA_SCRIPTS_DIR, "date-conversion.js")));
            assert(!fs.existsSync(path.join(options.inputFiles[0], inst.EXTRA_SCRIPTS_DIR)));
            var html = String(fs.readFileSync(path.join(options.outputDir, "app1", "index.html")));
            assert(html.indexOf("<script src=\"__jalangi_extra/date-conversion.js\">") !== -1);
            done();
        });

    });
    it('should handle multiple extra app scripts', function (done) {
        var options = {
            inputFiles: ["tests/html/unitApps/app1"],
            outputDir: temp.mkdirSync(),
            // the exact script doesn't matter for this test
            extra_app_scripts:
                "tests/unit/date-conversion.js" + path.delimiter +
                "tests/unit/gettersetter.js"
        };
        inst.instrument(options, function (err) {
            assert(!err, err);
            assert(fs.existsSync(path.join(options.outputDir, "app1", inst.EXTRA_SCRIPTS_DIR, "date-conversion.js")));
            assert(fs.existsSync(path.join(options.outputDir, "app1", inst.EXTRA_SCRIPTS_DIR, "gettersetter.js")));
            assert(!fs.existsSync(path.join(options.inputFiles[0], inst.EXTRA_SCRIPTS_DIR)));
            var html = String(fs.readFileSync(path.join(options.outputDir, "app1", "index.html")));
            assert(html.indexOf("<script src=\"__jalangi_extra/date-conversion.js\">") !== -1);
            assert(html.indexOf("<script src=\"__jalangi_extra/gettersetter.js\">") !== -1);
            done();
        });

    });
    it('should handle copy_runtime and analysis options together', function (done) {
        var options = {
            inputFiles: ["tests/html/unitApps/app1"],
            outputDir: temp.mkdirSync(),
            // the exact script doesn't matter
            analysis: ["tests/unit/date-conversion.js"],
            copy_runtime: true
        };
        inst.instrument(options, function (err) {
            assert(!err, err);
            assert(fs.existsSync(path.join(options.outputDir, "app1", inst.JALANGI_RUNTIME_DIR, "date-conversion.js")));
            var html = String(fs.readFileSync(path.join(options.outputDir, "app1", "index.html")));
            assert(html.indexOf("<script src=\"/" + inst.JALANGI_RUNTIME_DIR + "/date-conversion.js\">") !== -1);
            done();
        });
    });
    it('should handle multiple script files', function (done) {
        var options = {
            inputFiles: ["tests/unit/date-conversion.js", "tests/unit/gettersetter.js"],
            outputDir: temp.mkdirSync()
        };
        inst.instrument(options, function (err) {
            assert(!err, err);
            assert(fs.existsSync(path.join(options.outputDir, "date-conversion.js")));
            assert(fs.existsSync(path.join(options.outputDir, "date-conversion_orig_.js")));
            assert(fs.existsSync(path.join(options.outputDir, "gettersetter.js")));
            assert(fs.existsSync(path.join(options.outputDir, "gettersetter_orig_.js")));
            done();
        });
    });
    it('should handle only_include option', function (done) {
        var options = {
            inputFiles: ["tests/html/unitApps/app2"],
            outputDir: temp.mkdirSync(),
            only_include: "src1" + path.delimiter + "src3"
        };
        inst.instrument(options, function (err) {
            assert(!err, err);
            assert(fs.existsSync(path.join(options.outputDir, "app2", "src1", "foo_orig_.js")));
            assert(fs.existsSync(path.join(options.outputDir, "app2", "src3", "baz_orig_.js")));
            assert(!fs.existsSync(path.join(options.outputDir, "app2", "src2", "bar_orig_.js")));
            done();
        });
    });
    it('should handle initParam option', function (done) {
        var options = {
            inputFiles: ["tests/html/unitApps/app1"],
            outputDir: temp.mkdirSync(),
            // the exact script doesn't matter
            analysis: ["tests/unit/date-conversion.js"],
            initParam: ["fizz:buzz","bizz:bazz"]
        };
        inst.instrument(options, function (err) {
            assert(!err, err);
            var html = String(fs.readFileSync(path.join(options.outputDir, "app1", "index.html")));
            assert(html.indexOf('<script>J$.initParams = {"fizz":"buzz","bizz":"bazz"};</script>') !== -1);
            done();
        });
    });
});