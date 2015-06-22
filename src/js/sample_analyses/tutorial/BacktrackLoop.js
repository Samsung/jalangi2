(function (sandbox) {
    function MyAnalysis() {
        this.functionExit = function (iid, rv, ex) {
            return {returnVal: rv, wrappedExceptionVal: ex, isBacktrack: rv?true:false};
        };
    }
    sandbox.analysis = new MyAnalysis();
}(J$));
