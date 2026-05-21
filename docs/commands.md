## jalangi.js

Command-line utility to perform Jalangi2's instrumentation and analysis

    node src/js/commands/jalangi.js -h
    usage: jalangi.js [-h] [--analysis ANALYSIS] [--initParam INITPARAM]
                  [--inlineIID] [--inlineSource]
                  [--astHandlerModule ASTHANDLERMODULE]
                  ...


Positional arguments:

    script_and_args       script to record and CLI arguments for that script

Optional arguments:

    -h, --help            Show this help message and exit.
    --analysis ANALYSIS   absolute path to analysis file to run
    --initParam INITPARAM
                        initialization parameter for analysis, specified as
                        key:value
    --inlineIID           Inline IID to (beginLineNo, beginColNo, endLineNo,
                        endColNo) in J$.iids in the instrumented file
    --inlineSource        Inline original source as string in J$.iids.code in
                        the instrumented file
    --astHandlerModule ASTHANDLERMODULE
                        Path to a node module that exports a function to be
                        used for additional AST handling after instrumentation

## esnstrument_cli.js

Command-line utility to perform instrumentation

    node src/js/commands/esnstrument_cli.js -h
    usage: esnstrument_cli.js [-h] [--inlineIID] [--inlineSource]
                          [--initParam INITPARAM] [--noResultsGUI]
                          [--astHandlerModule ASTHANDLERMODULE]
                          [--outDir 
