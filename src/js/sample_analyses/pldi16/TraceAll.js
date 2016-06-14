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
 * @author  Koushik Sen
 *
 */

(function (sandbox) {

    if (sandbox.Constants.isBrowser) {
        sandbox.Results = {};
    }

    function MyAnalysis() {
        var MAX_STRING_LENGTH = 20;

        function getValue(v) {
            var type = typeof v;
            if ((type === 'object' || type ==='function') && v!== null) {
                var shadowObj = sandbox.smemory.getShadowObjectOfObject(v);
                return type+"(id="+sandbox.smemory.getIDFromShadowObjectOrFrame(shadowObj)+")";
            } else {
                if (type === 'string' && v.length> MAX_STRING_LENGTH) {
                    v = v.substring(0,MAX_STRING_LENGTH)+"...";
                }
                return JSON.stringify(v);
            }
        }

        function getFrameID(name) {
            return "frame(id="+sandbox.smemory.getIDFromShadowObjectOrFrame(sandbox.smemory.getShadowFrame(name))+")";
        }

        var indentationCount = 0;
        var cacheCount = 0;
        var cacheIndentStr = "";

        var logs = [];

        function log(str) {
            if (cacheCount !== indentationCount) {
                cacheIndentStr = "";
                for(var i=0; i<indentationCount; i++) {
                    cacheIndentStr += "    ";
                }
                cacheCount = indentationCount;
            }
            if (sandbox.Results) {
                logs.push("<li>" + cacheIndentStr.replace(/ /g, '\u00a0') +str+ " </li>");
            } else {
                console.log(cacheIndentStr + str)
            }
        }

        this.invokeFunPre = function (iid, f, base, args, isConstructor, isMethod, functionIid, functionSid) {
            var ret = "invokeFunPre(iid="+iid+", f="+getValue(f)+", base="+getValue(base);
            for(var i=0; i<args.length; i++) {
                ret += ", args["+i+"]="+getValue(args[i]);
            }
            ret += ", isConstructor="+isConstructor+", isMethod="+isMethod+", functionIid="+functionIid+", functionSid="+functionSid;
            ret += ") of function created at "+J$.iidToLocation(functionSid, functionIid);
            ret += " at " + J$.iidToLocation(J$.sid, iid);
            log(ret);
            indentationCount++;
            return {f: f, base: base, args: args, skip: false};
        };

        this.invokeFun = function (iid, f, base, args, result, isConstructor, isMethod, functionIid, functionSid) {
            indentationCount--;
            var ret = "invokeFun(iid="+iid+", f="+getValue(f)+", base="+getValue(base)+", result="+getValue(result);
            for(var i=0; i<args.length; i++) {
                ret += ", args["+i+"]="+getValue(args[i]);
            }
            ret += ", isConstructor="+isConstructor+", isMethod="+isMethod+", functionIid="+functionIid+", functionSid="+functionSid;
            ret += ") of function created at "+J$.iidToLocation(functionSid, functionIid);
            ret += " at " + J$.iidToLocation(J$.sid, iid);
            log(ret);
            return {result: result};
        };

        this.literal = function (iid, val, hasGetterSetter) {
            var ret = "literal(iid="+iid+", val="+getValue(val)+", hasGetterSetter="+hasGetterSetter;
            ret += ") at " + J$.iidToLocation(J$.sid, iid);
            log(ret);
            return {result: val};
        };

        this.forinObject = function (iid, val) {
            var ret = "forinObject(iid="+iid+", val="+getValue(val);
            ret += ") at " + J$.iidToLocation(J$.sid, iid);
            log(ret);
            return {result: val};
        };

        this.declare = function (iid, name, val, isArgument, argumentIndex, isCatchParam) {
            var ret = "declare(iid="+iid+", name="+name+", val="+getValue(val)+", isArgument="+isArgument+", argumentIndex="+argumentIndex+", isCatchParam="+isCatchParam;
            ret += ") at " + J$.iidToLocation(J$.sid, iid);
            log(ret);
            return {result: val};
        };

        this.getFieldPre = function (iid, base, offset, isComputed, isOpAssign, isMethodCall) {
            var actualObjectId = sandbox.smemory.getIDFromShadowObjectOrFrame(sandbox.smemory.getShadowObject(base, offset, true).owner);
            var ret = "getFieldPre(iid="+iid+", base="+getValue(base)+", offset="+getValue(offset+"")+
                ", isComputed="+isComputed+", isOpAssign="+isOpAssign+", isMethodCall="+isMethodCall+") with actualBase=object(id="+actualObjectId+")";
            ret += " at " + J$.iidToLocation(J$.sid, iid);
            log(ret);
            return {base: base, offset: offset, skip: false};
        };

        this.getField = function (iid, base, offset, val, isComputed, isOpAssign, isMethodCall) {
            var actualObjectId = sandbox.smemory.getIDFromShadowObjectOrFrame(sandbox.smemory.getShadowObject(base, offset, true).owner);
            var ret = "getField(iid="+iid+", base="+getValue(base)+", offset="+getValue(offset+"")+", val="+getValue(val)+
                ", isComputed="+isComputed+", isOpAssign="+isOpAssign+", isMethodCall="+isMethodCall+") with actualBase=object(id="+actualObjectId+")";
            ret += " at " + J$.iidToLocation(J$.sid, iid);
            log(ret);
            return {result: val};
        };

        this.putFieldPre = function (iid, base, offset, val, isComputed, isOpAssign) {
            var ret = "putFieldPre(iid="+iid+", base="+getValue(base)+", offset="+getValue(offset+"")+", val="+getValue(val)+", isComputed="+isComputed+", isOpAssign="+isOpAssign;
            ret += ") at " + J$.iidToLocation(J$.sid, iid);
            log(ret);
            return {base: base, offset: offset, val: val, skip: false};
        };

        this.putField = function (iid, base, offset, val, isComputed, isOpAssign) {
            var ret = "putField(iid="+iid+", base="+getValue(base)+", offset="+getValue(offset+"")+", val="+getValue(val)+", isComputed="+isComputed+", isOpAssign="+isOpAssign;
            ret += ") at " + J$.iidToLocation(J$.sid, iid);
            log(ret);
            return {result: val};
        };

        this.read = function (iid, name, val, isGlobal, isScriptLocal) {
            var ret = "read(iid="+iid+", name="+name+", val="+getValue(val)+", isGlobal="+isGlobal+", isScriptLocal="+isScriptLocal+") with frameId="+getFrameID(name);
            ret += " at " + J$.iidToLocation(J$.sid, iid);
            log(ret);
            return {result: val};
        };

        this.write = function (iid, name, val, lhs, isGlobal, isScriptLocal) {
            var ret = "write(iid="+iid+", name="+name+", val="+getValue(val)+", lhs="+getValue(lhs)+", isGlobal="+isGlobal+", isScriptLocal="+isScriptLocal+") with frameId="+getFrameID(name);
            ret += " at " + J$.iidToLocation(J$.sid, iid);
            log(ret);
            return {result: val};
        };

        this._return = function (iid, val) {
            var ret = "_return(iid="+iid+", val="+getValue(val);
            ret += ") at " + J$.iidToLocation(J$.sid, iid);
            log(ret);
            return {result: val};
        };

        this._throw = function (iid, val) {
            var ret = "_throw(iid="+iid+", val="+getValue(val);
            ret += ") at " + J$.iidToLocation(J$.sid, iid);
            log(ret);
            return {result: val};
        };

        this._with = function (iid, val) {
            var ret = "_with(iid="+iid+", val="+getValue(val);
            ret += ") at " + J$.iidToLocation(J$.sid, iid);
            log(ret);
            return {result: val};
        };

        this.functionEnter = function (iid, f, dis, args) {
            var ret = "functionEnter(iid="+iid+", f="+getValue(f)+", this="+getValue(dis);
            for(var i=0; i<args.length; i++) {
                ret += ", args["+i+"]="+getValue(args[i])+", ";
            }
            ret += ") with frameId="+getFrameID("this");
            ret += " at " + J$.iidToLocation(J$.sid, iid);
            log(ret);
        };

        this.functionExit = function (iid, returnVal, wrappedExceptionVal) {
            var ret = "functionExit(iid="+iid+", returnVal="+getValue(returnVal)+", wrappedExceptionVal="+(wrappedExceptionVal?("{exception: "+getValue(wrappedExceptionVal.exception)+"}"):"none");
            ret += ", frameId="+getFrameID("this");
            ret += ") at " + J$.iidToLocation(J$.sid, iid);
            log(ret);
            return {returnVal: returnVal, wrappedExceptionVal: wrappedExceptionVal, isBacktrack: false};
        };

        this.scriptEnter = function (iid, instrumentedFileName, originalFileName) {
            var ret = "scriptEnter(iid="+iid+", instrumentedFileName="+instrumentedFileName+", originalFileName="+originalFileName;
            ret += ") at " + J$.iidToLocation(J$.sid, iid);
            log(ret);
            indentationCount++;
        };

        this.scriptExit = function (iid, wrappedExceptionVal) {
            var ret = "scriptExit(iid="+iid+", wrappedExceptionVal="+(wrappedExceptionVal?("{exception:"+getValue(wrappedExceptionVal.exception)+"}"):"none");
            ret += ") at " + J$.iidToLocation(J$.sid, iid);
            log(ret);
            indentationCount--;
            return {wrappedExceptionVal: wrappedExceptionVal, isBacktrack: false};
        };

        this.binaryPre = function (iid, op, left, right, isOpAssign, isSwitchCaseComparison, isComputed) {
            var ret = "binaryPre(iid="+iid+", op=\""+op+"\", left="+getValue(left)+", right="+getValue(right)+", isOpAssign="+
                isOpAssign+", isSwitchCaseComparison="+isSwitchCaseComparison+", isComputed="+isComputed;
            ret += ") at " + J$.iidToLocation(J$.sid, iid);
            log(ret);
            return {op: op, left: left, right: right, skip: false};
        };

        this.binary = function (iid, op, left, right, result, isOpAssign, isSwitchCaseComparison, isComputed) {
            var ret = "binary(iid="+iid+", op=\""+op+"\", left="+getValue(left)+", right="+getValue(right)+", result="+getValue(result)+
                ", isOpAssign="+isOpAssign+", isSwitchCaseComparison="+isSwitchCaseComparison+", isComputed="+isComputed;
            ret += ") at " + J$.iidToLocation(J$.sid, iid);
            log(ret);
            return {result: result};
        };

        this.unaryPre = function (iid, op, left) {
            var ret = "unaryPre(iid="+iid+", op=\""+op+"\", left="+getValue(left);
            ret += ") at " + J$.iidToLocation(J$.sid, iid);
            log(ret);
            return {op: op, left: left, skip: false};
        };

        this.unary = function (iid, op, left, result) {
            var ret = "unary(iid="+iid+", op=\""+op+"\", left="+getValue(left)+", result="+getValue(result);
            ret += ") at " + J$.iidToLocation(J$.sid, iid);
            log(ret);
            return {result: result};
        };

        this.conditional = function (iid, result) {
            var ret = "conditional(iid="+iid+", result="+getValue(result);
            ret += ") at " + J$.iidToLocation(J$.sid, iid);
            log(ret);
            return {result: result};
        };

        this.instrumentCodePre = function (iid, code, isDirect) {
            var ret = "instrumentCodePre(iid="+iid+", code="+getValue(code)+", isDirect="+isDirect;
            ret += ") at " + J$.iidToLocation(J$.sid, iid);
            log(ret);
            return {code: code, skip: false};
        };

        this.instrumentCode = function (iid, newCode, newAst, isDirect) {
            var ret = "instrumentCode(iid="+iid+", newCode="+getValue(newCode)+", newAst="+getValue(newAst)+", isDirect="+isDirect;
            ret += ") at " + J$.iidToLocation(J$.sid, iid);
            log(ret);
            return {result: newCode};
        };

        this.endExpression = function (iid) {
            var ret = "endExpression(iid="+iid;
            ret += ") at " + J$.iidToLocation(J$.sid, iid);
            log(ret);
        };

        this.endExecution = function () {
            var ret = "endExpression()";
            log(ret);
            if (sandbox.Results) {
                for (var i = 0; i < logs.length; i++) {
                    sandbox.log(logs[i]);
                }
            }
        };

        this.runInstrumentedFunctionBody = function (iid, f, functionIid, functionSid) {
            var ret = "runInstrumentedFunctionBody(iid="+iid+", f="+getValue(f)+", functionIid="+functionIid+", functionSid="+functionSid;
            ret += ") of function created at "+J$.iidToLocation(functionSid, functionIid);
            ret += " at " + J$.iidToLocation(J$.sid, iid);

            return false;
        };

        this.onReady = function (cb) {
            cb();
        };
    }

    sandbox.analysis = new MyAnalysis();
})(J$);

/*
 node src/js/commands/jalangi.js --inlineIID --inlineSource --analysis src/js/sample_analyses/ChainedAnalyses.js --analysis src/js/runtime/SMemory.js --analysis src/js/sample_analyses/pldi16/TraceAll.js tests/pldi16/TraceAllTest.js
 node src/js/commands/esnstrument_cli.js --inlineIID --inlineSource --analysis src/js/sample_analyses/ChainedAnalyses.js --analysis src/js/runtime/SMemory.js --analysis src/js/sample_analyses/pldi16/TraceAll.js --out /tmp/pldi16/TraceAllTest.html  tests/pldi16/TraceAllTest.html
 node src/js/commands/esnstrument_cli.js --inlineIID --inlineSource --analysis src/js/sample_analyses/ChainedAnalyses.js --analysis src/js/runtime/SMemory.js --analysis src/js/sample_analyses/pldi16/TraceAll.js --out /tmp/pldi16/TraceAllTest.js  tests/pldi16/TraceAllTest.js
 open file:///tmp/pldi16/TraceAllTest.html
 */


