(function (sandbox) {
    function MyAnalysis() {
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



