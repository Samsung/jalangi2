// Author: Koushik Sen

// do not remove the following comment
// JALANGI DO NOT INSTRUMENT

(function (sandbox) {
    function ChainedAnalyses() {

        function clientAnalysisException(e) {
            console.error("analysis exception!!!");
            console.error(e.stack);
            if (typeof process !== 'undefined' && process.exit) {
                process.exit(1);
            } else {
                throw e;
            }
        }

        var funList = ["invokeFunPre", "invokeFun", "literal", "forinObject", "declare",
            "getFieldPre", "getField", "putFieldPre", "putField", "read", "write",
            "functionEnter", "functionExit", "scriptEnter", "scriptExit",
            "binaryPre", "binary", "unaryPre", "unary", "conditional",
            "instrumentCodePre", "instrumentCode", "_return", "_throw", "endExpression", "endExecution"];

        this.globals = {};

        this.addAnalysis = function (analysis) {
            var self = this, tmp, length = funList.length;

            for (var i = 0; i < length; i++) {
                var field = funList[i];
                if (tmp = analysis[field]) {
                    var fun = self[field];
                    if (!fun) {
                        fun = self[field] = function () {
                            try {
                                var ret1;
                                var thisFun = arguments.callee;
                                var len = thisFun.afs.length;
                                var args = Array.prototype.slice.call(arguments, 0);
                                for (var i = 0; i < len; i++) {
                                    ret1 = thisFun.afs[i].apply(thisFun.afThis[i], args);
                                }
                                return ret1;
                            } catch (e) {
                                clientAnalysisException(e);
                            }

                        };
                        fun.afs = [];
                        fun.afThis = [];
                        fun.afName = field;
                    }
                    fun.afs.push(tmp);
                    fun.afThis.push(analysis);
                }
            }
        };
    }

    var thisAnalysis = new ChainedAnalyses();
    Object.defineProperty(sandbox, 'analysis', {
        get:function () {
            return thisAnalysis;
        },
        set:function (a) {
            thisAnalysis.addAnalysis(a);
        }
    });

    if (sandbox.Constants.isBrowser) {
        window.addEventListener('keydown', function (e) {
            // keyboard shortcut is Alt-Shift-T for now
            if (e.altKey && e.shiftKey && e.keyCode === 84) {
                sandbox.analysis.endExecution();
            }
        });
    }

}(J$));
