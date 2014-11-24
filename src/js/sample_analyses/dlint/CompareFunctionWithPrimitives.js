// probably forgot to call a function before comparison
(function (sandbox) {
    function MyAnalysis () {
        var iidToLocation = sandbox.iidToLocation;

        var info = {};

        this.binary = function(iid, op, left, right, result){
            var type1 = typeof left;
            var type2 = typeof right;
            if (op === '==' ||
                op === '===' ||
                op === '!==' ||
                op === '!=' ||
                op === '<' ||
                op === '>' ||
                op === '<=' ||
                op === '>='){
                if ((type1 === 'function' && (type2 ==='string' || type2 ==='number' || type2==='boolean')) ||
                    (type2 === 'function' && (type1 ==='string' || type1 ==='number' || type1==='boolean'))) {
                    info[iid] = (info[iid] | 0) + 1;
                }
            }
        };

        this.endExecution = function() {
            sandbox.Utils.printInfo(info, function(x){
                console.log("Comparing a function with a number or string or boolean at "+iidToLocation(x.iid)+" "+ x.count+" time(s).");
            });
        };
    }
    sandbox.analysis = new MyAnalysis();
})(J$);



