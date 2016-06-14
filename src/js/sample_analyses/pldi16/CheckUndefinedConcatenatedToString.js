// do not remove the following comment
// JALANGI DO NOT INSTRUMENT

/**
 * @author  Koushik Sen
 *
 */
(function (sandbox) {
    function MyAnalysis() {
        var logs = [];

        this.binary = function (iid, op, left, right, result, isOpAssign, isSwitchCaseComparison, isComputed) {
            if (op === '+' && typeof result === 'string' && (left === undefined || right === undefined))
                logs.push(J$.getGlobalIID(iid));
        };

        this.endExecution = function () {
            for (var i = 0; i < logs.length; i++)
                sandbox.log("Concatenated undefined with string at  " + J$.iidToLocation(logs[i]));
        };

    }


    sandbox.analysis = new MyAnalysis();
}(J$));


/*
 node src/js/commands/jalangi.js --inlineIID --inlineSource --analysis src/js/sample_analyses/pldi16/CheckUndefinedConcatenatedToString.js tests/pldi16/CheckUndefinedConcatenatedToStringTest.js
 node src/js/commands/esnstrument_cli.js --inlineIID --inlineSource --analysis src/js/sample_analyses/pldi16/CheckUndefinedConcatenatedToString.js --out /tmp/pldi16/CheckUndefinedConcatenatedToStringTest.html  tests/pldi16/CheckUndefinedConcatenatedToStringTest.html
 node src/js/commands/esnstrument_cli.js --inlineIID --inlineSource --analysis src/js/sample_analyses/pldi16/CheckUndefinedConcatenatedToString.js --out /tmp/pldi16/CheckUndefinedConcatenatedToStringTest.js  tests/pldi16/CheckUndefinedConcatenatedToStringTest.js
 open file:///tmp/pldi16/CheckUndefinedConcatenatedToStringTest.html
 */