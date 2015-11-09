if (typeof J$ === 'undefined') {
    J$ = {};
}

(function (sandbox) {
    sandbox.Frames = function () {
        var Constants = sandbox.Constants;

        var SPECIAL_PROP_FRAMES = Constants.SPECIAL_PROP3 + "FRAMES";
        var scriptCount = 0;
        var HOP = Constants.HOP;


        var frame = Object.create(null);
        var frameStack = [frame];
        var evalFrames = [];

        this.getFrameStack = function () {
            return frameStack;
        };


        this.getFrame = function (name) {
            var tmp = frame;
            while (tmp && !HOP(tmp, name)) {
                tmp = tmp[SPECIAL_PROP_FRAMES];
            }

            if (tmp) {
                return tmp;
            } else {
                return frameStack[0]; // return global scope
            }
        };

        this.getParentFrame = function (otherFrame) {
            if (otherFrame) {
                return otherFrame[SPECIAL_PROP_FRAMES];
            } else {
                return null;
            }
        };

        this.getCurrentFrame = function () {
            return frame;
        };

        this.getClosureFrame = function (fun) {
            return fun[SPECIAL_PROP_FRAMES];
        };


        this.defineFunction = function (val) {

            if (Object && Object.defineProperty && typeof Object.defineProperty === 'function') {
                Object.defineProperty(val, SPECIAL_PROP_FRAMES, {
                    enumerable: false,
                    writable: true
                });
            }
            val[SPECIAL_PROP_FRAMES] = frame;

        };

        this.evalBegin = function () {
            evalFrames.push(frame);
            frame = frameStack[0];
        };

        this.evalEnd = function () {
            frame = evalFrames.pop();
        };


        this.initialize = function (name) {
            frame[name] = undefined;

        };

        this.functionEnter = function (val) {
            frameStack.push(frame = Object.create(null));
            if (Object && Object.defineProperty && typeof Object.defineProperty === 'function') {
                Object.defineProperty(frame, SPECIAL_PROP_FRAMES, {
                    enumerable: false,
                    writable: true
                });
            }
            frame[SPECIAL_PROP_FRAMES] = val[SPECIAL_PROP_FRAMES];

        };

        this.functionReturn = function () {
            frameStack.pop();
            frame = frameStack[frameStack.length - 1];
        };

        this.scriptEnter = function () {
            scriptCount++;
            if (scriptCount > 1) {
                frameStack.push(frame = Object.create(null));
                frame[SPECIAL_PROP_FRAMES] = frameStack[0];
            }
        };

        this.scriptReturn = function () {
            if (scriptCount > 1) {
                frameStack.pop();
                frame = frameStack[frameStack.length - 1];
            }
            scriptCount--;
        };

    };

}(J$));



