/*
 * Copyright (c) 2014 Samsung Electronics Co., Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
(function (sandbox) {

    var timers = {};
    var counters = {};
    var accumulators = {};
    var StatCollector = {};
    var STATS_FILE_NAME = "jalangi_stats";


    StatCollector.STAT_FLAG = true;

    StatCollector.resumeTimer = function (timerName) {
        var timer;
        if (!(timer = timers[timerName])) {
            timer = timers[timerName] = {begin:-1, total:0, count:0};
        }
        if (timer.begin >= 0) {
            console.log("Trying to resume active timer " + timerName);
            throw new Error("Trying to resume active timer " + timerName);
        }
        timer.begin = Date.now();
        timer.count++;
    };

    StatCollector.suspendTimer = function (timerName) {
        var timer, now = Date.now();
        if (!(timer = timers[timerName])) {
            throw new Error("Trying to suspend a non-existent timer " + timerName);
        }
        if (timer.begin === -1) {
            console.log("Trying to suspend inactive timer " + timerName)
            throw new Error("Trying to resume inactive timer " + timerName);
        }
        timer.total += (now - timer.begin);
        timer.begin = -1;
    };

    StatCollector.addToAccumulator = function (accumulatorName, val) {
        var accumulator;
        if (!(accumulator = accumulators[accumulatorName])) {
            accumulator = accumulators[accumulatorName] = {count:0, sum:0, max:undefined, min:undefined};
        }
        accumulator.count++;
        accumulator.sum += val;
        if (accumulator.max === undefined) {
            accumulator.max = val;
        } else if (val > accumulator.max) {
            accumulator.max = val;
        }
        if (accumulator.min === undefined) {
            accumulator.min = val;
        } else if (val < accumulator.min) {
            accumulator.min = val;
        }
    };

    StatCollector.addToCounter = function (counterName) {
        counters[counterName] = (counters[counterName] | 0) + 1;
    };

    StatCollector.loadStats = function () {
        try {
            var tmp = JSON.parse(require('fs').readFileSync(STATS_FILE_NAME, "utf8"));
            timers = tmp.timers;
            counters = tmp.counters;
            accumulators = tmp.accumulators;
        } catch (e) {
        }
    };

    StatCollector.storeStats = function () {
        require('fs').writeFileSync(STATS_FILE_NAME, JSON.stringify({timers:timers, counters:counters, accumulators:accumulators}), "utf8");
    };

    StatCollector.printStats = function() {
        for(var timer in timers) {
            if (timers.hasOwnProperty(timer)) {
                console.log("Time spent in "+timer+" = "+timers[timer].total+" ms (count = "+timers[timer].count+")");
            }
        }
        for (var counter in counters) {
            if (counters.hasOwnProperty(counter)) {
                console.log("Number of "+counter+" = "+counters[counter]);
            }
        }
        for (var accumulator in accumulators) {
            if (accumulators.hasOwnProperty(accumulator)) {
                var val = accumulators[accumulator];
                console.log(accumulator+": average = "+(val.sum/val.count)+" max = "+val.max+" min = "+val.min);
            }
        }
    };

    sandbox.exports = StatCollector;
}(module));

if (require.main === module) {
    var stats = module.exports;
    stats.loadStats();
    stats.printStats();

}
