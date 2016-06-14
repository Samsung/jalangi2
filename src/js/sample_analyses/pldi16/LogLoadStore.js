// do not remove the following comment
// JALANGI DO NOT INSTRUMENT

/**
 * @author  Koushik Sen
 *
 */

(function (sandbox) {

    if (sandbox.Constants.isBrowser) {
        sandbox.Results = {};
    }

    function MyAnalysis() {
        var indentationCount = 0;
        var cacheCount = 0;
        var cacheIndentStr = "";

        var logs = [];

        function log(str) {
            if (cacheCount !== indentationCount) {
                cacheIndentStr = "";
                for (var i = 0; i < indentationCount; i++) {
                    cacheIndentStr += "    ";
                }
                cacheCount = indentationCount;
            }
            if (sandbox.Results) {
                logs.push("<li>" + cacheIndentStr.replace(/ /g, '\u00a0') + str + " </li>");
            } else {
                console.log(cacheIndentStr + str)
            }
        }

        this.invokeFunPre = function (iid, f, base, args, isConstructor, isMethod, functionIid, functionSid) {
            indentationCount++;
        };

        this.invokeFun = function (iid, f, base, args, result, isConstructor, isMethod, functionIid, functionSid) {
            indentationCount--;
        };

        this.getFieldPre = function (iid, base, offset, isComputed, isOpAssign, isMethodCall) {
            var actualObjectId = sandbox.smemory.getIDFromShadowObjectOrFrame(sandbox.smemory.getShadowObject(base, offset, true).owner);
            var ret = "Load of object(id=" + actualObjectId + ")." + offset;
            ret += " at " + J$.iidToLocation(J$.sid, iid);
            log(ret);
        };

        this.putFieldPre = function (iid, base, offset, val, isComputed, isOpAssign) {
            var actualObjectId = sandbox.smemory.getIDFromShadowObjectOrFrame(sandbox.smemory.getShadowObject(base, offset, false).owner);
            var ret = "Store of object(id=" + actualObjectId + ")." + offset;
            ret += ") at " + J$.iidToLocation(J$.sid, iid);
            log(ret);
        };

        this.read = function (iid, name, val, isGlobal, isScriptLocal) {
            var frameId = sandbox.smemory.getIDFromShadowObjectOrFrame(sandbox.smemory.getShadowFrame(name));
            var ret = "Load of frame(id=" + frameId + ")." + name;
            ret += " at " + J$.iidToLocation(J$.sid, iid);
            log(ret);
            return {result: val};
        };

        this.write = function (iid, name, val, lhs, isGlobal, isScriptLocal) {
            var frameId = sandbox.smemory.getIDFromShadowObjectOrFrame(sandbox.smemory.getShadowFrame(name));
            var ret = "Store of frame(id=" + frameId + ")." + name;
            ret += " at " + J$.iidToLocation(J$.sid, iid);
            log(ret);
            return {result: val};
        };

        this.endExecution = function () {
            if (sandbox.Results) {
                for (var i = 0; i < logs.length; i++) {
                    sandbox.log(logs[i]);
                }
            }
        };
    }

    sandbox.analysis = new MyAnalysis();

}(J$));

/*
 node src/js/commands/jalangi.js --inlineIID --inlineSource --analysis src/js/sample_analyses/ChainedAnalyses.js --analysis src/js/runtime/SMemory.js --analysis src/js/sample_analyses/pldi16/LogLoadStore.js tests/pldi16/CountObjectsPerAllocationSiteTest.js
 node src/js/commands/esnstrument_cli.js --inlineIID --inlineSource --analysis src/js/sample_analyses/ChainedAnalyses.js --analysis src/js/runtime/SMemory.js --analysis src/js/sample_analyses/pldi16/LogLoadStore.js --out /tmp/pldi16/CountObjectsPerAllocationSiteTest.html  tests/pldi16/CountObjectsPerAllocationSiteTest.html
 node src/js/commands/esnstrument_cli.js --inlineIID --inlineSource --analysis src/js/sample_analyses/ChainedAnalyses.js --analysis src/js/runtime/SMemory.js --analysis src/js/sample_analyses/pldi16/LogLoadStore.js --out /tmp/pldi16/CountObjectsPerAllocationSiteTest.js  tests/pldi16/CountObjectsPerAllocationSiteTest.js
 open file:///tmp/pldi16/CountObjectsPerAllocationSiteTest.html
 */


