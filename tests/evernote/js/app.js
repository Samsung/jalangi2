/*global require, define, console, $*/

/**
 * App module
 */

define({
    name: 'app',
    requires: [
        'core/event',
        'views/initPage'
    ],
    def: function appInit(req) {
        'use strict';

        console.log('app::def');

        var e = req.core.event;

        function init() {
            console.log('app::init');
        }

        return {
            init: init
        };
    }
});

