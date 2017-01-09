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


// wrap in anonymous function to create local namespace when in browser
// create / reset J$ global variable to hold analysis runtime
if (typeof J$ === 'undefined') {
    J$ = {};
}

(function (sandbox) {
    if (typeof sandbox.B !== 'undefined') {
        return;
    }
    //----------------------------------- Begin Jalangi Library backend ---------------------------------

    // stack of return values from instrumented functions.
    // we need to keep a stack since a function may return and then
    // have another function call in a finally block (see test
    // call_in_finally.js)

    var global = this;
    var Function = global.Function;
    var returnStack = [];
    var wrappedExceptionVal;
    var lastVal;
    var switchLeft;
    var switchKeyStack = [];
    var argIndex;
    var EVAL_ORG = eval;
    var lastComputedValue;
    var SPECIAL_PROP_SID = sandbox.Constants.SPECIAL_PROP_SID;
    var SPECIAL_PROP_IID = sandbox.Constants.SPECIAL_PROP_IID;

    function getPropSafe(base, prop){
      if(base === null || base === undefined){
        return undefined;
      }
      return base[prop];
    }

    function decodeBitPattern(i, len) {
        var ret = new Array(len);
        for (var j=0; j<len; j++) {
            var val = (i & 1)?true:false;
            ret[len - j -1] = val;
            i = i >> 1;
        }
        return ret;
    }

    function createBitPattern() {
        var ret = 0;
        var i;
        for (i =0; i< arguments.length; i++) {
            ret = (ret << 1)+(arguments[i]?1:0);
        }
        return ret;
    }


    var sidStack = [], sidCounter = 0;

    function createAndAssignNewSid() {
        sidStack.push(sandbox.sid);
        sandbox.sid = sidCounter = sidCounter + 1;
        if (!sandbox.smap) sandbox.smap = {};
        sandbox.smap[sandbox.sid] = sandbox.iids;
    }

    function rollBackSid() {
        sandbox.sid = sidStack.pop();
    }

    function associateSidWithFunction(f, iid) {
        if (typeof f === 'function') {
            if (Object && Object.defineProperty && typeof Object.defineProperty === 'function') {
                Object.defineProperty(f, SPECIAL_PROP_SID, {
                    enumerable:false,
                    writable:true
                });
                Object.defineProperty(f, SPECIAL_PROP_IID, {
                    enumerable:false,
                    writable:true
                });
            }
            f[SPECIAL_PROP_SID] = sandbox.sid;
            f[SPECIAL_PROP_IID] = iid;
        }
    }

    function updateSid(f) {
        sidStack.push(sandbox.sid);
        sandbox.sid = getPropSafe(f, SPECIAL_PROP_SID);
    }


    // unused
    function isNative(f) {
        return f.toString().indexOf('[native code]') > -1 || f.toString().indexOf('[object ') === 0;
    }

    function callAsNativeConstructorWithEval(Constructor, args) {
        var a = [];
        for (var i = 0; i < args.length; i++)
            a[i] = 'args[' + i + ']';
        var eval = EVAL_ORG;
        return eval('new Constructor(' + a.join() + ')');
    }

    function callAsNativeConstructor(Constructor, args) {
        if (args.length === 0) {
            return new Constructor();
        }
        if (args.length === 1) {
            return new Constructor(args[0]);
        }
        if (args.length === 2) {
            return new Constructor(args[0], args[1]);
        }
        if (args.length === 3) {
            return new Constructor(args[0], args[1], args[2]);
        }
        if (args.length === 4) {
            return new Constructor(args[0], args[1], args[2], args[3]);
        }
        if (args.length === 5) {
            return new Constructor(args[0], args[1], args[2], args[3], args[4]);
        }
        return callAsNativeConstructorWithEval(Constructor, args);
    }

    function callAsConstructor(Constructor, args) {
        var ret;
        if (true) {
            ret = callAsNativeConstructor(Constructor, args);
            return ret;
        } else { // else branch is a more elegant to call a constructor reflectively, but it leads to memory leak in v8.
            var Temp = function () {
            }, inst;
            Temp.prototype = Constructor.prototype;
            inst = new Temp;
            ret = Constructor.apply(inst, args);
            return Object(ret) === ret ? ret : inst;
        }
    }

    function invokeEval(base, f, args, iid) {
        return f(sandbox.instrumentEvalCode(args[0], iid, false));
    }

    function invokeFunctionDecl(base, f, args, iid) {
        // Invoke with the original parameters to preserve exceptional behavior if input is invalid
        f.apply(base, args);
        // Otherwise input is valid, so instrument and invoke via eval
        var newArgs = [];
        for (var i = 0; i < args.length-1; i++) {
            newArgs[i] = args[i];
        }
        var code = '(function(' + newArgs.join(', ') + ') { ' + args[args.length-1] + ' })';
        var code = sandbox.instrumentEvalCode(code, iid, false);
        // Using EVAL_ORG instead of eval() is important as it preserves the scoping semantics of Function()
        var out = EVAL_ORG(code);
        return out;
    }

    function callFun(f, base, args, isConstructor, iid) {
        var result;
        pushSwitchKey();
        try {
            if (f === EVAL_ORG) {
                result = invokeEval(base, f, args, iid);
            } else if (f === Function) {
                result = invokeFunctionDecl(base, f, args, iid);
            } else if (isConstructor) {
                result = callAsConstructor(f, args);
            } else {
                result = Function.prototype.apply.call(f, base, args);
            }
            return result;
        } finally {
            popSwitchKey();
        }
    }

    function invokeFun(iid, base, f, args, isConstructor, isMethod) {
        var aret, skip = false, result;

        if (sandbox.analysis && sandbox.analysis.invokeFunPre) {
            aret = sandbox.analysis.invokeFunPre(iid, f, base, args, isConstructor, isMethod, getPropSafe(f, SPECIAL_PROP_IID), getPropSafe(f, SPECIAL_PROP_SID));
            if (aret) {
                f = aret.f;
                base = aret.base;
                args = aret.args;
                skip = aret.skip;
            }
        }
        if (!skip) {
            result = callFun(f, base, args, isConstructor, iid);
        }
        if (sandbox.analysis && sandbox.analysis.invokeFun) {
            aret = sandbox.analysis.invokeFun(iid, f, base, args, result, isConstructor, isMethod, getPropSafe(f, SPECIAL_PROP_IID), getPropSafe(f, SPECIAL_PROP_SID));
            if (aret) {
                result = aret.result;
            }
        }
        return result;
    }

    // Function call (e.g., f())
    function F(iid, f, flags) {
        var bFlags = decodeBitPattern(flags, 1); // [isConstructor]
        return function () {
            var base = this;
            return (lastComputedValue = invokeFun(iid, base, f, arguments, bFlags[0], false));
        }
    }

    // Method call (e.g., e.f())
    function M(iid, base, offset, flags) {
        var bFlags = decodeBitPattern(flags, 2); // [isConstructor, isComputed]
        var f = G(iid + 2, base, offset, createBitPattern(bFlags[1], false, true));
        return function () {
            return (lastComputedValue = invokeFun(iid, base, f, arguments, bFlags[0], true));
        };
    }

    // Ignore argument (identity).
    function I(val) {
        return val;
    }

    var hasGetOwnPropertyDescriptor = typeof Object.getOwnPropertyDescriptor === 'function';
    // object/function/regexp/array Literal
    function T(iid, val, type, hasGetterSetter, internalIid) {
        var aret;
        associateSidWithFunction(val, internalIid);
        if (hasGetterSetter) {
            for (var offset in val) {
                if (hasGetOwnPropertyDescriptor && val.hasOwnProperty(offset)) {
                    var desc = Object.getOwnPropertyDescriptor(val, offset);
                    if (desc !== undefined) {
                        if (typeof desc.get === 'function') {
                            T(iid, desc.get, 12, false, internalIid);
                        }
                        if (typeof desc.set === 'function') {
                            T(iid, desc.set, 12, false, internalIid);
                        }
                    }
                }
            }
        }
        if (sandbox.analysis && sandbox.analysis.literal) {
            aret = sandbox.analysis.literal(iid, val, hasGetterSetter);
            if (aret) {
                val = aret.result;
            }
        }
        return (lastComputedValue = val);
    }

    // wrap object o in for (x in o) { ... }
    function H(iid, val) {
        var aret;
        if (sandbox.analysis && sandbox.analysis.forinObject) {
            aret = sandbox.analysis.forinObject(iid, val);
            if (aret) {
                val = aret.result;
            }
        }
        return val;
    }

    // variable declaration (Init)
    function N(iid, name, val, flags) {
        var bFlags = decodeBitPattern(flags, 3); // [isArgument, isLocalSync, isCatchParam]
        // isLocalSync is only true when we sync variables inside a for-in loop
        var aret;

        if (bFlags[0]) {
            argIndex++;
        }
        if (!bFlags[1] && sandbox.analysis && sandbox.analysis.declare) {
            if (bFlags[0] && argIndex > 1) {
                aret = sandbox.analysis.declare(iid, name, val, bFlags[0], argIndex - 2, bFlags[2]);
            } else {
                aret = sandbox.analysis.declare(iid, name, val, bFlags[0], -1, bFlags[2]);
            }
            if (aret) {
                val = aret.result;
            }
        }
        return val;
    }

    // getField (property read)
    function G(iid, base, offset, flags) {
        var bFlags = decodeBitPattern(flags, 3); // [isComputed, isOpAssign, isMethodCall]

        var aret, skip = false, val;

        if (sandbox.analysis && sandbox.analysis.getFieldPre) {
            aret = sandbox.analysis.getFieldPre(iid, base, offset, bFlags[0], bFlags[1], bFlags[2]);
            if (aret) {
                base = aret.base;
                offset = aret.offset;
                skip = aret.skip;
            }
        }

        if (!skip) {
            val = base[offset];
        }
        if (sandbox.analysis && sandbox.analysis.getField) {
            aret = sandbox.analysis.getField(iid, base, offset, val, bFlags[0], bFlags[1], bFlags[2]);
            if (aret) {
                val = aret.result;
            }
        }
        return (lastComputedValue = val);
    }

    // putField (property write)
    function P(iid, base, offset, val, flags) {
        var bFlags = decodeBitPattern(flags, 2); // [isComputed, isOpAssign]

        var aret, skip = false;

        if (sandbox.analysis && sandbox.analysis.putFieldPre) {
            aret = sandbox.analysis.putFieldPre(iid, base, offset, val, bFlags[0], !!bFlags[1]);
            if (aret) {
                base = aret.base;
                offset = aret.offset;
                val = aret.val;
                skip = aret.skip;
            }
        }

        if (!skip) {
            base[offset] = val;
        }
        if (sandbox.analysis && sandbox.analysis.putField) {
            aret = sandbox.analysis.putField(iid, base, offset, val, bFlags[0], !!bFlags[1]);
            if (aret) {
                val = aret.result;
            }
        }
        return (lastComputedValue = val);
    }

    // variable write
    // isGlobal means that the variable is global and not declared as var
    // isScriptLocal means that the variable is global and is declared as var
    function R(iid, name, val, flags) {
        var aret;
        var bFlags = decodeBitPattern(flags, 2); // [isGlobal, isScriptLocal]

        if (sandbox.analysis && sandbox.analysis.read) {
            aret = sandbox.analysis.read(iid, name, val, bFlags[0], bFlags[1]);
            if (aret) {
                val = aret.result;
            }
        }
        return (lastComputedValue = val);
    }

    // variable write
    function W(iid, name, val, lhs, flags) {
        var bFlags = decodeBitPattern(flags, 3); //[isGlobal, isScriptLocal, isDeclaration]
        var aret;
        if (sandbox.analysis && sandbox.analysis.write) {
            aret = sandbox.analysis.write(iid, name, val, lhs, bFlags[0], bFlags[1]);
            if (aret) {
                val = aret.result;
            }
        }
        if (!bFlags[2]) {
            return (lastComputedValue = val);
        } else {
            lastComputedValue = undefined;
            return val;
        }
    }

    // with statement
    function Wi(iid, val) {
        if (sandbox.analysis && sandbox.analysis._with) {
            aret = sandbox.analysis._with(iid, val);
            if (aret) {
                val = aret.result;
            }
        }
        return val;
    }

    // Uncaught exception
    function Ex(iid, e) {
        wrappedExceptionVal = {exception:e};
    }

    // Throw statement
    function Th(iid, val) {
        var aret;
        if (sandbox.analysis && sandbox.analysis._throw) {
            aret = sandbox.analysis._throw(iid, val);
            if (aret) {
                val = aret.result;
            }
        }
        return (lastComputedValue = val);
    }

    // Return statement
    function Rt(iid, val) {
        var aret;
        if (sandbox.analysis && sandbox.analysis._return) {
            aret = sandbox.analysis._return(iid, val);
            if (aret) {
                val = aret.result;
            }
        }
        returnStack.pop();
        returnStack.push(val);
        return (lastComputedValue = val);
    }

    // Actual return from function, invoked from 'finally' block
    // added around every function by instrumentation.  Reads
    // the return value stored by call to Rt()
    function Ra() {
        var returnVal = returnStack.pop();
        wrappedExceptionVal = undefined;
        return returnVal;
    }

    // Function enter
    function Fe(iid, f, dis /* this */, args) {
        argIndex = 0;
        returnStack.push(undefined);
        wrappedExceptionVal = undefined;
        updateSid(f);
        if (sandbox.analysis && sandbox.analysis.functionEnter) {
            sandbox.analysis.functionEnter(iid, f, dis, args);
        }
    }

    // Function exit
    function Fr(iid) {
        var isBacktrack = false, tmp, aret, returnVal;

        returnVal = returnStack.pop();
        if (sandbox.analysis && sandbox.analysis.functionExit) {
            aret = sandbox.analysis.functionExit(iid, returnVal, wrappedExceptionVal);
            if (aret) {
                returnVal = aret.returnVal;
                wrappedExceptionVal = aret.wrappedExceptionVal;
                isBacktrack = aret.isBacktrack;
            }
        }
        rollBackSid();
        if (!isBacktrack) {
            returnStack.push(returnVal);
        }
        // if there was an uncaught exception, throw it
        // here, to preserve exceptional control flow
        if (wrappedExceptionVal !== undefined) {
            tmp = wrappedExceptionVal.exception;
            wrappedExceptionVal = undefined;
            throw tmp;
        }
        return isBacktrack;
    }

    // Script enter
    function Se(iid, val, origFileName) {
        createAndAssignNewSid();
        if (sandbox.analysis && sandbox.analysis.scriptEnter) {
            sandbox.analysis.scriptEnter(iid, val, origFileName);
        }
        lastComputedValue = undefined;
    }

    // Script exit
    function Sr(iid) {
        var tmp, aret, isBacktrack;
        if (sandbox.analysis && sandbox.analysis.scriptExit) {
            aret = sandbox.analysis.scriptExit(iid, wrappedExceptionVal);
            if (aret) {
                wrappedExceptionVal = aret.wrappedExceptionVal;
                isBacktrack = aret.isBacktrack;
            }
        }
        rollBackSid();
        if (wrappedExceptionVal !== undefined) {
            tmp = wrappedExceptionVal.exception;
            wrappedExceptionVal = undefined;
            throw tmp;
        }
        return isBacktrack;
    }


    // Modify and assign +=, -= ...
    function A(iid, base, offset, op, flags) {
        var bFlags = decodeBitPattern(flags, 1); // [isComputed]
        // avoid iid collision: make sure that iid+2 has the same source map as iid (@todo)
        var oprnd1 = G(iid+2, base, offset, createBitPattern(bFlags[0], true, false));
        return function (oprnd2) {
            // still possible to get iid collision with a mem operation
            var val = B(iid, op, oprnd1, oprnd2, createBitPattern(false, true, false));
            return P(iid, base, offset, val, createBitPattern(bFlags[0], true));
        };
    }

    // Binary operation
    function B(iid, op, left, right, flags) {
        var bFlags = decodeBitPattern(flags, 3); // [isComputed, isOpAssign, isSwitchCaseComparison]
        var result, aret, skip = false;

        if (sandbox.analysis && sandbox.analysis.binaryPre) {
            aret = sandbox.analysis.binaryPre(iid, op, left, right, bFlags[1], bFlags[2], bFlags[0]);
            if (aret) {
                op = aret.op;
                left = aret.left;
                right = aret.right;
                skip = aret.skip;
            }
        }


        if (!skip) {
            switch (op) {
                case "+":
                    result = left + right;
                    break;
                case "-":
                    result = left - right;
                    break;
                case "*":
                    result = left * right;
                    break;
                case "/":
                    result = left / right;
                    break;
                case "%":
                    result = left % right;
                    break;
                case "<<":
                    result = left << right;
                    break;
                case ">>":
                    result = left >> right;
                    break;
                case ">>>":
                    result = left >>> right;
                    break;
                case "<":
                    result = left < right;
                    break;
                case ">":
                    result = left > right;
                    break;
                case "<=":
                    result = left <= right;
                    break;
                case ">=":
                    result = left >= right;
                    break;
                case "==":
                    result = left == right;
                    break;
                case "!=":
                    result = left != right;
                    break;
                case "===":
                    result = left === right;
                    break;
                case "!==":
                    result = left !== right;
                    break;
                case "&":
                    result = left & right;
                    break;
                case "|":
                    result = left | right;
                    break;
                case "^":
                    result = left ^ right;
                    break;
                case "delete":
                    result = delete left[right];
                    break;
                case "instanceof":
                    result = left instanceof right;
                    break;
                case "in":
                    result = left in right;
                    break;
                default:
                    throw new Error(op + " at " + iid + " not found");
                    break;
            }
        }

        if (sandbox.analysis && sandbox.analysis.binary) {
            aret = sandbox.analysis.binary(iid, op, left, right, result, bFlags[1], bFlags[2], bFlags[0]);
            if (aret) {
                result = aret.result;
            }
        }
        return (lastComputedValue = result);
    }


    // Unary operation
    function U(iid, op, left) {
        var result, aret, skip = false;

        if (sandbox.analysis && sandbox.analysis.unaryPre) {
            aret = sandbox.analysis.unaryPre(iid, op, left);
            if (aret) {
                op = aret.op;
                left = aret.left;
                skip = aret.skip
            }
        }

        if (!skip) {
            switch (op) {
                case "+":
                    result = +left;
                    break;
                case "-":
                    result = -left;
                    break;
                case "~":
                    result = ~left;
                    break;
                case "!":
                    result = !left;
                    break;
                case "typeof":
                    result = typeof left;
                    break;
                case "void":
                    result = void(left);
                    break;
                default:
                    throw new Error(op + " at " + iid + " not found");
                    break;
            }
        }

        if (sandbox.analysis && sandbox.analysis.unary) {
            aret = sandbox.analysis.unary(iid, op, left, result);
            if (aret) {
                result = aret.result;
            }
        }
        return (lastComputedValue = result);
    }

    function pushSwitchKey() {
        switchKeyStack.push(switchLeft);
    }

    function popSwitchKey() {
        switchLeft = switchKeyStack.pop();
    }

    function last() {
        return (lastComputedValue = lastVal);
    }

    // Switch key
    // E.g., for 'switch (x) { ... }',
    // C1 is invoked with value of x
    function C1(iid, left) {
        switchLeft = left;
        return (lastComputedValue = left);
    }

    // case label inside switch
    function C2(iid, right) {
        var aret, result;

        // avoid iid collision; iid may not have a map in the sourcemap
        result = B(iid+1, "===", switchLeft, right, createBitPattern(false, false, true));

        if (sandbox.analysis && sandbox.analysis.conditional) {
            aret = sandbox.analysis.conditional(iid, result);
            if (aret) {
                if (result && !aret.result) {
                    right = !right;
                } else if (result && aret.result) {
                    right = switchLeft;
                }
            }
        }
        return (lastComputedValue = right);
    }

    // Expression in conditional
    function C(iid, left) {
        var aret;
        if (sandbox.analysis && sandbox.analysis.conditional) {
            aret = sandbox.analysis.conditional(iid, left);
            if (aret) {
                left = aret.result;
            }
        }

        lastVal = left;
        return (lastComputedValue = left);
    }

    function S(iid, f) {
        if (sandbox.analysis && sandbox.analysis.runInstrumentedFunctionBody) {
            return sandbox.analysis.runInstrumentedFunctionBody(iid, f, getPropSafe(f, SPECIAL_PROP_IID), getPropSafe(f, SPECIAL_PROP_SID));
        }
        return true;
    }

    function L() {
        return lastComputedValue;
    }


    function X1(iid, val) {
        if (sandbox.analysis && sandbox.analysis.endExpression) {
            sandbox.analysis.endExpression(iid);
        }

        return (lastComputedValue = val);
    }

    function endExecution() {
        if (sandbox.analysis && sandbox.analysis.endExecution) {
            return sandbox.analysis.endExecution();
        }
    }


    function log(str) {
        if (sandbox.Results && sandbox.Results.execute) {
            sandbox.Results.execute(function(div, jquery, editor){
                div.append(str+"<br>");
            });
        } else {
            console.log(str);
        }
    }


    //----------------------------------- End Jalangi Library backend ---------------------------------

    sandbox.U = U; // Unary operation
    sandbox.B = B; // Binary operation
    sandbox.C = C; // Condition
    sandbox.C1 = C1; // Switch key
    sandbox.C2 = C2; // case label C1 === C2
    sandbox._ = last;  // Last value passed to C

    sandbox.H = H; // hash in for-in
    sandbox.I = I; // Ignore argument
    sandbox.G = G; // getField
    sandbox.P = P; // putField
    sandbox.R = R; // Read
    sandbox.W = W; // Write
    sandbox.N = N; // Init
    sandbox.T = T; // object/function/regexp/array Literal
    sandbox.F = F; // Function call
    sandbox.M = M; // Method call
    sandbox.A = A; // Modify and assign +=, -= ...
    sandbox.Fe = Fe; // Function enter
    sandbox.Fr = Fr; // Function return
    sandbox.Se = Se; // Script enter
    sandbox.Sr = Sr; // Script return
    sandbox.Rt = Rt; // returned value
    sandbox.Th = Th; // thrown value
    sandbox.Ra = Ra;
    sandbox.Ex = Ex;
    sandbox.L = L;
    sandbox.X1 = X1; // top level expression
    sandbox.Wi = Wi; // with statement
    sandbox.endExecution = endExecution;

    sandbox.S = S;

    sandbox.EVAL_ORG = EVAL_ORG;
    sandbox.log = log;
})(J$);

