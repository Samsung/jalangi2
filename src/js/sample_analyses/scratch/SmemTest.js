(function (sandbox) {
    function MyAnalysis() {
        this.getFieldPre = function (iid, base, offset, isComputed, isOpAssign, isMethodCall) {
            //access shadow memory
            var shadowObj = sandbox.smemory.getShadowObject(base, offset, true);
            console.log("GET_FIELD" + JSON.stringify(shadowObj.owner));
        };

        this.putFieldPre = function (iid, base, offset, val, isComputed, isOpAssign) {
            //access shadow memory
            var shadowObj = sandbox.smemory.getShadowObject(base, offset, false);
            //setting newProp
            shadowObj.owner.newProp = "foo";

            console.log("PUT_FIELD" + JSON.stringify(shadowObj.owner));
        };
    }

    sandbox.analysis = new MyAnalysis();
})(J$);



