/*
 * Copyright (C) 2013 Samsung Electronics Corporation. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided the following conditions
 * are met:
 *
 * 1.  Redistributions of source code must retain the above copyright
 *     notice, this list of conditions and the following disclaimer.
 *
 * 2.  Redistributions in binary form must reproduce the above copyright
 *     notice, this list of conditions and the following disclaimer in the
 *     documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY SAMSUNG ELECTRONICS CORPORATION AND ITS
 * CONTRIBUTORS "AS IS", AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING
 * BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS
 * FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL SAMSUNG
 * ELECTRONICS CORPORATION OR ITS CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
 * INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES(INCLUDING
 * BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS, OR BUSINESS INTERRUPTION), HOWEVER CAUSED AND ON ANY THEORY
 * OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT(INCLUDING
 * NEGLIGENCE OR OTHERWISE ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
 * EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

// Author: Koushik Sen

steal("funcunit").then(function(){
    module("APPNAME", {
        setup: function() {
        }
    })

    test("model checker", function(){
        newOpen();
    })

    var events;
    var idxTest = 0;
    var idxPrefix;

    function newOpen() {
        idxPrefix = 0;
        S.open("../tizen/calculator/index_jalangi_.html", function() {

            events = [];

            var functionButtonClassNames = ["buttonblackshort", "buttonyellow", "buttonblack", "buttonblue", "buttonwhite"];
            for (var i = 0; i < functionButtonClassNames.length; ++i) {
                S('.'+functionButtonClassNames[i]).each(function() {
                    events.push("#"+this.id);
                });
            }
            events.push("#buttonclear");
            events.push("#buttondelete");
            events.push("#buttondot");
            events.push("#buttonplusminus");
            events.push("#buttonequal");
            console.log('['+events.join(',')+']');

            if (idxTest >= 1000) {
                done();
            } else {
                idxTest++;
                idxPrefix = 0;
                executePrefix();
            }
        });
    }

    function executePrefix() {
        if (idxPrefix < 10) {
            idxPrefix++;
            S(events[Math.floor(Math.random()*events.length)]).exists().click(waitForEventEnd);
        } else {
            logEvents();
        }
    }

    function waitForEventEnd() {
        setTimeout(executePrefix, 100);
    }


    function logEvents() {
        S.win.J$.onflush(checkLoop);
    }

    function checkLoop() {
        if (idxTest < 1000) {
            newOpen();
        } else {
            done();
        }
    }

    function done() {
        S.win.close();
        console.log("done with testing");
        window.close();
    }
})
