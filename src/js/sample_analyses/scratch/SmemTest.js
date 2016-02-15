(function (sandbox) {
    function MyAnalysis() {

        function getValue(v) {
            var type = typeof v;
            if ((type === 'object' || type ==='function') && v!== null) {
                var shadowObj = sandbox.smemory.getShadowObjectOfObject(v);
                return sandbox.smemory.getIDFromShadowObjectOrFrame(shadowObj);
            } else {
                return v;
            }
        }

        this.literal = function (iid, val, hasGetterSetter) {
            if (typeof val === 'function') {
                console.log("Function id:" +getValue(val));
            }
        };

        this.getFieldPre = function (iid, base, offset, isComputed, isOpAssign, isMethodCall) {
            //access shadow memory
            var shadowObj = sandbox.smemory.getShadowObject(base, offset, true);
            console.log("GET_FIELD "+sandbox.smemory.getIDFromShadowObjectOrFrame(shadowObj.owner)+"." + offset +" at " + J$.iidToLocation(J$.sid, iid));
        };

        this.putFieldPre = function (iid, base, offset, val, isComputed, isOpAssign) {
            //access shadow memory
            var shadowObj = sandbox.smemory.getShadowObject(base, offset, false);
            console.log("GET_FIELD "+sandbox.smemory.getIDFromShadowObjectOrFrame(shadowObj.owner)+"." + offset +" at " + J$.iidToLocation(J$.sid, iid));
        };

        this.read = function (iid, name, val, isGlobal, isScriptLocal) {
            var shadowObj = sandbox.smemory.getShadowFrame(name);
            console.log("READ "+sandbox.smemory.getIDFromShadowObjectOrFrame(shadowObj)+"." + name +" at " + J$.iidToLocation(J$.sid, iid));
        };

        this.write = function (iid, name, val, lhs, isGlobal, isScriptLocal) {
            var shadowObj = sandbox.smemory.getShadowFrame(name);
            console.log("WRITE "+sandbox.smemory.getIDFromShadowObjectOrFrame(shadowObj)+"." + name +" at " + J$.iidToLocation(J$.sid, iid));
        };

    }

    sandbox.analysis = new MyAnalysis();
})(J$);



// node src/js/commands/jalangi.js --inlineIID --inlineSource --analysis src/js/sample_analyses/ChainedAnalyses.js --analysis src/js/runtime/SMemory.js --analysis src/js/sample_analyses/scratch/SmemTest.js tests/octane/deltablue.js
