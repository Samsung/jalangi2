(function (sandbox) {
    function MyAnalysis () {
        function writeFlags(isGlobal, isScriptLocal) {
            if (isGlobal && isScriptLocal) { return "global and script-local?!" }
            else if (isGlobal) { return "global" }
            else if (isScriptLocal) { return "script-local" }
            else { return "local" }
        }
        this.read = function(iid, name, val, isGlobal, isScriptLocal){
            console.log("Reading from " + name + " (" + writeFlags(isGlobal, isScriptLocal) + ")")
        };

        this.write = function(iid, name, val, lhs, isGlobal, isScriptLocal) {
            console.log("Writing to " + name + " (" + writeFlags(isGlobal, isScriptLocal) + ")")
        };
    }
    sandbox.analysis = new MyAnalysis();
})(J$);
