/*global define, console, window, document, jQuery*/
/*jslint plusplus: true*/

/**
 * Simple selectors module
 */

define({
    name: 'core/jqselector',
    def: function jqselector() {
        'use strict';

        // Faster selectors for jQuery
        function Init$$() {
            return this;
        }
        Init$$.prototype = jQuery.fn;

        /**
         * Replacement of $ for simple selectors.
         *
         * $$ is compatible with document.querySelectorAll capabilities,
         * except that it returns a jQuery object instead of a node list.
         *
         * @param {string} selector Selector.
         * @return {jQuery}
         */
        function $$(selector) {
            var obj = new Init$$(),
                nodeList = document.querySelectorAll(selector),
                i = nodeList.length;

            obj.length = i;
            while (i--) {
                obj[i] = nodeList[i];
            }
            return obj;
        }

        /**
         * Replacement of $ for simple selectors.
         *
         * $id is compatible with document.getElementById capabilities,
         * except that it returns a jQuery object instead of a node.
         *
         * @param {string} selector Selector.
         * @return {jQuery}
         */
        function $id(selector) {
            var obj = new Init$$(),
                node = document.getElementById(selector);

            if (node) {
                obj.length = 1;
                obj[0] = node;
            } else {
                obj.length = 0;
            }
            return obj;
        }

        return {
            $$: $$,
            $id: $id
        };
    }
});
