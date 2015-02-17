### Writing a Jalangi2 analysis ###

analysis.js is a new API for performing direct or in browser analysis.  It has a clean, efficient, and less error-prone
API compared to analysis.js of Jalangi1.  An analysis in analysis.js can be written using the template at
[src/js/runtime/analysisCallbackTemplate.js](../src/js/runtime/analysisCallbackTemplate.js).

An analysis can access the source map using the global object stored in *J$.smap*.  Jalangi2 assigns an unique id, called *sid*, to each JavaScript
script loaded on a website.  *J$.smap* maps each *sid* to an object, say *iids*, containing source map information for the script whose id is *sid*.
*iids* has the following fields: "originalCodeFileName" (path of the original script file), "instrumentedCodeFileName" (path of the instrumented script file),
"url" (is optional and contains the URL of the script if it is set during instrumentation using the --url option),
"evalSid" (sid of the script where the eval is called in case the script comes from an *eval* function call),
"evalIid" (iid of the *eval* function call in case the script comes from an *eval* function call), "nBranches" (the number of conditional statements in the script),
and "code" (a string denoting the original script code if the code is instrumented with the --inlineSource option).
*iids* also maps each *iid* (which stands for instruction id, an unique id assigned to each callback function inserted by Jalangi2) to an array containing
*[beginLineNumber, beginColumnNumber, endLineNumber, endColumnNumber]*.  The mapping from iids to arrays is only available if the code is instrumented with
the --inlineIID option.

In each callback function above, *iid* denotes the unique static instruction id of the callback in the script.
Two callback functions inserted in two different scripts may have the same iid.  In a callback function, one can access
the current script id using *J$.sid*.  One can call *J$.getGlobalIID(iid)* to get a string, called *giid*, that uniquely identifies the
callback throughout the program.  *J$.getGlobalIID(iid)* returns the string *J$.sid+":"+iid.  *J$.iidToLocation(giid) returns a string
containing the original script file path, begin and end line numbers and column numbers of the code snippet for which the callback with
*giid* was inserted.

A number of sample analyses can be found [here](../src/js/sample_analyses/).  Refer to [../README.md](../README.md) for instructions
on running an analysis.

