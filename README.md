Jalangi2
=======
### Introduction

Jalangi2 is a framework for writing dynamic analyses for JavaScript.
Jalangi1 is still available at https://github.com/SRA-SiliconValley/jalangi, but we no longer plan to develop it.
Jalangi2 does not support the record/replay feature of Jalangi1.
In the Jalangi2 distribution you will find several analyses:

  * an analysis to [track NaNs](src/js/sample_analyses/dlint/CheckNaN.js).
  * an analysis to [check if an undefined is concatenated to a string](src/js/sample_analyses/dlint/ConcatUndefinedToString.js).
  * [Memory analysis](https://github.com/Samsung/meminsight): a memory-profiler for JavaScript and HTML5.
  * [DLint](https://github.com/ksen007/jalangi2analyses): a a dynamic checker for JavaScript bad coding practices.
  * [JITProf](https://github.com/ksen007/jalangi2analyses): a dynamic JIT-unfriendly code snippet detection tool.
  * [analysisCallbackTemplate.js](src/js/runtime/analysisCallbackTemplate.js): a template for writing a dynamic analysis.
  * and [more ...](src/js/sample_analyses/)

See [our tutorial slides](http://manu.sridharan.net/files/JalangiTutorial.pdf) for a detailed overview of Jalangi and some client analyses.

### Requirements

We tested Jalangi on Mac OS X 10.10 with Chromium browser.  Jalangi should work on Mac OS
10.7, Ubuntu 11.0 and higher and Windows 7 or higher. Jalangi will NOT work with IE.

  * Node.js v4.x available at https://nodejs.org/en/download/releases/.  We have tested Jalangi with Node v4.x.  Jalangi **does not** 
    yet work with Node.js v6.x.
  * Chrome browser if you need to test web apps.
  * Python (http://python.org) version 2.7 or higher and less than 3.0.

On Windows you need the following extra dependencies:

  * Install Microsoft Visual Studio 2010 (Free express version is fine).
  * If on 64bit also install Windows 7 64-bit SDK.

If you have a fresh installation of Ubuntu, you can install all the requirements by invoking the following commands from a terminal.

    sudo apt-get update
    sudo apt-get install python-software-properties python g++ make
    sudo add-apt-repository ppa:chris-lea/node.js
    sudo apt-get update
    sudo apt-get install nodejs
    sudo apt-get update
    sudo apt-get install chromium-browser

### Installation

Clone the repository, and then run:

    npm install

### Run tests

    python scripts/test.traceall.py
    python scripts/test.analysis.py
    python scripts/test.dlint.py

### Usage

**Analysis in node.js with on-the-fly instrumentation**

An analysis can be performed on a JavaScript file in node.js by issuing the following commands:

    node src/js/commands/jalangi.js --inlineIID --inlineSource --analysis src/js/sample_analyses/ChainedAnalyses.js --analysis src/js/sample_analyses/dlint/Utils.js --analysis src/js/sample_analyses/dlint/CheckNaN.js --analysis src/js/sample_analyses/dlint/FunCalledWithMoreArguments.js --analysis src/js/sample_analyses/dlint/CompareFunctionWithPrimitives.js --analysis src/js/sample_analyses/dlint/ShadowProtoProperty.js --analysis src/js/sample_analyses/dlint/ConcatUndefinedToString.js --analysis src/js/sample_analyses/dlint/UndefinedOffset.js tests/octane/deltablue.js

In the above analysis, we chained several analyses by including *--analysis src/js/analyses/ChainedAnalyses.js* as the first analysis.
The command runs the following analyses

    src/js/sample_analyses/dlint/CheckNaN.js
    src/js/sample_analyses/dlint/FunCalledWithMoreArguments.js
    src/js/sample_analyses/dlint/CompareFunctionWithPrimitives.js
    src/js/sample_analyses/dlint/ShadowProtoProperty.js
    src/js/sample_analyses/dlint/ConcatUndefinedToString.js
    src/js/sample_analyses/dlint/UndefinedOffset.js

The implementation of an analysis requires the implementation of several callback functions. One can start writing
an writing analysis using the template file [src/js/runtime/analysisCallbackTemplate.js](src/js/runtime/analysisCallbackTemplate.js).
A documentation of these call back functions can be found at [docs/MyAnalysis.html](docs/MyAnalysis.html).
A tutorial on writing a Jalangi analysis can be found at [docs/tutorial1.md](docs/tutorial1.md). While writing 
an analysis one could run [src/js/sample_analyses/pldi16/TraceAll.js](src/js/sample_analyses/pldi16/TraceAll.js) 
analysis on a JavaScript file to print all the callback functions that got 
called during the execution of the file.  Such a trace is useful to see what callbacks get called during an 
execution.  The following command runs the TraceAll.js analysis on the file [tests/octane/deltablue.js](tests/octane/deltablue.js).

    node src/js/commands/jalangi.js --inlineIID --inlineSource --analysis src/js/sample_analyses/ChainedAnalyses.js --analysis src/js/runtime/SMemory.js --analysis src/js/sample_analyses/pldi16/TraceAll.js tests/octane/deltablue.js

**Analysis in node.js with explicit one-file-at-a-time offline instrumentation**

An analysis can be performed on a JavaScript file in node.js by issuing the following commands:

    node src/js/commands/esnstrument_cli.js --inlineIID --inlineSource tests/octane/deltablue.js
    node src/js/commands/direct.js --analysis src/js/sample_analyses/ChainedAnalyses.js --analysis src/js/sample_analyses/dlint/Utils.js --analysis src/js/sample_analyses/dlint/CheckNaN.js --analysis src/js/sample_analyses/dlint/FunCalledWithMoreArguments.js --analysis src/js/sample_analyses/dlint/CompareFunctionWithPrimitives.js --analysis src/js/sample_analyses/dlint/ShadowProtoProperty.js --analysis src/js/sample_analyses/dlint/ConcatUndefinedToString.js --analysis src/js/sample_analyses/dlint/UndefinedOffset.js tests/octane/deltablue_jalangi_.js

In the above analysis, we chained several analyses by including *--analysis src/js/analyses/ChainedAnalyses.js*.

**Analysis in a browser using offline instrumentation**

An analysis can be performed on a web app using the Chrome browser by issuing the following commands:

    node src/js/commands/instrument.js --inlineIID --inlineSource -i --inlineJalangi --analysis src/js/sample_analyses/ChainedAnalyses.js --analysis src/js/sample_analyses/dlint/Utils.js --analysis src/js/sample_analyses/dlint/CheckNaN.js --analysis src/js/sample_analyses/dlint/FunCalledWithMoreArguments.js --analysis src/js/sample_analyses/dlint/CompareFunctionWithPrimitives.js --analysis src/js/sample_analyses/dlint/ShadowProtoProperty.js --analysis src/js/sample_analyses/dlint/ConcatUndefinedToString.js --analysis src/js/sample_analyses/dlint/UndefinedOffset.js --outputDir /tmp tests/tizen/annex
    open file:///tmp/annex/index.html

While performing analysis in a browser, one needs to press Alt-Shift-T to end the analysis and to print the analysis results in the console.

**Analysis in a browser using a proxy and on-the-fly instrumentation**

You can also setup a proxy to instrument JavaScript files on-the-fly.
To do so, you need to install [mitmproxy](http://mitmproxy.org/).  We
highly recommend **version 0.11.3**; later versions may not
work with Jalangi.  On Linux, you can follow
[the standard installation instructions](http://docs.mitmproxy.org/en/stable/install.html),
but instead of running `sudo pip install mitmproxy`, run `sudo pip install mitmproxy==0.11.3` to get the right version.  On Mac OS,
the easiest path we have found is to use [Homebrew](http://brew.sh/).
With Homebrew installed, you can install the right version by running:

    brew install python
    pip install -U pip
    pip install mitmproxy==0.11.3

Note that you might need to restart your shell afterward, to ensure
the python being used is `/usr/local/bin/python`.

For instrumenting code served over HTTPS, you will additionally need
to set up a root certificate for mitmproxy.  See
[their instructions](http://docs.mitmproxy.org/en/stable/certinstall.html)
or [this document](https://github.com/ksen007/jalangi2analyses/blob/master/doc/mitmproxy-install.pdf).

After installation, you can run the Jalangi instrumentation proxy by
issuing the following command:

    mitmdump --quiet --anticache -s "scripts/proxy.py --inlineIID --inlineSource --analysis src/js/sample_analyses/ChainedAnalyses.js --analysis src/js/runtime/analysisCallbackTemplate.js"

In your browser, the http and https proxy should be set to 127.0.0.1:8080.  Now if you load a website in your browser, all JavaScript files associated with the website will get instrumented on-the-fly.

On a Mac, the proxy can be set and launched automatically by issuing the following command:

    ./scripts/mitmproxywrapper.py --toggle --auto-disable --quiet --anticache -s "scripts/proxy.py --inlineIID --inlineSource --analysis src/js/sample_analyses/ChainedAnalyses.js --analysis src/js/runtime/analysisCallbackTemplate.js"

The command starts mitmproxy if the proxy is not currently enabled, and disables it otherwise.
The `--auto-disable` option will automatically disable the proxy when the script is interrupted.

Jalangi2 caches the instrumented source files in `./cache/`.
The use of the cache can be disabled during development by passing the `--no-cache` flag to `scripts/proxy.py`.

### Developing an analysis in Jalangi2

Refer to [docs/index.html](docs/index.html) and [docs/commands.md](docs/commands.md) for further information.  A tutorial
on writing a Jalangi analysis can be found in [docs/tutorial1.md](docs/tutorial1.md).  

### Supported ECMAScript versions

Jalangi2 supports ECMAScript 5.1, plus the `const` construct from ECMAScript 6.  Other ES6 features may work, but have not been tested.

License
-------

Jalangi2 is distributed under the [Apache License](http://www.apache.org/licenses/LICENSE-2.0.html).
