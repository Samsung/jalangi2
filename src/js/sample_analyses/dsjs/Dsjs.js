/*
 * Copyright (c) 2014 Samsung Electronics Co., Ltd.
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

// run the following in the JALANGI_HOME directory
// python scripts/dsjs.py tests/octane/richards; open jalangi_tmp/index.html

(function (sandbox) {
    var Constants = sandbox.Constants;
    var iidToLocation = sandbox.iidToLocation;

    var SPECIAL_PROP = Constants.SPECIAL_PROP + "M";
    var objectId = 1;
    var HOP = Constants.HOP;
    var hasGetterSetter = Constants.hasGetterSetter;
    var scriptName;

    function isArr(obj) {
        return Array.isArray(obj) || (obj && obj.constructor && (obj instanceof Uint8Array || obj instanceof Uint16Array ||
            obj instanceof Uint32Array || obj instanceof Uint8ClampedArray ||
            obj instanceof ArrayBuffer || obj instanceof Int8Array || obj instanceof Int16Array ||
            obj instanceof Int32Array || obj instanceof Float32Array || obj instanceof Float64Array));
    }

    function isNormalNumber(num) {
        if (typeof num === 'number' && !isNaN(num)) {
            return true;
        } else if (typeof num === 'string' && (this.parseInt(num) + "" === num)) {
            return true;
        }
        return false;
    }

    function createShadowObject(iid, val) {
        var type = typeof val;
        if ((type === 'object' || type === 'function') && val !== null && !HOP(val, SPECIAL_PROP)) {
            if (Object && Object.defineProperty && typeof Object.defineProperty === 'function') {
                Object.defineProperty(val, SPECIAL_PROP, {
                    enumerable:false,
                    writable:true
                });
            }
            try {
                val[SPECIAL_PROP] = Object.create(null);
                val[SPECIAL_PROP][SPECIAL_PROP] = objectId;
                objectId = objectId + 2;
                val[SPECIAL_PROP].iid = iid;
            } catch (e) {
                // cannot attach special field in some DOM Objects.  So ignore them.
            }
        }

    }

    function getShadowObject(iid, val) {
        var value;
        createShadowObject(iid, val);
        var type = typeof val;
        if ((type === 'object' || type === 'function') && val !== null && HOP(val, SPECIAL_PROP)) {
            value = val[SPECIAL_PROP];
        } else {
            value = undefined;
        }
        return value;
    }

    var info = {};

    function incOld(hash, property) {
        hash[property] = (hash[property]|0) + 1;
    }

    function inc(hash) {
        var i, len = arguments.length, map = hash, info, key;
        for (i = 1; i < len; i++) {
            key = arguments[i];
            if (!(info = map[key])) {
                info = map[key] = {count: 0};
            }
            info.count++;
            if (i < len - 1 && !HOP(info, "details")) {
                info.details = {};
            }
            map = info.details;
        }
    }


    function updateSObjArrayNonUniformity(iid, sobj, elem) {
        if (!sobj.typeInitialized) {
            sobj.type = typeof elem;
            sobj.typeInitialized = true;
            sobj.isUniform = true;
        } else if (sobj.isUniform) {
            sobj.isUniform = (sobj.type == (typeof elem));
            if (!sobj.isUniform) {
                inc(info, "# of instructions at which an array becomes nonuniform", "times allocated at IID:" + sobj.iid, "times get nonuniform at IID:" + iid);
            }
        }
    }

    function updateSObjObjectNonUniformity(iid, sobj, elem) {
        if (sobj && sobj.isDynamic) {
            if (!sobj.typeInitialized) {
                sobj.type = typeof elem;
                sobj.typeInitialized = true;
                sobj.isUniform = true;
            } else if (sobj.isUniform) {
                sobj.isUniform = (sobj.type == (typeof elem));
                if (!sobj.isUniform) {
                    inc(info, "# of instructions at which object hashes become nonuniform", "times allocated at IID:" + sobj.iid, "times get nonuniform at IID:" + iid);
                }
            }
        }
    }

    function checkObjectUniformity(iid, sobj, obj, elem) {
        if (!sobj.isDynamic) {
            sobj.isDynamic = true;
            inc(info, "# of instructions at which an object become an hashtable", "times allocated at IID:" + sobj.iid, "times become hash at IID:" + iid);
            for (var p in obj) {
                if (!hasGetterSetter(obj, p, true))
                    updateSObjObjectNonUniformity(iid, sobj, obj[p]);
            }
        }
        if (sobj.isDynamic) {
            updateSObjObjectNonUniformity(iid, sobj, elem);
        }
    }

    function checkArrayUniformity(iid, val) {
        if (isArr(val)) {
            inc(info, "# of arrays allocated");
            var sobj = getShadowObject(iid, val);
            var i;
            for (i=0; i<val.length; i++) {
                updateSObjArrayNonUniformity(iid, sobj, val[i]);
            }
        }
    }

    function getCreateObjectInfo(iid, obj, isPrototype) {
        if (!isArr(obj) && typeof obj === "object") {
            var sobj = getShadowObject(iid, obj);
            if (sobj) {
                if (sobj.isUsedInForIn === undefined) {
                    inc(info, "# of objects allocated (excluding arrays and functions)");
                    sobj.isUsedInForIn = false;
                    sobj.isPrototype = isPrototype;
                }
            }
        }
        return sobj;
    }

    function forInUse(iid, obj) {
        var sobj = getCreateObjectInfo(iid, obj, false);
        if (sobj && !sobj.isUsedInForIn) {
            sobj.isUsedInForIn = true;
            inc(info, "# of instructions where for-in is called on an object", "times allocated at IID:" + sobj.iid, "times called for-in at IID:" + iid);
        }
    }

    var isCallingConstructor = false;
    var constructorFun;
    var thisStack = [];
    var currThis;

    function MyAnalysis () {
        this.invokeFunPre = function (iid, f, base, args, isConstructor, isMethod) {
            switch (f) {
                case Array.prototype.concat:
                    inc(info, "times Array.prototype.concat called");
                    break;
                case Array.prototype.indexOf:
                    inc(info, "times Array.prototype.indexOf called");
                    break;
                case Array.prototype.join:
                    inc(info, "times Array.prototype.join called");
                    break;
                case Array.prototype.lastIndexOf:
                    inc(info, "times Array.prototype.lastIndexOf called");
                    break;
                case Array.prototype.pop:
                    inc(info, "times Array.prototype.pop called");
                    break;
                case Array.prototype.push:
                    inc(info, "times Array.prototype.push called");
                    break;
                case Array.prototype.reverse:
                    inc(info, "times Array.prototype.reverse called");
                    break;
                case Array.prototype.shift:
                    inc(info, "times Array.prototype.shift called");
                    break;
                case Array.prototype.slice:
                    inc(info, "times Array.prototype.slice called");
                    break;
                case Array.prototype.sort:
                    inc(info, "times Array.prototype.sort called");
                    break;
                case Array.prototype.splice:
                    inc(info, "times Array.prototype.splice called");
                    break;
                case Array.prototype.unshift:
                    inc(info, "times Array.prototype.unshift called");
                    break;
            }

            isCallingConstructor = isConstructor;
            constructorFun = f;

            return {f: f, base: base, args: args, skip: false};
        };

        this.invokeFun = function (iid, f, base, args, result, isConstructor, isMethod) {
            iid = sandbox.getGlobalIID(iid);
            if (isConstructor) {
                checkArrayUniformity(iid, result);
                getCreateObjectInfo(iid, result, false);
            }
            return {result: result};
        };

        this.literal = function (iid, val, hasGetterSetter) {
            iid = sandbox.getGlobalIID(iid);
            checkArrayUniformity(iid, val);
            getCreateObjectInfo(iid, val, false);
            return {result: val};
        };

        this.forinObject = function (iid, val) {
            iid = sandbox.getGlobalIID(iid);
            forInUse(iid, val);
            return {result: val};
        };

        this.getField = function (iid, base, offset, val) {
            iid = sandbox.getGlobalIID(iid);
            if (typeof base === 'function' && offset === "prototype") {
                getCreateObjectInfo(iid, val, true);
            }
            if (!isArr(base) && typeof base === 'object') {
                inc(info, "# of instructions where an object property is read");
                if (!HOP(base, offset)) {
                    if (typeof val === "function") {
                        inc(info, "# of instructions where an object property of type function is read from a prototype");
                    } else {
                        inc(info, "# of instructions where an object property of type non-function is read from a prototype", "times read at IID:" + iid, "times read property named " + offset);
                    }
                }
            }
            return {result: val};
        };

        this.putFieldPre = function (iid, base, offset, val) {
            var sobj;
            iid = sandbox.getGlobalIID(iid);
            if (isArr(base)) {
                inc(info, "# of instructions where an array property (including integer index) is written");
                if (isNormalNumber(offset) || offset === 'length') {
                    if (offset === 'length') {
                        inc(info, "# of instructions where the length property of an array is written");
                    } else if (offset < 0 || offset >= base.length) {
                        if (offset === base.length) {
                            inc(info, "# of instructions where an element is appended to an array", "times appended at IID:" + iid);
                        } else {
                            inc(info, "# of instructions where an out of bound (excluding array.length index) array element is written", "time written at IID:" + iid);
                        }
                    }
                } else {
                    //console.log(offset);
                    inc(info, "# of instructions where a non-number property (excluding length) is written", "times written at IID:" + iid, "times written property named " + offset);
                }
                sobj = getShadowObject(iid, base);
                updateSObjArrayNonUniformity(iid, sobj, val);
            } else if (typeof base === "object") {
                inc(info, "# of instructions where an object property is written");
                if (!HOP(base, offset) && base !== currThis) {
                    sobj = getCreateObjectInfo(iid, base, false);
                    if (!sobj || !sobj.isPrototype) {
                        inc(info, "# of instructions where an object property is added outside a literal or constructor", "times added at IID:" + iid, "times added property named " + offset);
                        if (sobj) {
                            checkObjectUniformity(iid, sobj, base, val);
                        }
                    }
                }
            }
            return {base: base, offset: offset, val: val, skip: false};
        };

        this.functionEnter = function (iid, f, dis, args) {
            if (isCallingConstructor && f === constructorFun) {
                currThis = dis;
            } else {
                currThis = undefined;
            }
            thisStack.push(currThis);
        };

        this.functionExit = function (iid, returnVal, wrappedExceptionVal) {
            thisStack.pop();
            currThis = thisStack[thisStack.length - 1];
            return {returnVal: returnVal, wrappedExceptionVal: wrappedExceptionVal, isBacktrack: false};
        };

        this.scriptEnter = function (iid, val) {
            if (!scriptName) {
                scriptName = val;
            }
        };

        function createTree(input, name, c) {
            var output = {"name": name, "count": c}, tmp, children = [], idx;
            if (input) {
                for (var key in input) {
                    if (HOP(input, key)) {
                        tmp = input[key];
                        var count = tmp.count;
                        var child = tmp.details;
                        var txt;
                        if ((idx = key.indexOf("IID:")) >= 0) {
                            txt = key.substring(0, idx) + iidToLocation(key.substring(idx + 4));
                        } else {
                            txt = key
                        }
                        child = createTree(child, txt + " = " + count, count);
                        children.push(child);
                    }
                }
            }
            children.sort(function (a, b) {
                if (b.count > a.count)
                    return 1;
                else if (b.count < a.count)
                    return -1;
                else
                    return 0;

            });
            if (children.length > 0) {
                output.children = children;
            } else {
                output.size = 2000;
            }
            return output;
        }

        this.endExecution = function() {
//            console.log(JSON.stringify(info, null, 4));
            var fs = require('fs'), path = require('path');
            var contents = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf8');
            fs.writeFileSync('index.html', contents, 'utf8');
            fs.appendFileSync("index.html", "<script>\n var flare = " + JSON.stringify(createTree(info, "Statistics for " + scriptName), null, 4) + ";\n flare.x0 =0; flare.y0=0; update(root=flare);\n</script>", "utf8");
            //require('fs').writeFileSync("../info.json", JSON.stringify(info, null, 4), "utf8");
        };
    }
    sandbox.analysis = new MyAnalysis();
})(J$);

