/*global define*/

/**
 * Config module
 */

define({
    name: 'core/config',
    def: function config() {
        'use strict';

        var properties = {
            'templateDir': 'templates',
            'templateExtension': '.tpl'
        };

        function get(value, defaultValue) {
            if (properties[value] !== undefined) {
                return properties[value];
            }
            return defaultValue;
        }

        return {
            get: get
        };

    }
});
