/**
 * If you want to use smemory you must include --analysis $JALANGI_HOME/src/js/sample_analyses/ChainedAnalyses.js
 * --analysis $JALANGI_HOME/src/js/runtime/SMemory.js as the first two --analysis options during an analysis.
 * smemory can be accessed via J$.smemory or sandbox.smemory.  The smemory object defines two methods: getShadowObject
 * and getShadowFrame.  Those two methods can be used to obtain the shadow memory for an object property or a program variable,
 * respectively.  getShadowObject should be used in getFieldPre, putFieldPre, and literal callbacks.  (In a literal
 * callback with an object literal, one must go over all the own properties of the literal object to suitably update
 * shadow object.) getShadowFrame should only be used in declare, read, and write callbacks.
 *
 */

(function (sandbox) {
    var smemory = sandbox.smemory = new function () {
        var Constants = sandbox.Constants;

        var PREFIX = Constants.JALANGI_VAR;
        var SPECIAL_PROP_SOBJECT = "*" + PREFIX + "O*";
        var SPECIAL_PROP_FRAME = "*" + PREFIX + "F*";
        var SPECIAL_PROP_ACTUAL = "*" + PREFIX + "A*";
        var objectId = 1;
        var frameId = 2;
        var scriptCount = 0;
        var HOP = Constants.HOP;


        var frame = Object.create(null);

        var frameStack = [frame];
        var evalFrames = [];


        // public function
        /**
         * This method should be called on a base object and a property name to retrieve the shadow object associated with
         * the object that actually owns the
         * property. When the program performs a putField operation, the third argument should be false and the returned
         * object is the shadow object associated with the base object.  When the program performs a getField operation,
         * the third argument should be true and the returned object is the shadow object associated with the object in the
         * prototype chain (or the base object) which owns the property.  For a getField operation, the returned value
         * is undefined if none of the
         * objects in the prototype chain owns the property.  The return value is an object with two properties: "owner"
         * points to the shadow object and "isProperty" indicates if the property is a concrete property of the object or
         * if the property denotes a getter/setter.
         *
         * @param obj - The base object
         * @param prop - The property name
         * @param isGetField - True if the property access is a getField operation
         * @returns {{owner: Object, isProperty: boolean}}
         */
        this.getShadowObject = function(obj, prop, isGetField) {
            var ownerAndAccess = getOwnerAndAccess(obj, prop, isGetField);
            if (ownerAndAccess.owner !== undefined) {
                ownerAndAccess.owner = this.getShadowObjectOfObject(ownerAndAccess.owner);
            }
            return ownerAndAccess;
        };

        // public function
        /**
         * This method returns the shadow object associated with the activation frame that contains the variable "name".
         *
         * @param name - Name of the variable whose owner activation frame's shadow object we want to retrieve
         * @returns {Object} -  The shadow object of the activation frame owning the variable.
         */
        this.getShadowFrame = function (name) {
            var f = this.getFrame(name);
            var ret = this.getShadowObjectOfObject(f);
            if (Object && Object.defineProperty && typeof Object.defineProperty === 'function') {
                Object.defineProperty(ret, SPECIAL_PROP_ACTUAL, {
                    enumerable: false,
                    writable: true
                });
            }
            ret[SPECIAL_PROP_ACTUAL] = f[SPECIAL_PROP_ACTUAL];
            return ret;
        };

        // public function
        /**
         * Given a shadow object or frame, it returns the unique id of the shadow objects or frame.
         * @param obj
         * @returns {*}
         */

        this.getIDFromShadowObjectOrFrame = function (obj) {
            return obj[SPECIAL_PROP_SOBJECT];
        };

        // public function
        /**
         * Given a shadow object, it returns the actual object.
         * Given a shadow frame, it returns the function whose invocation created the frame.
         *
         * @param obj
         * @returns {*}
         */
        this.getActualObjectOrFunctionFromShadowObjectOrFrame = function (obj) {
            return obj[SPECIAL_PROP_ACTUAL];
        };



        /**
         * This method returns the shadow object associated with the activation frame that contains the variable "name".
         *
         * @param name - Name of the variable whose owner activation frame's shadow object we want to retrieve
         * @returns {Object} -  The shadow object of the activation frame owning the variable.
         */
        this.getFrame = function (name) {
            var tmp = frame;
            while (tmp && !HOP(tmp, name)) {
                tmp = tmp[SPECIAL_PROP_FRAME];
            }
            if (tmp) {
                return tmp;
            } else {
                return frameStack[0]; // return global scope
            }
        };



        function getOwnerAndAccess(obj, prop, isGetField) {
            if (typeof Object.getOwnPropertyDescriptor !== 'function') {
                throw new Error("Cannot call getOwnPropertyDescriptor on Object.");
            }
            var oldObj = obj;
            while (obj !== null) {
                if (typeof obj !== 'object' && typeof obj !== 'function') {
                    return false;
                }
                var desc = Object.getOwnPropertyDescriptor(obj, prop);
                if (desc !== undefined) {
                    if (isGetField && typeof desc.get === 'function') {
                        return {"owner":obj, "isProperty":false};
                    }
                    if (!isGetField && typeof desc.set === 'function') {
                        return {"owner":obj, "isProperty":false};
                    }
                }
                if (isGetField && HOP(obj, prop)) {
                    return {"owner":obj, "isProperty":true};
                }
                obj = obj.__proto__;
            }
            if (!isGetField) {
                return {"owner":oldObj, "isProperty":true};
            } else {
                return {"owner":undefined, "isProperty":true};
            }
        }

        function createShadowObject(val) {
            var type = typeof val;
            if ((type === 'object' || type === 'function') && val !== null && !HOP(val, SPECIAL_PROP_SOBJECT)) {
                if (Object && Object.defineProperty && typeof Object.defineProperty === 'function') {
                    Object.defineProperty(val, SPECIAL_PROP_SOBJECT, {
                        enumerable: false,
                        writable: true
                    });
                    Object.defineProperty(val, SPECIAL_PROP_ACTUAL, {
                        enumerable: false,
                        writable: true
                    });
                }
                try {
                    val[SPECIAL_PROP_SOBJECT] = Object.create(null);
                    val[SPECIAL_PROP_SOBJECT][SPECIAL_PROP_SOBJECT] = objectId;
                    val[SPECIAL_PROP_SOBJECT][SPECIAL_PROP_ACTUAL] = val;
                    objectId = objectId + 2;
                } catch (e) {
                    // cannot attach special field in some DOM Objects.  So ignore them.
                }
            }

        }

        this.getShadowObjectOfObject = function (val) {
            var value;
            createShadowObject(val);
            var type = typeof val;
            if ((type === 'object' || type === 'function') && val !== null && HOP(val, SPECIAL_PROP_SOBJECT)) {
                value = val[SPECIAL_PROP_SOBJECT];
            } else {
                value = undefined;
            }
            return value;
        };


        this.defineFunction = function (f) {
            if (typeof f === 'function') {
                if (Object && Object.defineProperty && typeof Object.defineProperty === 'function') {
                    Object.defineProperty(f, SPECIAL_PROP_FRAME, {
                        enumerable: false,
                        writable: true
                    });
                }
                f[SPECIAL_PROP_FRAME] = frame;
            }
        };

        //this.evalBegin = function (isDirect) {
        //    evalFrames.push(frame);
        //    if (!isDirect)
        //        frame = frameStack[0];
        //};

        //this.evalEnd = function () {
        //    frame = evalFrames.pop();
        //};


        this.initialize = function (name) {
            frame[name] = undefined;
        };

        this.functionEnter = function (val) {
            frameStack.push(frame = Object.create(null));
            if (Object && Object.defineProperty && typeof Object.defineProperty === 'function') {
                Object.defineProperty(frame, SPECIAL_PROP_FRAME, {
                    enumerable: false,
                    writable: true
                });
                Object.defineProperty(frame, SPECIAL_PROP_ACTUAL, {
                    enumerable: false,
                    writable: true
                });
            }
            frame[SPECIAL_PROP_FRAME] = val[SPECIAL_PROP_FRAME];
            frame[SPECIAL_PROP_ACTUAL] = val;
        };

        this.functionReturn = function () {
            frameStack.pop();
            frame = frameStack[frameStack.length - 1];
        };

        var isEvalScript = [];

        this.scriptEnter = function (instrumentedFileName, originalFileName) {
            scriptCount++;
            if (scriptCount > 0) {
                if (!(originalFileName === 'eval'  && instrumentedFileName === originalFileName)) {
                    if (Constants.isBrowser) {
                        frame = frameStack[0];
                    } else {
                        frameStack.push(frame = Object.create(null));
                        frame[SPECIAL_PROP_FRAME] = frameStack[0];
                    }
                    isEvalScript.push(false);
                } else {
                    isEvalScript.push(true);
                }
            }
        };

        this.scriptReturn = function () {
            if (scriptCount > 0 && !isEvalScript.pop()) {
                if (!Constants.isBrowser) {
                    frameStack.pop();
                }
                frame = frameStack[frameStack.length - 1];
            }
            scriptCount--;
        };

    };


    function MyAnalysis() {
        this.literal = function (iid, val, hasGetterSetter) {
            smemory.defineFunction(val);
        };

        this.declare = function (iid, name, val, isArgument, argumentIndex, isCatchParam) {
            smemory.initialize(name);
        };

        this.functionEnter = function (iid, f, dis, args) {
            smemory.functionEnter(f);
            smemory.initialize('this');
        };


        this.functionExit = function (iid, returnVal, wrappedExceptionVal) {
            smemory.functionReturn();
        };


        this.scriptEnter = function (iid, instrumentedFileName, originalFileName) {
            smemory.scriptEnter(instrumentedFileName, originalFileName);
        };

        this.scriptExit = function (iid, wrappedExceptionVal) {
            smemory.scriptReturn();
        };


        //this.instrumentCodePre = function (iid, code, isDirect) {
        //    smemory.evalBegin(isDirect);
        //};
        //
        //
        //this.instrumentCode = function (iid, newCode, newAst, isDirect) {
        //    console.log(newCode);
        //    smemory.evalEnd(isDirect);
        //};

    }

    sandbox.analysis = new MyAnalysis();

}(J$));


