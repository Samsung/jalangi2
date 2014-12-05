### Wrting a Jalangi2 analysis ###

analysis.js is a new API for performing direct or in browser analysis.  It has a clean, efficient, and less error-prone
API compared to analysis.js of Jalangi1.  An analysis in analysis.js can be written using the following template:

```

    // In the following callbacks one can choose to not return anything.
    // If all of the callbacks return nothing, we get a passive analysis where the
    // concrete execution happens unmodified and callbacks are used to observe the execution.
    // Once can choose to return suitable objects with specified fields in some callbacks
    // to modify the behavior of the concrete execution.  For example, one could set the skip
    // field of an object returned from putFieldPre to true to skip the actual putField operation.
    // Similarly, one could set the result field of the object returned from a write callback
    // to modify the value that is actually written to a variable. The result field of the object
    // returned from a conditional callback can be suitably set to change the control-flow of the
    // program execution.  In functionExit and scriptExit,
    // one can set the isBacktrack field of the returned object to true to reexecute the body of
    // the function from the beginning.  This in conjunction with the ability to change the
    // control-flow of a program enables us to explore the different paths of a function in
    // symbolic execution.

    (function (sandbox) {
      function MyAnalysis () {
        this.invokeFunPre = function(iid, f, base, args, isConstructor, isMethod){return {f:f,base:base,args:args,skip:false};};

        this.invokeFun = function(iid, f, base, args, result, isConstructor, isMethod){return {result:result};};

        this.literal = function(iid, val, hasGetterSetter) {return {result:val};};

        this.forinObject = function(iid, val){return {result:val};};

        this.declare = function (iid, name, val, isArgument, argumentIndex, isCatchParam){return {result:val};};

        this.getFieldPre = function(iid, base, offset, isComputed, isOpAssign, isMethodCall){return {base:base,offset:offset,skip:false};};

        this.getField = function(iid, base, offset, val, isComputed, isOpAssign, isMethodCall){return {result:val};};

        this.putFieldPre = function(iid, base, offset, val, isComputed, isOpAssign){return {base:base,offset:offset,val:val,skip:false};};

        this.putField = function(iid, base, offset, val, isComputed, isOpAssign){return {result:val};};

        this.read = function(iid, name, val, isGlobal, isPseudoGlobal){return {result:val};};

        this.write = function(iid, name, val, lhs, isGlobal, isPseudoGlobal) {return {result:val};};

        this.functionEnter = function (iid, f, dis, args){};

        this.functionExit = function(iid, returnVal, exceptionVal){return {returnVal:returnVal,exceptionVal:exceptionVal,isBacktrack:false};};

        this.scriptEnter = function(iid, instrumentedFileName, originalFileName){};

        this.scriptExit = function(iid, exceptionVal){return {exceptionVal:exceptionVal,isBacktrack:false};};

        this.binaryPre = function(iid, op, left, right, isOpAssign, isSwitchCaseComparison){return {op:op,left:left,right:right,skip:false};};

        this.binary = function(iid, op, left, right, result, isOpAssign, isSwitchCaseComparison){return {result:result};};

        this.unaryPre = function(iid, op, left) {return {op:op,left:left,skip:false};};

        this.unary = function(iid, op, left, result){return {result:result};};

        this.conditional = function(iid, result){return {result:result};};

        this.instrumentCodePre = function(iid, code){return {code:code,skip:false};};

        this.instrumentCode = function(iid, newCode, newAst){ return {result:newCode};};

        this.endExecution = function() {};
      }
      sandbox.analysis = new MyAnalysis();
    })(J$);

```

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

A number of sample analyses can be found [here](../src/js/sample_analyses/).  One can run a sample analysis as follows.

