// do not remove the following comment
// JALANGI DO NOT INSTRUMENT

/**
 * @author  Koushik Sen
 *
 */

(function (sandbox) {
    function MyAnalysis() {

        this.binaryPre = function (iid, op, left, right, isOpAssign, isSwitchCaseComparison, isComputed) {
            if (op === "*")
                return {op: op, left: left, right: right, skip: true};
        };

        this.binary = function (iid, op, left, right, result, isOpAssign, isSwitchCaseComparison, isComputed) {
            if (op === "*")
                return {result: left+right};
        };

    }

    sandbox.analysis = new MyAnalysis();
}(J$));

/*
 node src/js/commands/jalangi.js --inlineIID --inlineSource --analysis src/js/sample_analyses/pldi16/ChangeSematicsOfMult.js tests/pldi16/ChangeSematicsOfMultTest.js
 */

