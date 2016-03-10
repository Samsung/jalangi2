
(function (sandbox) {
    function MyAnalysis() {
        var stringMap = {};
        var stringList = [];
        var stringCount = 0;
        var lastiid = -1;
        var lastsid = -1;
        var HOP = sandbox.Constants.HOP;

        var traceWriter = new sandbox.TraceWriter("trace.log")
        //var logs = [];

        function logEvent(str) {
            traceWriter.logToFile(str+"\n");
            //@todo dump and clear the logs array once its size exceeds some constant, say 1024
        }

        function getValue(v) {
            var type = typeof v;
            if ((type === 'object' || type === 'function') && v !== null) {
                var shadowObj = sandbox.smemory.getShadowObjectOfObject(v);
                return sandbox.smemory.getIDFromShadowObjectOrFrame(shadowObj);
            } else if (type === 'string') {
                return getStringIndex(v);
            } else {
                return v;
            }
        }

        function getType(v) {
            var type = typeof v;
            if ((type === 'object' || type === 'function') && v !== null) {
                return 'O';
            } else if (type === 'string') {
                return 'S';
            } else {
                return 'P';
            }
        }

        function getStringIndex(str) {
            if (typeof str === 'number' && str >= 0) {
                return str;
            }
            str = str + "";
            if (HOP(stringMap,str)) {
                return stringMap[str];
            } else {
                stringCount++;
                stringMap[str] = stringCount;
                stringList.push(str);
                return -stringCount;
            }
        }


        this.invokeFunPre = function (iid, f, base, args, isConstructor, isMethod, functionIid) {
            lastiid = iid;
            lastsid = sandbox.sid;
        };


        this.getFieldPre = function (iid, base, offset, isComputed, isOpAssign, isMethodCall) {
            lastiid = iid;
            lastsid = sandbox.sid;
        };

        this.getField = function (iid, base, offset, val, isComputed, isOpAssign, isMethodCall) {
            var so = sandbox.smemory.getShadowObjectOfObject(base);
            var objectId = so?sandbox.smemory.getIDFromShadowObjectOrFrame(so):0;
            var shadowObj = sandbox.smemory.getShadowObject(base, offset, true);
            var ownerId = shadowObj.owner ? sandbox.smemory.getIDFromShadowObjectOrFrame(shadowObj.owner) : 0;
            if (shadowObj.isProperty) {
                logEvent('G,' + sandbox.sid + "," + iid + "," + objectId + "," + ownerId + "," + getStringIndex(offset) + "," + getValue(val) + "," + getType(val));
            }
        };

        this.putFieldPre = function (iid, base, offset, val, isComputed, isOpAssign) {
            lastiid = iid;
            lastsid = sandbox.sid;
            var objectId = sandbox.smemory.getIDFromShadowObjectOrFrame(sandbox.smemory.getShadowObjectOfObject(base));
            var shadowObj = sandbox.smemory.getShadowObject(base, offset, false);
            var ownerId = shadowObj.owner ? sandbox.smemory.getIDFromShadowObjectOrFrame(shadowObj.owner) : 0;
            if (shadowObj.isProperty) {
                logEvent('P,' + sandbox.sid + "," + iid + "," + objectId + "," + ownerId + "," + getStringIndex(offset) + "," + getValue(val) + "," + getType(val));
            }
        };

        this.read = function (iid, name, val, isGlobal, isScriptLocal) {
            var shadowFrame = sandbox.smemory.getShadowFrame(name);
            logEvent('R,' + sandbox.sid + "," + iid + "," + sandbox.smemory.getIDFromShadowObjectOrFrame(shadowFrame) + "," + getStringIndex(name) + "," + getValue(val) + "," + getType(val));
        };

        this.write = function (iid, name, val, lhs, isGlobal, isScriptLocal) {
            var shadowFrame = sandbox.smemory.getShadowFrame(name);
            logEvent('W,' + sandbox.sid + "," + iid + "," + sandbox.smemory.getIDFromShadowObjectOrFrame(shadowFrame) + "," + getStringIndex(name) + "," + getValue(val) + "," + getType(val));
        };

        this.functionEnter = function (iid, f, dis, args) {
            var shadowFrame = sandbox.smemory.getShadowFrame('this');
            logEvent('C,'+lastsid+","+lastiid+","+getValue(f)+","+sandbox.smemory.getIDFromShadowObjectOrFrame(shadowFrame));
        };

        this.functionExit = function (iid, returnVal, wrappedExceptionVal) {
            logEvent('E,' + sandbox.sid + "," + iid + "," + getValue(returnVal) + "," + getType(returnVal));
        };

        this.endExecution = function () {
            traceWriter.stopTracing();
            var tw = new sandbox.TraceWriter("strings.json");
            tw.logToFile(JSON.stringify(stringList)+"\n");
            tw.stopTracing();
            tw = new sandbox.TraceWriter("smap.json");
            tw.logToFile(JSON.stringify(sandbox.smap)+"\n");
            tw.stopTracing();
        };

        this.runInstrumentedFunctionBody = function (iid, f, functionIid) {
            return false;
        };

        /**
         * onReady is useful if your analysis is running on node.js (i.e., via the direct.js or jalangi.js commands)
         * and needs to complete some asynchronous initialization before the instrumented program starts.  In such a
         * case, once the initialization is complete, invoke the cb function to start execution of the instrumented
         * program.
         *
         * Note that this callback is not useful in the browser, as Jalangi has no control over when the
         * instrumented program runs there.
         * @param cb
         */
        this.onReady = function (cb) {
            cb();
        };
    }

    sandbox.analysis = new MyAnalysis();
})(J$);


// node src/js/commands/jalangi.js --inlineIID --inlineSource --analysis src/js/sample_analyses/ChainedAnalyses.js --analysis src/js/runtime/SMemory.js --analysis src/js/sample_analyses/datatraces/TraceWriter.js --analysis src/js/sample_analyses/datatraces/LogData.js tests/octane/deltablue.js

