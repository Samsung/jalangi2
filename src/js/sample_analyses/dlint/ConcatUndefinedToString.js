(function (sandbox) {
    function MyAnalysis () {
        var iidToLocation = sandbox.iidToLocation;
        var Constants = sandbox.Constants;
        var HOP = Constants.HOP;
        var sort = Array.prototype.sort;

        var info = {};

        this.binary = function(iid, op, left, right, result){
            if (op === '+' && typeof result==='string' && (left===undefined || right===undefined)) {
                info[iid] = (info[iid]|0) + 1;
            }
        };

        this.endExecution = function() {
            sandbox.Utils.printInfo(info, function(x){
                console.log("Concatenated undefined to a string at "+iidToLocation(x.iid)+" "+ x.count+" time(s).");
            });
        };
    }
    sandbox.analysis = new MyAnalysis();
})(J$);



