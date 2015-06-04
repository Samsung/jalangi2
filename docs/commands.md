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
                          [--outDir OUTDIR] [--out OUT] [--url URL]
                          [--extra_app_scripts EXTRA_APP_SCRIPTS]
                          [--analysis ANALYSIS]
                          file


Positional arguments:

    file                  file to instrument

Optional arguments:

    -h, --help            Show this help message and exit.
    --inlineIID           Inline IID to (beginLineNo, beginColNo, endLineNo,
                        endColNo) in J$.iids in the instrumented file
    --inlineSource        Inline original source as string in J$.iids.code in
                        the instrumented file
    --initParam INITPARAM
                        initialization parameter for analysis, specified as
                        key:value
    --noResultsGUI        disable insertion of results GUI code in HTML
    --astHandlerModule ASTHANDLERMODULE
                        Path to a node module that exports a function to be
                        used for additional AST handling after instrumentation
    --outDir OUTDIR       Directory containing scripts inlined in html
    --out OUT             Instrumented file name (with path). The default is to
                        append _jalangi_ to the original JS file name
    --url URL             URL of the file to be instrumented. The URL is stored
                        as metadata in the source map and is not used for
                        retrieving the file.
    --extra_app_scripts EXTRA_APP_SCRIPTS
                        list of extra application scripts to be injected and
                        instrumented, separated by path.delimiter
    --analysis ANALYSIS   Analysis script.

## instrument.js

Utility to apply Jalangi instrumentation to files or a folder.

    node src/js/commands/instrument.js -h
    usage: instrument.js [-h] [-x EXCLUDE] [--only_include ONLY_INCLUDE] [-i]
                     [--inlineIID] [--inlineSource] [--inlineJalangi]
                     [--analysis ANALYSIS] [--initParam INITPARAM] [-d] [-c]
                     [--extra_app_scripts EXTRA_APP_SCRIPTS] [--no_html]
                     --outputDir OUTPUTDIR [--verbose]
                     [--astHandlerModule ASTHANDLERMODULE]
                     inputFiles[inputFiles ...]


Positional arguments:

    inputFiles            either a list of JavaScript files to instrument, or a
                        single directory under which all JavaScript and HTML
                        files should be instrumented (modulo the --no_html
                        and --exclude flags)

Optional arguments:

    -h, --help            Show this help message and exit.
    -x EXCLUDE, --exclude EXCLUDE
                        do not instrument any scripts whose file path
                        contains this substring
    --only_include ONLY_INCLUDE
                        list of path prefixes specifying which
                        sub-directories should be instrumented, separated by
                        path.delimiter
    -i, --instrumentInline
                        instrument inline scripts
    --inlineIID           Inline IID to (beginLineNo, beginColNo, endLineNo,
                        endColNo) in J$.iids in the instrumented file
    --inlineSource        Inline original source as string in J$.iids.code in
                        the instrumented file
    --inlineJalangi       Inline Jalangi runtime source code into HTML files
    --analysis ANALYSIS   Analysis script.
    --initParam INITPARAM
                        initialization parameter for analysis, specified as
                        key:value
    -d, --direct_in_output
                        Store instrumented app directly in output directory
                        (by default, creates a sub-directory of output
                        directory)
    -c, --copy_runtime    Copy Jalangi runtime files into instrumented app in
                        jalangi_rt sub-directory
    --extra_app_scripts EXTRA_APP_SCRIPTS
                        list of extra application scripts to be injected and
                        instrumented, separated by path.delimiter
    --no_html             don't inject Jalangi runtime into HTML files
    --outputDir OUTPUTDIR
                        directory in which to place instrumented files
    --verbose             print verbose output
    --astHandlerModule ASTHANDLERMODULE
                        Path to a node module that exports a function to be
                        used for additional AST handling after instrumentation
## direct.js

Command-line utility to perform Jalangi2's analysis

    node src/js/commands/direct.js -h
    usage: direct.js [-h] [--analysis ANALYSIS] [--initParam INITPARAM] ...


Positional arguments:

    script_and_args       script to record and CLI arguments for that script

Optional arguments:

    -h, --help            Show this help message and exit.
    --analysis ANALYSIS   absolute path to analysis file to run
    --initParam INITPARAM
                        initialization parameter for analysis, specified as
                        key:value
