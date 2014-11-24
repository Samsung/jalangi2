/*global define, $, console, window, history, tizen*/

/**
 * Init page module
 */

define({
    name: 'views/audioPage',
    def: function viewsAudioPage() {
        'use strict';

        var appControl = null,
            appControlReplyCallback = null;

        function onLaunchSuccess() {
            console.log('launchAppControl', 'onLaunchSuccess');
        }

        function onLaunchError() {
            console.error('launchAppControl', 'onLaunchError');
        }

        function launch() {
            if (typeof tizen !== 'undefined') {
                return;
            }

            tizen.application.launchAppControl(
                appControl,
                "com.samsung.w-voicerecorder",
                onLaunchSuccess,
                onLaunchError,
                appControlReplyCallback
            );

        }

        function init() {
            if (typeof tizen !== 'undefined' && typeof tizen.ApplicationControl === 'function') {
                appControl = new tizen.ApplicationControl(
                    "http://tizen.org/appcontrol/operation/create_content",
                    null,
                    "audio/amr",
                    null
                );
            } else {
                console.warn('tizen.ApplicationControl not available');
            }

            appControlReplyCallback = {
                // callee sent a reply
                onsuccess: function onsuccess(data) {
                    var i = 0,
                        key = "http://tizen.org/appcontrol/data/selected";
                    for (i; i < data.length; i += 1) {
                        if (data[i].key == key) {
                            console.log('selected image is ' + data[i].value[0]);
                        }
                    }
                },

                // callee returned failure
                onfailure: function onfailure() {
                    console.error('The launch application control failed');
                }
            };

        }

        return {
            init: init,
            launch: launch
        };
    }

});
