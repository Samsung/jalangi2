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

    var idSequence = 0;
    var prefixes = window["J$prefix"];
    if (!prefixes) {
        prefixes = [[]];
    }

    var events;
    var idxEvents;
    var idxPrefix;
    var prefix;
    var loop;

    test("model checking", loop = function(){
        idxEvents = 0;
        prefix = prefixes[idSequence];
        newOpen();
    })


    function newOpen() {
        S.open("../tizen/annex/index_jalangi_.html", afterOpen);
        idxPrefix = 0;
        events = [];
        for (var i=0; i<8; i++) {
            for (var j=0; j<8; j++) {
                events.push("#l"+i+j);
            }
        }
        if (idxEvents >= events.length) {
            done();
        }
    }

    function afterOpen() {
        S('#open1').visible().click(executePrefix);
    }

    function executePrefix() {
        if (idxPrefix < prefix.length) {
            idxPrefix++;
            S(events[prefix[idxPrefix-1]]).visible().click(waitForEventEnd);
        } else {
            clickAnEvent();
        }
    }

    function waitForEventEnd() {
        setTimeout(executePrefix, 2000);
    }

    function clickAnEvent() {
        S.win.J$.recordReset(prefix.concat([idxEvents]));
        S(events[idxEvents]).visible().click(waitForEnd);

    }

    function waitForEnd() {
        setTimeout(logEvents, 2000)
    }

    function logEvents() {
        S.win.J$.onflush(checkLoop);
    }

    function checkLoop() {
        idxEvents++;
        if (idxEvents < events.length) {
            newOpen();
        } else {
            done();
        }
    }

    function done() {
        idSequence++;
        if (idSequence < prefixes.length) {
            loop();
        } else {
            console.log("done with testing");
        }
    }
})
