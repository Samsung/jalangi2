// do not remove the following comment
// JALANGI DO NOT INSTRUMENT

/**
 * @author  Koushik Sen
 *
 */
(function (sandbox) {
    function MyAnalysis() {

        this.invokeFunPre = function (iid, f, base, args, isConstructor, isMethod, functionIid, functionSid) {
            if (typeof evilFunction === "function" && f === evilFunction) {
                return {f: f, base: base, args: args, skip: true};
            }
        };
    }

    sandbox.analysis = new MyAnalysis();
}(J$));

/*
 node src/js/commands/jalangi.js --inlineIID --inlineSource --analysis src/js/sample_analyses/pldi16/SkipFunction.js tests/pldi16/SkipFunctionTest.js
 */

