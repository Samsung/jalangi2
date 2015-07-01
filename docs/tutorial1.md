### Writing a Jalangi 2 analysis ###

_Work in progress_

In this tutorial, we will describe how to develop and run a simple analysis in Jalangi 2.

#### Download and Install Jalangi 2

First you need to download and install Jalangi 2.  Instructions for downloading and installing Jalangi 2 can be found
[here](../README.md).  In summary, you need to take the following steps to install Jalangi 2.  Make sure that you have
the latest version of [node.js](https://nodejs.org/) and Python 2.7 or higher and less than 3.0 installed on your
machine.  Download Jalangi 2 from https://github.com/Samsung/jalangi2/archive/master.zip and unzip the archive to
create the jalangi2 directory.  Go to the jalangi2 directory.  Install and test Jalangi 2 by running the following
commands:

    npm install
    python scripts/test.analysis.py
    python scripts/test.dlint.py

If all tests pass, you are ready to use Jalangi 2.  You should also download and install the latest version of Chrome
or Firefox if you want to test Jalangi 2 in a browser.


#### Example

As an example, we will use Jalangi to add instrumentation to the following simple example program:

```javascript

function foo(){
  console.log("foo");
}

function bar(){
  console.log("bar");
}

for (var i = 0; i < 10; i++){
  if (i%2 === 0){
    foo();
  } else {
    bar();
  }
}
console.log("done");


```

Running this program with node.js can be done as follows:

    node example.js 

and produces the following output:

    foo
    bar
    foo
    bar
    foo
    bar
    foo
    bar
    foo
    bar
    done

#### A First Analysis

First, we will consider an analysis that reports on branches that are covered during the execution of a JavaScript program.
The JavaScript code below encodes such an analysis. 

```javascript

(function (sandbox) {
    var branches = {};

    function MyAnalysis() {

        /**
         * This callback is called after a condition check before branching.
         * Branching can happen in various statements
         * including if-then-else, switch-case, while, for, ||, &&, ?:.
         *
         * @param {number} iid - Static unique instruction identifier of this callback
         * @param {*} result - The value of the conditional expression
         * @returns {{result: *}|undefined} - If an object is returned, the result of
         * the conditional expression is replaced with the value stored in the
         * <tt>result</tt> property of the object.
         */
        this.conditional = function (iid, result) {
            var id = J$.getGlobalIID(iid);
            var branchInfo = branches[id];
            if (!branchInfo) {
                branchInfo = branches[id] = {trueCount: 0, falseCount: 0};
            }
            if (result) {
                branchInfo.trueCount++;
            } else {
                branchInfo.falseCount++;
            }
        };

        /**
         * This callback is called when an execution terminates in node.js.  In a browser
         * environment, the callback is called if ChainedAnalyses.js or ChainedAnalysesNoCheck.js
         * is used and Alt-Shift-T is pressed.
         *
         * @returns {undefined} - Any return value is ignored
         */
        this.endExecution = function () {
            for (var id in branches) {
                if (branches.hasOwnProperty(id)) {
                    var branchInfo = branches[id];
                    console.log("At location " + J$.iidToLocation(id) +
                    " 'true' branch was taken " + branchInfo.trueCount +
                    " time(s) and 'false' branch was taken " + branchInfo.falseCount + " time(s).");
                }
            }
        };
    }

    sandbox.analysis = new MyAnalysis();
}(J$));


```
Before we discuss the specific analysis, let's run it and see what happens. 
To do this, create a directory named "experiments" in the  top-level jalangi2 directory.
Then, copy the example program into a file example.js, and copy the above analysis into a file
analysis.js.   Having done that, try running the following command:

    node ../src/js/commands/jalangi.js --inlineIID --inlineSource --analysis analysis.js example.js

If all goes well, this should produce output that looks roughly as follows:

    foo
    bar
    foo
    bar
    foo
    bar
    foo
    bar
    foo
    bar
    done
    At location (/Users/ftip/git/jalangi2/experiments/example.js:9:17:9:23) 'true' branch was taken 10 time(s) and 'false' branch was taken 1 time(s).
    At location (/Users/ftip/git/jalangi2/experiments/example.js:10:7:10:16) 'true' branch was taken 5 time(s) and 'false' branch was taken 5 time(s).

As you can see, the program has produced the same output as before. However, upon termination
additional information was printed that reflects the number of times each branch was executed. 
Specifically, you can see that the predicate of the for-loop has executed 11 times, of which it
evaluated to "true" 10 times, and to "false" once. Moreover, the condition of the if-statement
evaluated to true 5 times, and to false 5 times, as expected.
