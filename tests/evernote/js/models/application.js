/*global define, $, console, tizen*/
/*jslint regexp: true*/

/**
 * Application module
 */

define({
    name: 'models/application',
    requires: [
        'core/event'
    ],
    def: function modelsApplication(e) {
        'use strict';

        var app = null,
            APP_CONTROL_URL = 'http://tizen.org/appcontrol/';

        function getCurrentApplication() {
            return app.getCurrentApplication();
        }

        /**
         * @param {object} params Control data params.
         */
        function getAppControlUri(operation) {
            return APP_CONTROL_URL + operation;
        }

        function getId() {
            return getCurrentApplication().appInfo.id;
        }

        /**
         * @param {object} params Control data params.
         */
        function launchAppControl(params) {
            var controlData = params.detail,
                control = new tizen.ApplicationControl(
                    getAppControlUri(controlData.operation),
                    null,
                    controlData.mime
                ),
                callback = {
                    onsuccess: function onsuccess(data) {
                        var i = 0,
                            newData = [],
                            dataKey = getAppControlUri(controlData.key);

                        for (i; i < data.length; i = i + 1) {
                            if (data[i].key === dataKey) {
                                newData.push(data[i]);
                            }
                        }
                        e.fire(controlData.listener, newData);
                    }
                };

            try {
                app.launchAppControl(control, null, null, null, callback);
            } catch (e) {
                console.error(e.message);
            }
        }

        /**
         * Creates ApplicationControl object
         * @param {string} operation Action to be performed.
         */
        function createApplicationControl(operation) {
            return new tizen.ApplicationControl(getAppControlUri(operation));
        }

        function init() {}

        function noop() {}

        e.listeners({
            'models.application.launchAppControl': launchAppControl
        });

        if (typeof tizen !== 'undefined' &&
                typeof tizen.application !== 'undefined') {
            app = tizen.application;
        } else {
            console.warn(
                'tizen or tizen.application not available - using a mock instead'
            );
            app = {
                launchAppControl: noop,
                getCurrentApplication: function getApp() {
                    return {
                        getRequestedAppControl: noop,
                        close: noop,
                        hide: noop
                    };
                }
            };
        }


        return {
            init: init,
            getId: getId,
            getCurrentApplication: getCurrentApplication,
            getAppControlUri: getAppControlUri,
            createApplicationControl: createApplicationControl
        };
    }

});
