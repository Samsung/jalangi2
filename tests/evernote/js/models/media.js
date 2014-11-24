/*global define, $, console, tizen*/
/*jslint regexp: true*/

/**
 * Media module
 */

define({
    name: 'models/media',
    requires: [
        'core/event'
    ],
    def: function modelsMedia(e) {
        'use strict';

        var app = null,
            fs = null,
            APP_CONTROL_CREATE_CONTENT = 'http://tizen.org/appcontrol/operation/create_content',
            APP_CONTROL_DATA_SELECTED = 'http://tizen.org/appcontrol/data/selected',
            MIME_IMAGE_JPEG = 'image/jpeg',
            MIME_AUDIO_AMR = 'audio/amr',
            APPID_CAMERA = 'com.samsung.camera-app',
            APPID_RECORDER = 'com.samsung.w-voicerecorder',
            requestListener = null,
            resultFileName = '',
            resultMimeType = '',
            resultMediaType = '';

        function dispatchSuccess(data) {
            e.fire(requestListener, {
                type:'success',
                name:resultFileName,
                mime:resultMimeType,
                data:data,
                media:resultMediaType
            });

            requestListener = null;
            resultFileName = '';
            resultMimeType = '';
            resultMediaType = '';
        }

        // Errors
        //  - LaunchFailed
        //  - UserCanceled
        //  - UnknownError
        //  - FileError
        function dispatchError(name, message) {
            e.fire(requestListener, {
                type:'error',
                name:name,
                message:message
            });

            requestListener = null;
            resultFileName = '';
            resultMimeType = '';
            resultMediaType = '';
        }

        // Errors
        //  - OccuppiedError
        function dispatchImmediateError(listener, name, message) {
            e.fire(listener, {
                type:'error',
                name:name,
                message:message
            });
        }

        function record(ev) {
            var param = ev.detail,
                listener = '',
                appControl = null;

            if(typeof param.listener !== 'string') {
                console.error('param is wrong');
                return;
            }

            listener = param.listener;

            if(requestListener != null) {
                console.error('waiting for result of the previous request');
                dispatchImmediateError(listener, 'OccupiedError', 'Still doing previous request.');
                return;
            }

            function successCb() {
                console.log('Succeed to launch recorder app');
            }

            function errorCb(e) {
                console.error('Failed to launch recorder app (' + e.name + ') ' + e.message);
                dispatchError('LaunchFailed', 'Failed to launch recorder.');
            }

            function replyFailureCb() {
                console.error('Canceled to record');
                dispatchError('UserCanceled', 'User canceled to record voice.');
            }

            function replySuccessCb(data) {
                console.log('reply received');

                var path = '';

                for (var i = 0; i < data.length; i++) {
                    if (data[i].key == APP_CONTROL_DATA_SELECTED) {
                        path = data[i].value[0];
                        break;
                    }
                }

                if(path == '') {
                    console.error('replied data is wrong.');
                    dispatchError('UnknownError', 'Unknown error occured.');
                    return;
                } else {
                    console.log('replied succeed');
                    resolveFile(path);
                }
            }

            try {
                appControl = new tizen.ApplicationControl(APP_CONTROL_CREATE_CONTENT,
                        null, MIME_AUDIO_AMR);
                app.launchAppControl(appControl, APPID_RECORDER,
                    successCb, errorCb,
                    { onsuccess:replySuccessCb, onfailure:replyFailureCb }
                );
            } catch(e) {
                console.error('Failed to launch recorder app (' + e.name + ') ' + e.message);
                dispatchError('LaunchFailed', 'Failed to launch recorder.');
                return;
            }

            requestListener = listener;
            resultMimeType = MIME_AUDIO_AMR;
            resultMediaType = 'audio';
        }

        function snap(ev) {
            var param = ev.detail,
                listener = '',
                appControl = null;

            if(typeof param.listener !== 'string') {
                console.error('param is wrong');
                return;
            }

            listener = param.listener;

            if(requestListener != null) {
                console.error('waiting for result of the previous request');
                dispatchImmediateError(listener, 'OccupiedError', 'Still doing previous request.');
                return;
            }

            function successCb() {
                console.log('Succeed to launch camera app');
            }

            function errorCb(e) {
                console.error('Failed to launch camera app (' + e.name + ') ' + e.message);
                dispatchError('LaunchFailed', 'Failed to launch camera.');
            }

            function replyFailureCb() {
                console.error('Canceled to snap');
                dispatchError('UserCanceled', 'User canceled to take a picture.');
            }

            function replySuccessCb(data) {
                console.log('reply received');

                var path = '';

                for (var i = 0; i < data.length; i++) {
                    if (data[i].key == APP_CONTROL_DATA_SELECTED) {
                        path = data[i].value[0];
                        break;
                    }
                }

                if(path == '') {
                    console.error('replied data is wrong.');
                    dispatchError('UnknownError', 'Unknown error occured.');
                    return;
                } else {
                    console.log('replied succeed');
                    resolveFile(path);
                }
            }

            try {
                appControl = new tizen.ApplicationControl(APP_CONTROL_CREATE_CONTENT,
                        null, MIME_IMAGE_JPEG);
                app.launchAppControl(appControl, APPID_CAMERA,
                    successCb, errorCb,
                    { onsuccess:replySuccessCb, onfailure:replyFailureCb }
                );
            } catch(e) {
                console.error('Failed to launch camera app (' + e.name + ') ' + e.message);
                dispatchError('LaunchFailed', 'Failed to launch camera.');
                return;
            }

            requestListener = listener;
            resultMimeType = MIME_IMAGE_JPEG;
            resultMediaType = 'image';
        }

        function resolveFile(f) {
            console.log('resolve : ' + f);
            function successCb(file) {
                console.log('Succeed to resolve file.');
                openStreamFile(file);
            }

            function errorCb(e) {
                console.error('Failed to resolve (' + e.name + ') ' + e.message);
                dispatchError('FileError', 'Failed to access file.');
            }

            resultFileName = f.replace(/^.*[\\\/]/, '');
            var filename = 'file://' + f;

            try {
                fs.resolve(filename, successCb, errorCb, 'r');
            } catch(e) {
                console.error('Failed to resolve (' + e.name + ') ' + e.message);
                dispatchError('FileError', 'Failed to access file.');
            }
        }

        function openStreamFile(file) {
            function successCb(stream) {
                console.log('Succeed to open stream.');

                var length = stream.bytesAvailable;

                var base64Str = stream.readBase64(length);

                console.log('size of file : ' + base64Str.length);

                dispatchSuccess(base64Str);
            }

            function errorCb(e) {
                console.error('Failed to openStream (' + e.name + ') ' + e.message);
                dispatchError('FileError', 'Failed to access file.');
            }

            try {
                file.openStream('r', successCb, errorCb);
            } catch(e) {
                console.error('Failed to openStream (' + e.name + ') ' + e.message);
                dispatchError('FileError', 'Failed to access file.');
            }
        }

        function noop() {
            return;
        }

        function init(e) {
            //setInterval(function() { typeof window }, 1000);
        }

        e.listeners({
            'models.media.snap': snap,
            'models.media.record': record
        });

        if (typeof tizen !== 'undefined' &&
                typeof tizen.application !== 'undefined') {
            app = tizen.application;
        } else {
            console.warn('tizen.application not available - using a mock');
            app = {
                launchAppControl: noop
            };
        }
        if (typeof tizen !== 'undefined' &&
                typeof tizen.filesystem !== 'undefined') {
            fs = tizen.filesystem;
        } else {
            console.warn('tizen.filesystem not available - using a mock');
            fs = {
                resolve: noop
            };
        }

        return {
            init: init
        };
    }
});

/*
 * // Usage: snap
 *
 * var listener = 'models.media.snapResult';
 *
 * e.listen(listener, function(ev) {
 *     var param = ev.detail;
 *     if(param.type === 'success') {
 *         console.log('name: ' + param.name);
 *         //console.log('data: ' + param.data);
 *         console.log('data.length: ' + param.data.length);
 *     } else (
 *         console.error('[' + param.name + '] : ' + param.message);
 *     }
 * });
 *
 * e.fire('model.media.snap',
 *     {
 *         listener: listener
 *     }
 * );
 *
 */

/*
 * // Usage: record
 *
 * var listener = 'models.media.recordResult';
 *
 * e.listen(listener, function(ev) {
 *     var param = ev.detail;
 *     if(param.type === 'success') {
 *         console.log('filename: ' + param.filename);
 *         //console.log('data: ' + param.data);
 *         console.log('data.length: ' + param.data.length);
 *     } else (
 *         console.error('[' + param.name + '] : ' + param.message);
 *     }
 * });
 *
 * e.fire('model.media.record',
 *     {
 *         listener: listener
 *     }
 * );
 *
 */

