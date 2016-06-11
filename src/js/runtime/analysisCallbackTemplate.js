/*
 * Copyright 2014 Samsung Information Systems America, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Author: Koushik Sen

// do not remove the following comment
// JALANGI DO NOT INSTRUMENT

/**
 * @file A template for writing a Jalangi 2 analysis
 * @author  Koushik Sen
 *
 */

(function (sandbox) {
    /**
     * <p>
     *     This file is a template for writing a custom Jalangi 2 analysis.  Simply copy this file and rewrite the
     *     callbacks that you need to implement in your analysis.  Other callbacks should be removed from the file.
     *</p>
     *
     * <p>
     *     In the following methods (also called as callbacks) one can choose to not return anything.
     *     If all of the callbacks return nothing, we get a passive analysis where the
     *     concrete execution happens unmodified and callbacks can be used to observe the execution.
     *     One can choose to return suitable objects with specified properties in some callbacks
     *     to modify the behavior of the concrete execution.  For example, one could set the skip
     *     property of the object returned from {@link MyAnalysis#putFieldPre} to true to skip the actual putField operation.
     *     Similarly, one could set the result field of the object returned from a {@link MyAnalysis#write} callback
     *     to modify the value that is actually written to a variable. The result field of the object
     *     returned from a {@link MyAnalysis#conditional} callback can be suitably set to change the control-flow of the
     *     program execution.  In {@link MyAnalysis#functionExit} and {@link MyAnalysis#scriptExit},
     *     one can set the <tt>isBacktrack</tt> property of the returned object to true to reexecute the body of
     *     the function from the beginning.  This in conjunction with the ability to change the
     *     control-flow of a program enables us to explore the different paths of a function in
     *     symbolic execution.
     * </p>
     *
     * <p>
     *     Note that if <tt>process.exit()</tt> is called, then an execution terminates abnormally and a callback to
     *     {@link MyAnalysis#endExecution} will be skipped.
     * </p>
     *
     * <p>
     *     An analysis can access the source map, which maps instruction identifiers to source locations,
     *     using the global object stored in <code>J$.smap</code>.  Jalangi 2
     *     assigns a unique id, called <code>sid</code>, to each JavaScript
     *     script loaded at runtime.  <code>J$.smap</code> maps each <code>sid</code> to an object, say
     *     <code>iids</code>, containing source map information for the script whose id is <code>sid</code>.
     *     <code>iids</code> has the following properties: <code>"originalCodeFileName"</code> (stores the path of the original
     *     script file), <code>"instrumentedCodeFileName"</code> (stores the path of the instrumented script file),
     *     <code>"url"</code> (is optional and stores the URL of the script if it is set during instrumentation
     *     using the --url option),
     *     <code>"evalSid"</code> (stores the sid of the script in which the eval is called in case the current script comes from
     *     an <code>eval</code> function call),
     *     <code>"evalIid"</code> (iid of the <code>eval</code> function call in case the current script comes from an
     *     <code>eval</code> function call), <code>"nBranches"</code> (the number of conditional statements
     *     in the script),
     *     and <code>"code"</code> (a string denoting the original script code if the code is instrumented with the
     *     --inlineSource option).
     *     <code>iids</code> also maps each <code>iid</code> (which stands for instruction id, an unique id assigned
     *     to each callback function inserted by Jalangi2) to an array containing
     *     <code>[beginLineNumber, beginColumnNumber, endLineNumber, endColumnNumber]</code>.  The mapping from iids
     *     to arrays is only available if the code is instrumented with
     *     the --inlineIID option.
     * </p>
     * <p>
     *     In each callback described below, <code>iid</code> denotes the unique static instruction id of the callback in the script.
     *     Two callback functions inserted in two different scripts may have the same iid.  In a callback function, one can access
     *     the current script id using <code>J$.sid</code>.  One can call <code>J$.getGlobalIID(iid)</code> to get a string, called
     *     <code>giid</code>, that statically identifies the
     *     callback throughout the program.  <code>J$.getGlobalIID(iid)</code> returns the string <code>J$.sid+":"+iid</code>.
     *     <code>J$.iidToLocation(giid)</code> returns a string
     *     containing the original script file path, begin and end line numbers and column numbers of the code snippet
     *     for which the callback with <code>giid</code> was inserted.
     *
     * </p>
     * <p>
     *     A number of sample analyses can be found at {@link ../src/js/sample_analyses/}.  Refer to {@link ../README.md} for instructions
     *     on running an analysis.
     * </p>
     *
     *
     *
     * @global
     * @class
     */
    function MyAnalysis() {
        /**
         * This callback is called before a function, method, or constructor invocation.
         * Note that a method invocation also triggers a {@link MyAnalysis#getFieldPre} and a
         * {@link MyAnalysis#getField} callbacks.
         *
         * @example
         * y.f(a, b, c)
         *
         * // the above call roughly gets instrumented as follows:
         *
         * var skip = false;
         * var aret = analysis.invokeFunPre(113, f, y, [a, b, c], false, true);
         * if (aret) {
         *     f = aret.f;
         *     y = aret.y;
         *     args = aret.args;
         *     skip = aret.skip
         * }
         * if (!skip) {
         *     f.apply(y, args);
         * }
         *
         * @param {number} iid - Static unique instruction identifier of this callback
         * @param {function} f - The function object that going to be invoked
         * @param {object} base - The receiver object for the function <tt>f</tt>
         * @param {Array} args - The array of arguments passed to <tt>f</tt>
         * @param {boolean} isConstructor - True if <tt>f</tt> is invoked as a constructor
         * @param {boolean} isMethod - True if <tt>f</tt> is invoked as a method
         * @param {number} functionIid - The iid (i.e. the unique instruction identifier) where the function was created
         * @param {number} functionSid - The sid (i.e. the unique script identifier) where the function was created
         * {@link MyAnalysis#functionEnter} when the function <tt>f</tt> is executed.  The <tt>functionIid</tt> can be
         * treated as the static identifier of the function <tt>f</tt>.  Note that a given function code block can
         * create several function objects, but each such object has a common <tt>functionIid</tt>, which is the iid
         * that is passed to {@link MyAnalysis#functionEnter} when the function executes.
         * @returns {{f: function, base: Object, args: Array, skip: boolean}|undefined} - If an object is returned and
         * the <tt>skip</tt> property of the object is true, then the invocation operation is skipped.
         * Original <tt>f</tt>, <tt>base</tt>, and <tt>args</tt> are replaced with that from the returned object if
         * an object is returned.
         *
         */
        this.invokeFunPre = function (iid, f, base, args, isConstructor, isMethod, functionIid, functionSid) {
            return {f: f, base: base, args: args, skip: false};
        };

        /**
         * This callback is called after a function, method, or constructor invocation.
         *
         * @example
         * x = y.f(a, b, c)
         *
         * // the above call roughly gets instrumented as follows:
         *
         * var skip = false;
         * var aret = analysis.invokeFunPre(113, f, y, [a, b, c], false, true);
         * if (aret) {
         *     f = aret.f;
         *     y = aret.y;
         *     args = aret.args;
         *     skip = aret.skip
         * }
         * if (!skip) {
         *     result =f.apply(y, args);
         * }
         * aret = analysis.invokeFun(117, f, y, args, result, false, true);
         * if (aret) {
         *     x = aret.result
         * } else {
         *     x = result;
         * }
         *
         * @param {number} iid - Static unique instruction identifier of this callback
         * @param {function} f - The function object that was invoked
         * @param {*} base - The receiver object for the function <tt>f</tt>
         * @param {Array} args - The array of arguments passed to <tt>f</tt>
         * @param {*} result - The value returned by the invocation
         * @param {boolean} isConstructor - True if <tt>f</tt> is invoked as a constructor
         * @param {boolean} isMethod - True if <tt>f</tt> is invoked as a method
         * @param {number} functionIid - The iid (i.e. the unique instruction identifier) where the function was created
         * @param {number} functionSid - The sid (i.e. the unique script identifier) where the function was created
         * {@link MyAnalysis#functionEnter} when the function f is executed.  <tt>functionIid</tt> can be treated as the
         * static identifier of the function <tt>f</tt>.  Note that a given function code block can create several function
         * objects, but each such object has a common <tt>functionIid</tt>, which is the iid that is passed to
         * {@link MyAnalysis#functionEnter} when the function executes.
         * @returns {{result: *}| undefined} - If an object is returned, the return value of the invoked function is
         * replaced with the value stored in the <tt>result</tt> property of the object.  This enables one to change the
         * value that is returned by the actual function invocation.
         *
         */
        this.invokeFun = function (iid, f, base, args, result, isConstructor, isMethod, functionIid, functionSid) {
            return {result: result};
        };

        /**
         * This callback is called after the creation of a literal.  A literal can be a function literal, an object literal,
         * an array literal, a number, a string, a boolean, a regular expression, null, NaN, Infinity, or undefined.
         *
         * @example
         * x = "Hello"
         *
         * // the above call roughly gets instrumented as follows:
         *
         * var result = "Hello";
         * var aret = analysis.literal(201, result, false);
         * if (aret) {
         *     result = aret.result;
         * }
         * x = result;
         *
         *
         * @param {number} iid - Static unique instruction identifier of this callback
         * @param {*} val - The literal value
         * @param {boolean} hasGetterSetter - True if the literal is an object and the object defines getters and setters
         * @returns {{result: *} | undefined} - If the function returns an object, then the original literal value is
         * replaced with the value stored in the <tt>result</tt> property of the object.
         *
         */
        this.literal = function (iid, val, hasGetterSetter) {
            return {result: val};
        };

        /**
         * This callback is called when a for-in loop is used to iterate the properties of an object.
         *
         *@example
         * for (x in y) { }
         *
         * // the above call roughly gets instrumented as follows:
         *
         * var aret = analysis.forinObject(iid, y);
         * if (aret) {
         *     y = aret.result;
         * }
         * for (x in y) {}
         *
         * @param {number} iid - Static unique instruction identifier of this callback
         * @param {*} val - Objects whose properties are iterated in a for-in loop.
         * @returns {{result: *} | undefined} - If the function returns an object, then the original object whose
         * properties are being iterated is replaced with the value stored in the <tt>result</tt> property of the
         * returned object.
         *
         */
        this.forinObject = function (iid, val) {
            return {result: val};
        };

        /**
         * This callback is triggered at the beginning of a scope for every local variable declared in the scope, for
         * every formal parameter, for every function defined using a function statement, for <tt>arguments</tt>
         * variable, and for the formal parameter passed in a catch statement.
         *
         * @param {number} iid - Static unique instruction identifier of this callback
         * @param {string} name - Name of the variable that is declared
         * @param {*} val - Initial value of the variable that is declared.  Variables can be local variables, function
         * parameters, catch parameters, <tt>arguments</tt>, or functions defined using function statements.  Variables
         * declared with <tt>var</tt> have <tt>undefined</tt> as initial values and cannot be changed by returning a
         * different value from this callback.  On the beginning of an execution of a function, a <tt>declare</tt>
         * callback is called on the <tt>arguments</tt> variable.
         * @param {boolean} isArgument - True if the variable is <tt>arguments</tt> or a formal parameter.
         * @param {number} argumentIndex - Index of the argument in the function call.  Indices start from 0.  If the
         * variable is not a formal parameter, then <tt>argumentIndex</tt> is -1.
         * @param {boolean} isCatchParam - True if the variable is a parameter of a catch statement.
         * @returns {{result: *} | undefined} - If the function returns an object, then the original initial value is
         * replaced with the value stored in the <tt>result</tt> property of the object.  This does not apply to local
         * variables declared with <tt>var</tt>.
         *
         */
        this.declare = function (iid, name, val, isArgument, argumentIndex, isCatchParam) {
            return {result: val};
        };

        /**
         * This callback is called before a property of an object is accessed.
         *
         * @param {number} iid - Static unique instruction identifier of this callback
         * @param {*} base - Base object
         * @param {string|*} offset - Property
         * @param {boolean} isComputed - True if property is accessed using square brackets.  For example,
         * <tt>isComputed</tt> is <tt>true</tt> if the get field operation is <tt>o[p]</tt>, and <tt>false</tt>
         * if the get field operation is <tt>o.p</tt>
         * @param {boolean} isOpAssign - True if the operation is of the form <code>o.p op= e</code>
         * @param {boolean} isMethodCall - True if the get field operation is part of a method call (e.g. <tt>o.p()</tt>)
         * @returns {{base: *, offset: *, skip: boolean} | undefined} - If an object is returned and the <tt>skip</tt>
         * property of the object is true, then the get field operation is skipped.  Original <tt>base</tt> and
         * <tt>offset</tt> are replaced with that from the returned object if an object is returned.
         *
         */
        this.getFieldPre = function (iid, base, offset, isComputed, isOpAssign, isMethodCall) {
            return {base: base, offset: offset, skip: false};
        };

        /**
         * This callback is called after a property of an object is accessed.
         *
         * @param {number} iid - Static unique instruction identifier of this callback
         * @param {*} base - Base object
         * @param {string|*} offset - Property
         * @param {*} val - Value of <code>base[offset]</code>
         * @param {boolean} isComputed - True if property is accessed using square brackets.  For example,
         * <tt>isComputed</tt> is <tt>true</tt> if the get field operation is <tt>o[p]</tt>, and <tt>false</tt>
         * if the get field operation is <tt>o.p</tt>
         * @param {boolean} isOpAssign - True if the operation is of the form <code>o.p op= e</code>
         * @param {boolean} isMethodCall - True if the get field operation is part of a method call (e.g. <tt>o.p()</tt>)
         * @returns {{result: *} | undefined} - If an object is returned, the value of the get field operation  is
         * replaced with the value stored in the <tt>result</tt> property of the object.
         */
        this.getField = function (iid, base, offset, val, isComputed, isOpAssign, isMethodCall) {
            return {result: val};
        };

        /**
         * This callback is called before a property of an object is written.
         *
         * @param {number} iid - Static unique instruction identifier of this callback
         * @param {*} base - Base object
         * @param {*} offset - Property
         * @param {*} val - Value to be stored in <code>base[offset]</code>
         * @param {boolean} isComputed - True if property is accessed using square brackets.  For example,
         * <tt>isComputed</tt> is <tt>true</tt> if the get field operation is <tt>o[p]</tt>, and <tt>false</tt>
         * if the get field operation is <tt>o.p</tt>
         * @param {boolean} isOpAssign - True if the operation is of the form <code>o.p op= e</code>
         * @returns {{base: *, offset: *, val: *, skip: boolean} | undefined} -  If an object is returned and the <tt>skip</tt>
         * property is true, then the put field operation is skipped.  Original <tt>base</tt>, <tt>offset</tt>, and
         * <tt>val</tt> are replaced with that from the returned object if an object is returned.
         */
        this.putFieldPre = function (iid, base, offset, val, isComputed, isOpAssign) {
            return {base: base, offset: offset, val: val, skip: false};
        };

        /**
         * This callback is called after a property of an object is written.
         *
         * @param {number} iid - Static unique instruction identifier of this callback
         * @param {*} base - Base object
         * @param {*} offset - Property
         * @param {*} val - Value to be stored in <code>base[offset]</code>
         * @param {boolean} isComputed - True if property is accessed using square brackets.  For example,
         * <tt>isComputed</tt> is <tt>true</tt> if the get field operation is <tt>o[p]</tt>, and <tt>false</tt>
         * if the get field operation is <tt>o.p</tt>
         * @param {boolean} isOpAssign - True if the operation is of the form <code>o.p op= e</code>
         * @returns {{result: *} | undefined} -   If an object is returned, the result of the put field operation is
         * replaced with the value stored in the <tt>result</tt> property of the object.
         */
        this.putField = function (iid, base, offset, val, isComputed, isOpAssign) {
            return {result: val};
        };

        /**
         * This callback is called after a variable is read.
         *
         * @param {number} iid - Static unique instruction identifier of this callback
         * @param {string} name - Name of the variable being read
         * @param {*} val - Value read from the variable
         * @param {boolean} isGlobal - True if the variable is not declared using <tt>var</tt> (e.g. <tt>console</tt>)
         * @param {boolean} isScriptLocal - True if the variable is declared in the global scope using <tt>var</tt>
         * @returns {{result: *} | undefined} - If an object is returned, the result of the read operation is
         * replaced with the value stored in the <tt>result</tt> property of the object.
         */
        this.read = function (iid, name, val, isGlobal, isScriptLocal) {
            return {result: val};
        };

        /**
         * This callback is called before a variable is written.
         *
         * @param {number} iid - Static unique instruction identifier of this callback
         * @param {string} name - Name of the variable being read
         * @param {*} val - Value to be written to the variable
         * @param {*} lhs - Value stored in the variable before the write operation
         * @param {boolean} isGlobal - True if the variable is not declared using <tt>var</tt> (e.g. <tt>console</tt>)
         * @param {boolean} isScriptLocal - True if the variable is declared in the global scope using <tt>var</tt>
         * @returns {{result: *} | undefined} - If an object is returned, the result of the write operation is
         * replaced with the value stored in the <tt>result</tt> property of the object.
         */
        this.write = function (iid, name, val, lhs, isGlobal, isScriptLocal) {
            return {result: val};
        };

        /**
         * This callback is called before a value is returned from a function using the <tt>return</tt> keyword.
         *
         * @param {number} iid - Static unique instruction identifier of this callback
         * @param {*} val - Value to be returned
         * @returns {{result: *} | undefined} - If an object is returned, the value to be returned is
         * replaced with the value stored in the <tt>result</tt> property of the object.
         */
        this._return = function (iid, val) {
            return {result: val};
        };

        /**
         * This callback is called before a value is thrown using the <tt>throw</tt> keyword.
         *
         * @param {number} iid - Static unique instruction identifier of this callback
         * @param {*} val - Value to be thrown
         * @returns {{result: *} | undefined} - If an object is returned, the value to be thrown is
         * replaced with the value stored in the <tt>result</tt> property of the object.
         */
        this._throw = function (iid, val) {
            return {result: val};
        };

        /**
         * This callback is called when a <tt>with</tt> statement is executed
         *
         * @param {number} iid - Static unique instruction identifier of this callback
         * @param {*} val - Value used as an argument to <tt>with</tt>
         * @returns {{result: *} | undefined} - If an object is returned, the value to be used in <tt>with</tt> is
         * replaced with the value stored in the <tt>result</tt> property of the object.
         */
        this._with = function (iid, val) {
            return {result: val};
        };

        /**
         * This callback is called before the execution of a function body starts.
         *
         * @param {number} iid - Static unique instruction identifier of this callback
         * @param {function} f - The function object whose body is about to get executed
         * @param {*} dis - The value of the <tt>this</tt> variable in the function body
         * @param {Array} args - List of the arguments with which the function is called
         * @returns {undefined} - Any return value is ignored
         */
        this.functionEnter = function (iid, f, dis, args) {
        };

        /**
         * This callback is called when the execution of a function body completes
         *
         * @param {number} iid - Static unique instruction identifier of this callback
         * @param {*} returnVal - The value returned by the function
         * @param {{exception:*} | undefined} wrappedExceptionVal - If this parameter is an object, the function
         * execution has thrown an uncaught exception and the exception is being stored in the <tt>exception</tt>
         * property of the parameter
         * @returns {{returnVal: *, wrappedExceptionVal: *, isBacktrack: boolean}}  If an object is returned, then the
         * actual <tt>returnVal</tt> and <tt>wrappedExceptionVal.exception</tt> are replaced with that from the
         * returned object. If an object is returned and the property <tt>isBacktrack</tt> is set, then the control-flow
         * returns to the beginning of the function body instead of returning to the caller.  The property
         * <tt>isBacktrack</tt> can be set to <tt>true</tt> to repeatedly execute the function body as in MultiSE
         * symbolic execution.
         */
        this.functionExit = function (iid, returnVal, wrappedExceptionVal) {
            return {returnVal: returnVal, wrappedExceptionVal: wrappedExceptionVal, isBacktrack: false};
        };

        /**
         * This callback is called before the execution of a JavaScript file
         *
         * @param {number} iid - Static unique instruction identifier of this callback
         * @param {string} instrumentedFileName - Name of the instrumented script file
         * @param {string} originalFileName - Name of the original script file
         */
        this.scriptEnter = function (iid, instrumentedFileName, originalFileName) {
        };

        /**
         * This callback is called when the execution of a JavaScript file completes
         *
         * @param {number} iid - Static unique instruction identifier of this callback
         * @param {{exception:*} | undefined} wrappedExceptionVal - If this parameter is an object, the script
         * execution has thrown an uncaught exception and the exception is being stored in the <tt>exception</tt>
         * property of the parameter
         * @returns {{wrappedExceptionVal: *, isBacktrack: boolean}} - If an object is returned, then the
         * actual <tt>wrappedExceptionVal.exception</tt> is replaced with that from the
         * returned object. If an object is returned and the property <tt>isBacktrack</tt> is set, then the control-flow
         * returns to the beginning of the script body.  The property
         * <tt>isBacktrack</tt> can be set to <tt>true</tt> to repeatedly execute the script body as in MultiSE
         * symbolic execution.
         */
        this.scriptExit = function (iid, wrappedExceptionVal) {
            return {wrappedExceptionVal: wrappedExceptionVal, isBacktrack: false};
        };

        /**
         * This callback is called before a binary operation. Binary operations include  +, -, *, /, %, &, |, ^,
         * <<, >>, >>>, <, >, <=, >=, ==, !=, ===, !==, instanceof, delete, in.  No callback for <code>delete x</code>
         * because this operation cannot be performed reflectively.
         *
         * @param {number} iid - Static unique instruction identifier of this callback
         * @param {string} op - Operation to be performed
         * @param {*} left - Left operand
         * @param {*} right - Right operand
         * @param {boolean} isOpAssign - True if the binary operation is part of an expression of the form
         * <code>x op= e</code>
         * @param {boolean} isSwitchCaseComparison - True if the binary operation is part of comparing the discriminant
         * with a consequent in a switch statement.
         * @param {boolean} isComputed - True if the operation is of the form <code>delete x[p]</code>, and false
         * otherwise (even if the operation if of the form <code>delete x.p</code>)
         * @returns {{op: string, left: *, right: *, skip: boolean}|undefined} - If an object is returned and the
         * <tt>skip</tt> property is true, then the binary operation is skipped.  Original <tt>op</tt>, <tt>left</tt>,
         * and <tt>right</tt> are replaced with that from the returned object if an object is returned.
         */
        this.binaryPre = function (iid, op, left, right, isOpAssign, isSwitchCaseComparison, isComputed) {
            return {op: op, left: left, right: right, skip: false};
        };

        /**
         * This callback is called after a binary operation. Binary operations include  +, -, *, /, %, &, |, ^,
         * <<, >>, >>>, <, >, <=, >=, ==, !=, ===, !==, instanceof, delete, in.
         *
         * @param {number} iid - Static unique instruction identifier of this callback
         * @param {string} op - Operation to be performed
         * @param {*} left - Left operand
         * @param {*} right - Right operand
         * @param {*} result - The result of the binary operation
         * @param {boolean} isOpAssign - True if the binary operation is part of an expression of the form
         * <code>x op= e</code>
         * @param {boolean} isSwitchCaseComparison - True if the binary operation is part of comparing the discriminant
         * with a consequent in a switch statement.
         * @param {boolean} isComputed - True if the operation is of the form <code>delete x[p]</code>, and false
         * otherwise (even if the operation if of the form <code>delete x.p</code>)
         * @returns {{result: *}|undefined} - If an object is returned, the result of the binary operation is
         * replaced with the value stored in the <tt>result</tt> property of the object.
         */
        this.binary = function (iid, op, left, right, result, isOpAssign, isSwitchCaseComparison, isComputed) {
            return {result: result};
        };

        /**
         * This callback is called before a unary operation. Unary operations include  +, -, ~, !, typeof, void.
         *
         * @param {number} iid - Static unique instruction identifier of this callback
         * @param {string} op - Operation to be performed
         * @param {*} left - Left operand
         * @returns {{op: *, left: *, skip: boolean} | undefined} If an object is returned and the
         * <tt>skip</tt> property is true, then the unary operation is skipped.  Original <tt>op</tt> and <tt>left</tt>
         * are replaced with that from the returned object if an object is returned.
         */
        this.unaryPre = function (iid, op, left) {
            return {op: op, left: left, skip: false};
        };

        /**
         * This callback is called after a unary operation. Unary operations include  +, -, ~, !, typeof, void.
         *
         * @param {number} iid - Static unique instruction identifier of this callback
         * @param {string} op - Operation to be performed
         * @param {*} left - Left operand
         * @param {*} result - The result of the unary operation
         * @returns {{result: *}|undefined} - If an object is returned, the result of the unary operation is
         * replaced with the value stored in the <tt>result</tt> property of the object.
         *
         */
        this.unary = function (iid, op, left, result) {
            return {result: result};
        };

        /**
         * This callback is called after a condition check before branching. Branching can happen in various statements
         * including if-then-else, switch-case, while, for, ||, &&, ?:.
         *
         * @param {number} iid - Static unique instruction identifier of this callback
         * @param {*} result - The value of the conditional expression
         * @returns {{result: *}|undefined} - If an object is returned, the result of the conditional expression is
         * replaced with the value stored in the <tt>result</tt> property of the object.
         */
        this.conditional = function (iid, result) {
            return {result: result};
        };

        /**
         * This callback is called before a string passed as an argument to eval or Function is instrumented.
         *
         * @param {number} iid - Static unique instruction identifier of this callback
         * @param {*} code - Code that is going to get instrumented
         * @param {boolean} isDirect - true if this is a direct call to eval
         * @returns {{code: *, skip: boolean}} - If an object is returned and the
         * <tt>skip</tt> property is true, then the instrumentation of <tt>code</tt> is skipped.
         * Original <tt>code</tt> is replaced with that from the returned object if an object is returned.
         */
        this.instrumentCodePre = function (iid, code, isDirect) {
            return {code: code, skip: false};
        };

        /**
         * This callback is called after a string passed as an argument to eval or Function is instrumented.
         *
         * @param {number} iid - Static unique instruction identifier of this callback
         * @param {*} newCode - Instrumented code
         * @param {Object} newAst - The AST of the instrumented code
         * @param {boolean} isDirect - true if this is a direct call to eval
         * @returns {{result: *}|undefined} - If an object is returned, the instrumented code is
         * replaced with the value stored in the <tt>result</tt> property of the object.
         */
        this.instrumentCode = function (iid, newCode, newAst, isDirect) {
            return {result: newCode};
        };

        /**
         * This callback is called when an expression is evaluated and its value is discarded.  For example, this
         * callback is called when an expression statement completes its execution.
         *
         * @param {number} iid - Static unique instruction identifier of this callback
         * @returns {undefined} - Any return value is ignored
         */
        this.endExpression = function (iid) {
        };

        /**
         * This callback is called when an execution terminates in node.js.  In a browser environment, the callback is
         * called if ChainedAnalyses.js or ChainedAnalysesNoCheck.js is used and Alt-Shift-T is pressed.
         *
         * @returns {undefined} - Any return value is ignored
         */
        this.endExecution = function () {
        };

        /**
         * This callback is called only when instrumented with J$.Config.ENABLE_SAMPLING = true
         * This callback is called before the body of a function, method, or constructor is executed
         * if returns true, instrumented function body is executed, else uninstrumented function body is executed
         * @param {number} iid - Static unique instruction identifier of this callback
         * @param {function} f - The function whose body is being executed
         * @param {number} functionIid - The iid (i.e. the unique instruction identifier) where the function was created
         * @param {number} functionSid - The sid (i.e. the unique script identifier) where the function was created
         * {@link MyAnalysis#functionEnter} when the function <tt>f</tt> is executed.  The <tt>functionIid</tt> can be
         * treated as the static identifier of the function <tt>f</tt>.  Note that a given function code block can
         * create several function objects, but each such object has a common <tt>functionIid</tt>, which is the iid
         * that is passed to {@link MyAnalysis#functionEnter} when the function executes.
         * @returns {boolean} - If true is returned the instrumented function body is executed, otherwise the
         * uninstrumented function body is executed.
         */
        this.runInstrumentedFunctionBody = function (iid, f, functionIid, functionSid) {
            return false;
        };

        /**
         * onReady is useful if your analysis is running on node.js (i.e., via the direct.js or jalangi.js commands)
         * and needs to complete some asynchronous initialization before the instrumented program starts.  In such a
         * case, once the initialization is complete, invoke the cb function to start execution of the instrumented
         * program.
         *
         * Note that this callback is not useful in the browser, as Jalangi has no control over when the
         * instrumented program runs there.
         * @param cb
         */
        this.onReady = function (cb) {
            cb();
        };
    }

    sandbox.analysis = new MyAnalysis();
})(J$);



