(function (sandbox) {


    sandbox.TraceWriter = function (traceFileName) {
        var Constants = sandbox.Constants;
        var Config = sandbox.Config;

        var bufferSize = 0;
        var buffer = [];
        var traceWfh;
        var fs = (!Constants.isBrowser) ? require('fs') : undefined;
        var trying = false;
        var cb;
        var remoteBuffer = [];
        var socket, isOpen = false;
        // if true, in the process of doing final trace dump,
        // so don't record any more events
        var tracingDone = false;

        function getFileHanlde() {
            if (traceWfh === undefined) {
                traceWfh = fs.openSync(traceFileName, 'w');
            }
            return traceWfh;
        }

        /**
         * @param {string} line
         */
        this.logToFile = function (line) {
            if (tracingDone) {
                // do nothing
                return;
            }
            var len = line.length;
            // we need this loop because it's possible that len >= Config.MAX_BUF_SIZE
            // TODO fast path for case where len < Config.MAX_BUF_SIZE?
            var start = 0, end = len < Config.MAX_BUF_SIZE ? len : Config.MAX_BUF_SIZE;
            while (start < len) {
                var chunk = line.substring(start, end);
                var curLen = end - start;
                if (bufferSize + curLen > Config.MAX_BUF_SIZE) {
                    this.flush();
                }
                buffer.push(chunk);
                bufferSize += curLen;
                start = end;
                end = (end + Config.MAX_BUF_SIZE < len) ? end + Config.MAX_BUF_SIZE : len;
            }
        };

        this.flush = function () {
            var msg;
            if (!Constants.isBrowser) {
                var length = buffer.length;
                for (var i = 0; i < length; i++) {
                    fs.writeSync(getFileHanlde(), buffer[i]);
                }
            } else {
                msg = buffer.join('');
                if (msg.length > 1) {
                    this.remoteLog(msg);
                }
            }
            bufferSize = 0;
            buffer = [];
        };


        function openSocketIfNotOpen() {
            if (!socket) {
                console.log("Opening connection");
                socket = new WebSocket('ws://127.0.0.1:8080', 'log-protocol');
                socket.onopen = tryRemoteLog;
                socket.onmessage = tryRemoteLog2;
            }
        }

        /**
         * invoked when we receive a message over the websocket,
         * indicating that the last trace chunk in the remoteBuffer
         * has been received
         */
        function tryRemoteLog2() {
            trying = false;
            remoteBuffer.shift();
            if (remoteBuffer.length === 0) {
                if (cb) {
                    cb();
                    cb = undefined;
                }
            }
            tryRemoteLog();
        }

        this.onflush = function (callback) {
            if (remoteBuffer.length === 0) {
                if (callback) {
                    callback();
                }
            } else {
                cb = callback;
                tryRemoteLog();
            }
        };

        function tryRemoteLog() {
            isOpen = true;
            if (!trying && remoteBuffer.length > 0) {
                trying = true;
                socket.send(remoteBuffer[0]);
            }
        }

        this.remoteLog = function (message) {
            if (message.length > Config.MAX_BUF_SIZE) {
                throw new Error("message too big!!!");
            }
            remoteBuffer.push(message);
            openSocketIfNotOpen();
            if (isOpen) {
                tryRemoteLog();
            }
        };

        /**
         * stop recording the trace and flush everything
         */
        this.stopTracing = function () {
            tracingDone = true;
            this.flush();
        };
    }

})(J$);
