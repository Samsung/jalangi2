Jalangi
=======
### Introduction

Jalangi is a framework for writing heavy-weight dynamic analyses for JavaScript.  Jalangi provides two modes for dynamic program analysis: an **online** mode (a.k.a direct or inbrowser analysis mode)and an **offilne** mode (a.k.a record-replay analysis mode).  In both modes, Jalangi instruments the program-under-analysis to insert callbacks to methods defined in Jalangi.  An analysis writer implements these methods to perform custom dynamic program analysis.  In the online mode, Jalangi performs analysis during the execution of the program.  An analysis in online mode can use shadow memory to attach meta information with every memory location. The offilne mode of Jalangi incorporates two key techniques: 1) selective record-replay, a technique which enables to record and to faithfully replay a user-selected part of the program, and 2) shadow values and shadow execution, which enables easy implementation of heavy-weight dynamic analyses.  Shadow values allow an analysis to attach meta information with every value.  In the distribution you will find several analyses:

  * concolic testing,
  * an analysis to track origins of nulls and undefined,
  * an analysis to infer likely types of objects fields and functions,
  * an analysis to profile object allocation and usage,
  * a simple form of taint analysis,
  * an experimental pure symbolic execution engine (currently undocumented)

A very old demo of Jalangi integrated with the Tizen IDE is available at http://srl.cs.berkeley.edu/~ksen/jalangi.html.  Note that the IDE plugin is not open-source.
Slides describing the internals of Jalangi are available at http://srl.cs.berkeley.edu/~ksen/slides/jalangi-jstools13.pdf and our first paper on Jalangi is available at http://srl.cs.berkeley.edu/~ksen/papers/jalangi.pdf.

### Requirements

