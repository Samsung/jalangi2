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

(function(){
  var branches = {};
  J$.analysis = {

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
    conditional : function (iid, result) {
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
        },
        
     /**
      * This callback is called when an execution terminates in node.js.  In a browser
      * environment, the callback is called if ChainedAnalyses.js or ChainedAnalysesNoCheck.js
      * is used and Alt-Shift-T is pressed.
      *
      * @returns {undefined} - Any return value is ignored
      */        
     endExecution : function () {
            for (var id in branches) {
                if (branches.hasOwnProperty(id)) {
                    var branchInfo = branches[id];
                    var location = J$.iidToLocation(id);
                    console.log("At location " + location +
                    " 'true' branch was taken " + branchInfo.trueCount +
                    " time(s) and 'false' branch was taken " + branchInfo.falseCount + " time(s).");
                }
            }
        }
};

}());

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

Now, let’s try to understand the analysis code. A Jalangi analysis is specified by assigning an object
to `J$.analysis`. In the case of the above example, this object defines properties `conditional` and 
`endExecution` that are bound to call-back functions that are invoked by the Jalangi runtime
at appropriate points during the subject program’s execution. For example, the function bound
to `endExecution` is invoked by Jalangi when the execution of the subject program has finished,
and the function bound to `conditional` is invoked anytime that a conditional is executed. 

These callback function assigned to `conditional` takes two arguments: (i) a static instruction 
identifier `iid`, which uniquely identifies the instruction with which the callback is associated, 
and (ii) a boolean `result`,  which indicates whether it evaluated to `true` or `false`. In general, these
identifiers are only unique within a single script. In order to uniquely identify instructions in
the presence of multiple scripts, you need to call `J$.getGlobalIID(iid)` to get a string that statically 
identifies the callback throughout the program. In the above analysis, we call  `J$.getGlobalIID(iid)`
to obtain a unique location for each branch in the program so that we can use that location as
the key in a map. The value of result is used to update the `trueCount` and `falseCount` properties
associated with each key depending on the value that the branch evaluates to.

The `endExecution` callback takes no arguments. It iterates through the unique identifiers that
have been encountered during program execution. For each such identifier, the function
`J$.iidToLocation(id)` is called to obtain a string representation of the identifier, containing the
file name and positional (row:column) information of the start and end of the instruction.

