### analysis.js ###

analysis.js is a new API for performing direct or in browser analysis.  It has a clean, efficient, and less error-prone
API compared to analysis.js.  An analysis in analysis.js can be written using the following template:

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

        this.getFieldPre = function(iid, base, offset){return {base:base,offset:offset,skip:false};};

        this.getField = function(iid, base, offset, val){return {result:val};};

        this.putFieldPre = function(iid, base, offset, val){return {base:base,offset:offset,val:val,skip:false};};

        this.putField = function(iid, base, offset, val){return {result:val};};

        this.read = function(iid, name, val, isGlobal, isPseudoGlobal){return {result:val};};

        this.write = function(iid, name, val, lhs, isGlobal, isPseudoGlobal) {return {result:val};};

        this.functionEnter = function (iid, f, dis, args){};

        this.functionExit = function(iid, returnVal, exceptionVal){return {returnVal:returnVal,exceptionVal:exceptionVal,isBacktrack:false};};

        this.scriptEnter = function(iid, val){};

        this.scriptExit = function(iid, exceptionVal){return {exceptionVal:exceptionVal,isBacktrack:false};};

        this.binaryPre = function(iid, op, left, right){return {op:op,left:left,right:right,skip:false};};

        this.binary = function(iid, op, left, right, result){return {result:result};};

        this.unaryPre = function(iid, op, left) {return {op:op,left:left,skip:false};};

        this.unary = function(iid, op, left, result){return {result:result};};

        this.conditional = function(iid, result){return {result:result};};

        this.instrumentCodePre = function(iid, code){return {code:code,skip:false};};

        this.instrumentCode = function(iid, newCode, newAst){return {result:newCode};};

        this.endExecution = function() {};
     }
     sandbox.analysis = new MyAnalysis();
    })(J$);
```

An analysis can be performed on a JavaScript file by issuing the following commands:

    node src/js/instrument/esnstrument.js tests/octane/deltablue.js
	node src/js/commands/direct.js --analysis src/js/sample_analyses/ChainedAnalyses.js --analysis src/js/sample_analyses/dlint/Utils.js --analysis src/js/sample_analyses/dlint/CheckNaN.js --analysis src/js/sample_analyses/dlint/FunCalledWithMoreArguments.js --analysis src/js/sample_analyses/dlint/CompareFunctionWithPrimitives.js --analysis src/js/sample_analyses/dlint/ShadowProtoProperty.js --analysis src/js/sample_analyses/dlint/ConcatUndefinedToString.js --analysis src/js/sample_analyses/dlint/UndefinedOffset.js tests/octane/deltablue_jalangi_.js
	    
An analysis can be performed on an web app using the Chrome browser by issuing the following commands:

    node src/js/commands/instrument.js --analysis src/js/sample_analyses/ChainedAnalyses.js --analysis src/js/sample_analyses/dlint/Utils.js --analysis src/js/sample_analyses/dlint/CheckNaN.js --analysis src/js/sample_analyses/dlint/FunCalledWithMoreArguments.js --analysis src/js/sample_analyses/dlint/CompareFunctionWithPrimitives.js --analysis src/js/sample_analyses/dlint/ShadowProtoProperty.js --analysis src/js/sample_analyses/dlint/ConcatUndefinedToString.js --analysis src/js/sample_analyses/dlint/UndefinedOffset.js --outputDir /tmp tests/tizen/annex
    open file:///tmp/annex/index.html

While performing analysis in a browser, one needs to press Alt-Shift-T to end the analysis and to print the analysis results in the console.

