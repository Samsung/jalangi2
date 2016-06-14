// do not remove the following comment
// JALANGI DO NOT INSTRUMENT

/**
 * @author  Koushik Sen
 *
 */
(function (sandbox) {
    var allocCount = {};

    function MyAnalysis() {

        this.literal = function (iid, val, hasGetterSetter) {
            var id = J$.getGlobalIID(iid);
            if (typeof val === 'object')
                allocCount[id] = (allocCount[id] | 0) + 1;
        };

        this.invokeFunPre = function (iid, f, base, args, isConstructor, isMethod, functionIid, functionSid) {
            var id = J$.getGlobalIID(iid);
            if (isConstructor)
                allocCount[id] = (allocCount[id] | 0) + 1;
        };

        this.endExecution = function () {
            print(allocCount);
        };
    }

    function print(map) {
        for (var id in map)
            if (map.hasOwnProperty(id)) {
                sandbox.log("Object allocated at " + J$.iidToLocation(id)+" = "+map[id]);

            }
    }

    sandbox.analysis = new MyAnalysis();
}(J$));

/*
 node src/js/commands/jalangi.js --inlineIID --inlineSource --analysis src/js/sample_analyses/pldi16/CountObjectsPerAllocationSite.js tests/pldi16/CountObjectsPerAllocationSiteTest.js
 node src/js/commands/esnstrument_cli.js --inlineIID --inlineSource --analysis src/js/sample_analyses/pldi16/CountObjectsPerAllocationSite.js --out /tmp/pldi16/CountObjectsPerAllocationSiteTest.html  tests/pldi16/CountObjectsPerAllocationSiteTest.html
 node src/js/commands/esnstrument_cli.js --inlineIID --inlineSource --analysis src/js/sample_analyses/pldi16/CountObjectsPerAllocationSite.js --out /tmp/pldi16/CountObjectsPerAllocationSiteTest.js  tests/pldi16/CountObjectsPerAllocationSiteTest.js
 open file:///tmp/pldi16/CountObjectsPerAllocationSiteTest.html
 */