We tested Jalangi on Mac OS X 10.8 with Chromium browser.  Jalangi should work on Mac OS
10.7, Ubuntu 11.0 and higher and Windows 7 or higher. Jalangi will NOT work with IE.

  * Latest version of Node.js available at http://nodejs.org/.  We have tested Jalangi with Node v0.10.25.
  * Sun's JDK 1.6 or higher.  We have tested Jalangi with Java 1.6.0_43.
  * Command-line git.
  * libgmp (http://gmplib.org/) is required by cvc3.  Concolic testing uses cvc3 and automaton.jar for constraint solving. The installation script checks if cvc3 and automaton.jar are installed properly.
  * Chrome browser if you need to test web apps.
  * Python (http://python.org) version 2.7 or higher
  
On Windows you need the following extra dependencies:

  * Install Microsoft Visual Studio 2010 (Free express version is fine).
  * If on 64bit also install Windows 7 64-bit SDK.

If you have a fresh installation of Ubuntu, you can install all the requirements by invoking the following commands from a terminal.

    sudo apt-get update
    sudo apt-get install python-software-properties python g++ make
    sudo add-apt-repository ppa:chris-lea/node.js
    sudo apt-get update
    sudo apt-get install nodejs
    sudo add-apt-repository ppa:webupd8team/java
    sudo apt-get update
    sudo apt-get install oracle-java7-installer
    sudo update-java-alternatives -s java-7-oracle
    sudo apt-get install git
    sudo apt-get install libgmp10
    sudo apt-get install chromium-browser

### Installation

    python ./scripts/install.py

If Installation succeeds, you should see the following message:

    ---> Installation successful.
    ---> run 'npm test' to make sure all tests pass

A Lubuntu virtual machine with pre-installed Jalangi (very old version) can be downloaded from http://srl.cs.berkeley.edu/~ksen/jalangi4.zip. You need VirtualBox available at https://www.virtualbox.org/ to run the virtual machine. Login and password for the jalangi account on the machine are jalangi and jalangi, respectively. Open a terminal, go to directory jalangi, and try ./scripts/testsym.

### Run Tests

Check if record and replay executions produce same output on some unit tests located under tests/unit/.

    ./node_modules/.bin/mocha --reporter spec node_test/unitTests.js

The above runs Jalangi both with no analysis and with a trivial analysis that wraps all values.  To run the same
tests over the sunspider benchmarks, use the following command:

    ./node_modules/.bin/mocha --reporter spec node_test/sunspiderTests.js

Run concolic testing tests.

    python ./scripts/sym.py

To run the entire test suite, simply run:

    npm test

### Run Browser Tests

Some automated tests can be run in the browser, using [Selenium](http://docs.seleniumhq.org/).  To run these tests, first install the relevant dependencies:

    sudo python scripts/install-dev.py

(`sudo` is needed to install the Python Selenium bindings.)  Then, to run all browser tests, do:

    python scripts/runbrowsertests.py

You should see Chrome windows opening and closing as the tests are run.
    
### What's new?

Introducing analysis.js.  analysis.js is a new API for performing direct or in browser analysis.  It has a clean,
efficient, and less error-prone API compared to analysis.js.  You can find more documentation in docs/analysis2.md.

### Other Scripts

Run likely type inference analysis on the sunspider benchmarks located under tests/sunspider1/.

    python scripts/testsp_likelytype.py

Run tracker of origin of null and undefined on the sunspider benchmarks located under tests/sunspider1/.

    python scripts/testsp_tracknull.py

Run a simple heap profiler on the sunspider benchmarks located under tests/sunspider1/.

    python scripts/testsp_heapprofiling.py

Record an execution of tests/unit/qsort.js and create jalangi_trace.html which when loaded in a browser replays the execution.

    ./scripts/browserReplay tests/unit/qsort; path-to-chrome-browser jalangi_trace.html


### Concolic testing

To perform concolic testing of some JavaScript code present in a file,
say testme.js, insert the following 4 lines at the top of the file.

    if (typeof window === "undefined") {
        require('../../src/js/InputManager');
        require(process.cwd()+'/inputs');
    }

In the code, use J$.readInput(arg) to indicate the inputs to the
program.  Then run the following command to perform concolic testing:

    python scripts/jalangi.py concolic -i 100000 testme

The -i argument bounds the total number of test inputs.  The
command generates a set of input files in the directory `jalangi_tmp`.
The input files start with the prefix `jalangi_inputs`.  Once the inputs
are generated, you can run testme.js on those inputs by giving the
following command:

     python scripts/jalangi.py rerunall testme

For example, open the file tests/unit/qsort.js and check how inputs are specified.  Then run

     python scripts/jalangi.py concolic tests/unit/qsort 100
     python scripts/jalangi.py rerunall tests/unit/qsort


Open the file tests/unit/regex8.js and check how string inputs are specified.  Then run

     python scripts/jalangi.py concolic tests/unit/regex8 100
     python scripts/jalangi.py rerunall tests/unit/regex8


### Dynamic analysis

The JavaScript code in
src/js/analyses/objectalloc/ObjectAllocationTrackerEngine.js
implements a simple analysis that reports the number of objects
created during an execution along with some auxiliary information.
The analysis can be performed on a file testme.js by invoking the
following command:

    python scripts/jalangi.py analyze -a src/js/analyses/objectalloc/ObjectAllocationTrackerEngine testme

For example, try running the analysis on a sunspider benchmark by issuing the following command:

    python scripts/jalangi.py analyze -a src/js/analyses/objectalloc/ObjectAllocationTrackerEngine tests/sunspider1/crypto-aes

Similarly, you can run a likely type inference analysis on another sunspider benchmark by calling the following command and you will notice some warnings.

    python scripts/jalangi.py analyze -a src/js/analyses/likelytype/LikelyTypeInferEngine tests/sunspider1/crypto-sha1

Run the following to perform a simple form of taint analysis.

	python scripts/jalangi.py analyze -a src/js/analyses/simpletaint/SimpleTaintEngine tests/sunspider1/crypto-sha1

You can run origin of null and undefined tracker on a toy example by issuing the following command:

    python scripts/jalangi.py analyze -a src/js/analyses/trackundefinednull/UndefinedNullTrackingEngine tests/unit/track_undef_null

### Chaining Dynamic Analyses

    python scripts/jalangi.py direct --analysis src/js/analyses/ChainedAnalyses.js --analysis src/js/analyses/dlint/UndefinedOffset.js --analysis src/js/analyses/dlint/ShadowProtoProperty.js tests/unit/dlint1

### Record and replay a web application.

***

Jalangi provides a script for instrumenting a locally-stored web application, by instrumenting all discovered scripts on disk.  Here is how to instrument the annex app using this script.  First, run the `instrument.js` script to instrument the app:

    node src/js/commands/instrument.js --outputDir /tmp tests/tizen/annex

This creates an instrumented copy of annex in `/tmp/annex`.  To see other options for `instrument.js`, run it with the `-h` option.

Then, launch the Jalangi server and the HTML page by running

    killall node
    python scripts/jalangi.py rrserver file:///tmp/annex/index.html

You can now play the game for sometime.  Try two moves.  This will generate a jalangi_trace1 in the current directory.  To ensure the trace is completely flushed, press `Alt+Shift+T` in the browser, and then close the browser window.  You can run a dynamic analysis on the trace file by issuing the following commands (not that this differs slightly from above, due to the need to copy the trace):

    cp jalangi_trace1 /tmp/annex
    node src/js/commands/replay.js --tracefile /tmp/annex/jalangi_trace1 --analysis src/js/analyses/objectalloc/ObjectAllocationTrackerEngine


### Record and replay using the proxy server.

***

Jalangi also provides a proxy server to instrument code from live web sites.  Here is how to instrument the annex app from above using the proxy server.

First start a HTTP server by running the following command.  The command starts a simple Python based http server.

	python scripts/jalangi.py server &

Then, launch the combined proxy and Jalangi record-replay server.

    node src/js/commands/jalangi_proxy.js
    
You will see output like the following:

	writing output to /tmp/instScripts/site0
	listening on port 8501
	Fri Dec 13 2013 16:02:34 GMT-0800 (PST) Server is listening on port 8080
	
The proxy server is listening on port 8501, and the record-replay server on port 8080.  Instrumented scripts and the trace file will be written to `/tmp/instScripts/site0`.

Now, configure your browser to use the proxy server.  The procedure will vary by operating system and by browser.  
For browsers on Mac OS X, you can set the proxy server for a network adapter `Wi-Fi` with the following command:

    sudo networksetup -setwebproxy Wi-Fi 127.0.0.1 8501 off

To stop using the proxy, run `sudo networksetup -setwebproxystate Wi-Fi off`.

Now, open Chrome and navigate to `http://127.0.0.1:8181/tests/tizen/annex/index.html` (*not* `index_jalangi_.html`).  You can now play the game for sometime.  Try two moves.  This will generate a jalangi_trace1 in the output directory `/tmp/instScripts/site0`.  To ensure the trace is completely flushed, press `Alt+Shift+T` in the browser, and then close the browser window.  Once you are done playing, kill the proxy server process to complete dumping of certain
metadata.

Now, you can run a dynamic analysis on the trace file by issuing the following commands.

    node src/js/commands/replay.js --tracefile /tmp/instScripts/site0/jalangi_trace1 --analysis src/js/analyses/objectalloc/ObjectAllocationTrackerEngine


## Further examples of record and replay

***

    node src/js/commands/instrument.js --outputDir /tmp tests/tizen/calculator

    killall node
    python scripts/jalangi.py rrserver file:///tmp/calculator/index.html

    cp jalangi_trace1 /tmp/calculator
    node src/js/commands/replay.js --tracefile /tmp/calculator/jalangi_trace1 --analysis src/js/analyses/likelytype/LikelyTypeInferEngine

***

    node src/js/commands/instrument.js --outputDir /tmp tests/tizen/go

    killall node
    python scripts/jalangi.py rrserver file:///tmp/go/index.html

    cp jalangi_trace1 /tmp/go
    node src/js/commands/replay.js --tracefile /tmp/go/jalangi_trace1 --analysis src/js/analyses/likelytype/LikelyTypeInferEngine

### In browser analysis of a web application.

***

Jalangi allows to run an analysis, which does not use ConcolicValue, in a browser.
Here is how to instrument the annex app with an inbrowser analysis.  First, run the `instrument.js` script to instrument the app:

    node src/js/commands/instrument.js --inbrowser --smemory --analysis src/js/analyses/logNaN/LogNaN.js --outputDir /tmp tests/tizen/annex

This creates an instrumented copy of annex in `/tmp/annex`.  To see other options for `instrument.js`, run it with the `-h` option.

Then, open the HTML page in a browser (tested on Chrome) by running

    open file:///tmp/annex/index.html

You can now play the game for sometime.  Try two moves and see the console output after pressing Shift-Alt-T.  In the
in-browser mode, one must not use ConcolicValue to wrap a program value.  However, one could use shadow execution to collect statistics.
Shadow memory is supported in the "inbrowser" mode.  Shadow memory library can be accessed in an analysis via J$.Globals.smemory.
 smemory.getShadowObject(obj) returns the shadow object associated with obj if type of obj is "object" or "function".
 smemory.getFrame(varName) returns the frame that contains the variable named "varName".


The following shows how to run the object allocation tracker analysis on the annex game.  After playing the game for 
some time, press Shift-Alt-T to print the analysis results on the console.

    node src/js/commands/instrument.js --inbrowser --smemory --analysis src/js/analyses/objectalloc/ObjectAllocationTrackerEngineIB.js --outputDir /tmp tests/tizen/annex
    open file:///tmp/annex/index.html

The following shows how to run the likely type inference analysis on the annex game. After playing the game for 
some time, press Shift-Alt-T to print the analysis results on the console.

    node src/js/commands/instrument.js --inbrowser --smemory --analysis analyses/likelytype/LikelyTypeInferEngineIB.js --outputDir /tmp tests/tizen/annex
    open file:///tmp/annex/index.html

