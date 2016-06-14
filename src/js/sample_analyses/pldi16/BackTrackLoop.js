// do not remove the following comment
// JALANGI DO NOT INSTRUMENT

/**
 * @author  Koushik Sen
 *
 */
(function (sandbox) {
    function MyAnalysis() {
        this.functionExit = function (iid, returnVal, wrappedExceptionVal) {
            return {returnVal: returnVal, wrappedExceptionVal: wrappedExceptionVal, isBacktrack: returnVal?true:false};
        };
    }
    sandbox.analysis = new MyAnalysis();
}(J$));

/*
 node src/js/commands/jalangi.js --inlineIID --inlineSource --analysis src/js/sample_analyses/pldi16/BackTrackLoop.js tests/pldi16/BackTrackLoopTest.js
 */
