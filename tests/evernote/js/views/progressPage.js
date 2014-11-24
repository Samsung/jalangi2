/*global define, $, console, window, history*/

/**
 * Init page module
 */

define({
    name: 'views/progressPage',
    requires: [
        'core/event',
        'core/jqselector'
    ],
    def: function viewsInitPage(req) {
        'use strict';

        var e = req.core.event,
            $id = req.core.jqselector.$id,
            $page = $id('progress-page');

        function isPageActive() {
            return $page.hasClass($.mobile.activePageClass);
        }

        function onPageInit() {
            $id('progress-bar').progressbar({value: 0});
        }

        function show(data) {
            $id('progress-bar-title').html('&nbsp;');
            $id('progress-bar').progressbar({value: 0});
            $id('progress-info-right').html('&nbsp;');
            $id('progress-info-left').html('&nbsp;');

            if (data.detail && data.detail.title) {
                $id('progress-page-title').text(data.detail.title);
            }
            $.mobile.changePage($page, {transition: 'none'});
        }

        function hide() {
            if (isPageActive()) {
                history.back();
            }
        }

        function bindEvents() {
            $page.on('pageinit', onPageInit);
        }

        function init() {
            // bind events to page elements
            bindEvents();
        }

        function onProgressUpdate(data) {
            var detail = data.detail;
            if (detail) {
                if (detail.title) {
                    $id('progress-bar-title').text(detail.title);
                }

                if (detail.value) {
                    $id('progress-bar').progressbar({value: detail.value});
                    $id('progress-info-right').text(detail.value  + '%');
                }

                if (detail.itemsProgress) {
                    $id('progress-info-left').text(detail.itemsProgress);
                }
            }
        }

        e.listeners({
            'progress.update': onProgressUpdate,
            'progress.show': show,
            'progress.hide': hide
        });

        return {
            init: init
        };
    }

});