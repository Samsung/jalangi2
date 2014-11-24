## esnstrument.js

Command-line utility to perform instrumentation

    node src/js/instrument/esnstrument.js -h
    usage: esnstrument.js [-h] [--initIID] [--noInstrEval]
                      [--inlineIID] [--dirIIDFile DIRIIDFILE] [--out OUT]
                      file

Positional arguments:

    file                  file to instrument

Optional arguments:

    -h, --help            Show this help message and exit.
    --initIID             Initialize IIDs to 0
    --noInstrEval         Do not instrument strings passed to evals
    --inlineIID           Inline IIDs in the instrumented file
    --dirIIDFile DIRIIDFILE
                        Directory containing jalangi_sourcemap.js and
                        jalangi_initialIID.json
    --out OUT             Instrumented file name (with path). The default is to
                        append _jalangi_ to the original JS file name


## instrument.js

Utility to apply Jalangi instrumentation to files or a folder.

    node src/js/commands/instrument.js -h
    usage: instrument.js [-h] [-a2] [-x EXCLUDE]
                     [--only_include ONLY_INCLUDE] [-i] [--analysis ANALYSIS]
                     [--initParam INITPARAM] [-d] [--selenium]
                     [--in_memory_trace] [--inbrowser] [--smemory] [-c]
                     [--extra_app_scripts EXTRA_APP_SCRIPTS] [--no_html]
                     --outputDir OUTPUTDIR
                     inputFiles [inputFiles ...]


Positional arguments:

    inputFiles            either a list of JavaScript files to instrument, or a 
                        single directory under which all JavaScript and HTML 
                        files should be instrumented (modulo the --no_html 
                        and --exclude flags)

Optional arguments:

    -h, --help            Show this help message and exit.
    -a2, --analysis2      use analysis2
    -x EXCLUDE, --exclude EXCLUDE
                        do not instrument any scripts whose file path 
                        contains this substring
    --only_include ONLY_INCLUDE
                        list of path prefixes specifying which 
                        sub-directories should be instrumented, separated by 
                        path.delimiter
    -i, --instrumentInline
                        instrument inline scripts
    --analysis ANALYSIS   Analysis script for 'inbrowser'/'record' mode. 
                        Analysis must not use ConcolicValue
    --initParam INITPARAM
                        initialization parameter for analysis, specified as 
                        key:value
    -d, --direct_in_output
                        Store instrumented app directly in output directory 
                        (by default, creates a sub-directory of output 
                        directory)
    --selenium            Insert code so scripts can detect they are running 
                        under Selenium. Also keeps Jalangi trace in memory
    --in_memory_trace     Insert code to tell analysis to keep Jalangi trace in 
                        memory instead of writing to WebSocket
    --inbrowser           Insert code to tell Jalangi to run in 'inbrowser' 
                        analysis mode
    --smemory             Add support for shadow memory
    -c, --copy_runtime    Copy Jalangi runtime files into instrumented app in 
                        jalangi_rt sub-directory
    --extra_app_scripts EXTRA_APP_SCRIPTS
                        list of extra application scripts to be injected and 
                        instrumented, separated by path.delimiter
    --no_html             don't inject Jalangi runtime into HTML files
    --outputDir OUTPUTDIR
                        directory in which to place instrumented files
                        Utility to apply Jalangi instrumentation to files or a folder

    node src/js/commands/instrument.js -h
    usage: instrument.js [-h] [-s] [-x EXCLUDE] [--only_include ONLY_INCLUDE] [-i]
                     [--analysis ANALYSIS] [-d] [--selenium]
                     [--in_memory_trace] [--inbrowser] [--smemory] [-c]
                     [--extra_app_scripts EXTRA_APP_SCRIPTS] [--no_html]
                     --outputDir OUTPUTDIR
                     inputFiles [inputFiles ...]

## direct.js

Command-line utility to perform Jalangi's analysis2

    node src/js/commands/direct.js -h
    usage: analysis.js [-h] [--analysis ANALYSIS] [--initParam INITPARAM] ...


Positional arguments:

    script_and_args       script to record and CLI arguments for that script

Optional arguments:
    
    -h, --help            Show this help message and exit.
    --analysis ANALYSIS   absolute path to analysis file to run
    --initParam INITPARAM
                        initialization parameter for analysis, specified as 
                        key:value


## direct.js

Command-line utility to perform Jalangi's direct analysis

	node src/js/commands/direct.js -h
    usage: direct.js [-h] [--smemory] [--analysis ANALYSIS]
                 [--initParam INITPARAM]
                 ...


Positional arguments:
  
	script_and_args      script to record and CLI arguments for that script

Optional arguments:
  
	-h, --help           Show this help message and exit.
    --smemory            Use shadow memory
    --analysis ANALYSIS  absolute path to analysis file to run
    --initParam INITPARAM
                        initialization parameter for analysis, specified as 
                        key:value
## record.js

Command-line utility to perform Jalangi's record phase

    node src/js/commands/record.js --help

    usage: record.js [-h] [--smemory] [--tracefile TRACEFILE]
                     [--analysis ANALYSIS]
                     ...

Positional arguments:

    script_and_args       script to record and CLI arguments for that script

Optional arguments:

    -h, --help            Show this help message and exit.
    --smemory             Use shadow memory
    --tracefile TRACEFILE
                        Location to store trace file
    --analysis ANALYSIS   analysis to run during record

## replay.js

Command-line utility to perform Jalangi's replay phase

	node src/js/commands/replay.js --help
	usage: replay.js [-h] [--smemory] [--tracefile TRACEFILE]
                 	[--analysis ANALYSIS]
                 


Optional arguments:

	-h, --help            Show this help message and exit.
	--smemory             Use shadow memory
	--tracefile TRACEFILE
                        Location to store trace file
    --analysis ANALYSIS   analysis to run during replay
    
## symbolic.js

Command-line utility to perform Jalangi's pure symbolic execution

	node src/js/commands/symbolic.js -h
	usage: symbolic.js [-h] analysis ...


Positional arguments:
  
	analysis         path to symbolic execution code
	script_and_args  script to run symbolically and its arguments

Optional arguments:
  
	-h, --help       Show this help message and exit.
