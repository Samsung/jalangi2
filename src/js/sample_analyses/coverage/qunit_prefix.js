if (typeof QUnit !== "undefined") {
    QUnit.testStart(function( details ) {
        J$.analysis.beginExecution();
    });

    QUnit.testDone(function( details ) {
        J$.analysis.endExecution();
    });
}

