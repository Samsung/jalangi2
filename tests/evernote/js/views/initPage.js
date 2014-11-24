/*global define, $, console, window, history*/

/**
 * Init page module
 */

define({
    name: 'views/initPage',
    requires: [
        'core/event',
        'core/template',
        'core/jqselector',
        'models/application',
        'models/sap',
        'models/media',
        'views/audioPage',
        'views/progressPage'
    ],
    def: function viewsInitPage(req) {
        'use strict';

        var e = req.core.event,
            $id = req.core.jqselector.$id,
            app = req.models.application,
            sap = req.models.sap,
            media = req.models.media,
            audio = req.views.audioPage,
            $rotating = null,
            rotation = 0,
            actionInProgress = false;

        function onHardwareKeysTap(ev) {
            var keyName = ev.originalEvent.keyName,
                page = $.mobile.activePage.attr('id');
            if (keyName === 'back') {
                if (page === 'main' || page === 'ajax-loader') {
                    app.getCurrentApplication().exit();
                } else {
                    history.back();
                }
            }
        }

        function popup(message) {
            var $popup = $('<div data-role="popup" class="app-popup"><p>'
                    + message + '<p></div>');

            $popup.appendTo($.mobile.activePage).popup();
            $popup.on('popupafterclose', function() {
                $popup.remove();
            });
            $popup.popup('open');
        }

        function initRecentItem() {

            var recentData = null;
            var listenerR = 'models.sap.receiverequestedlist';

            var ul = $('#recent ul');

            e.listen(listenerR, function(params) {
                var param = params.detail;

                if(param.type === 'error') {
                    console.log('Error occurred while requesting list');
                    popup('Error occurred while requesting list');
                    $.mobile.loading('hide');
                    return;
                }

                var data = param.data;

                console.log('id: ' + data.id); // 'notelistresp'
                console.log('count: ' + data.count);
                for(var i=0; i<data.count; i++) {
                    console.log(' #' + i + '#');
                    console.log(' title : ' + data.items[i].title);
                    console.log(' text : ' + data.items[i].text);
                    //console.log(' image mime : ' + data.items[i].image.mime);
                    //console.log(' image name : ' + data.items[i].image.name);
                    //console.log(' image data : ' + data.items[i].image.data);
                    //console.log(' audio mime : ' + data.items[i].audio.mime);
                    //console.log(' audio name : ' + data.items[i].audio.name);
                    //console.log(' audio data : ' + data.items[i].audio.data);
                }

                ul.empty();
                for(var i=0; i<data.count; i++) {
                    ul.append('<li data-icon="false" id="recent_item_'+i+'"><a href="#" data-transition="none">'+data.items[i].title+'</a></li>');
                }
                $.mobile.changePage('#recent');
                ul.listview('refresh');

                recentData = data;
            });
            $('#recent ul').on('tap', 'li', function(e) {
                var i = parseInt($(this).attr('id').substring(12));

                $('#page_title').empty();
                $('#page_title').append(recentData.items[i].title);

                $('#page_content').empty();
                $('#page_content').append(recentData.items[i].text);

                $.mobile.changePage('#text-page');
            });

            $('#recent-btn').on('tap', function(ev) {
                if (actionInProgress) {
                    return;
                }
                ev.preventDefault();
                $.mobile.loading('show');
                e.fire('models.sap.requestList',
                    {
                        listener: listenerR,
                        data: {
                            count : 10
                        }
                    }
                );
            });
        }

        function uploadData(param) {
            var listener = 'models.sap.uploadReply';

            e.listen(listener, function(ev) {
                var param = ev.detail;
                if(param.type == 'error') {
                    console.error('Upload failed');
                    popup('Upload failed');
                } else {
                    console.log('Upload succeeded');
                }
                $.mobile.changePage('#main');
            });

            var detail = {
                listener : listener,
                data: { }
            };

            if(param.media == 'image') {
                detail.data = {
                    title: 'Photo from Gear',
                    text: 'This photo is taken with Gear at ' + (new Date()).toLocaleString(),
                    image : {
                        name: param.name,
                        mime: param.mime,
                        data: param.data
                    }
                }
            } else if(param.media == 'audio') {
                detail.data = {
                    title: 'Audio from Gear',
                    text: 'This audio is recorded with Gear at ' + (new Date()).toLocaleString(),
                    audio : {
                        name: param.name,
                        mime: param.mime,
                        data: param.data
                    }
                }
            }

            e.fire('models.sap.post', detail);

            $('#ajax-loader .sub').empty();
            $('#ajax-loader .sub').append('Sending...');
            $.mobile.changePage('#ajax-loader', {transition: 'none'});
        }

        function initMediaItem() {
            var listener = 'models.media.result';

            e.listen(listener, function(ev) {
                var param = ev.detail;
                if(param.type === 'success') {
                    console.log('name: ' + param.name);
                    console.log('mime: ' + param.mime);
                    console.log('media: ' + param.media);
                    //console.log('data: ' + param.data);
                    console.log('data.length: ' + param.data.length);

                    uploadData(param);

                } else {
                    console.error('[' + param.name + '] : ' + param.message);
                    popup(param.message);
                }
            });

            $('#camera-btn').on('tap', function() {
                e.fire('models.media.snap', { listener: listener } );
            });

            $('#audio-btn').on('tap', function() {
                e.fire('models.media.record', { listener: listener } );
            });
        }

        function onAudioBtnTap(e) {
            audio.launch();
        }

        function stepRotate() {
            $rotating.css('-webkit-transform', 'rotate(' +  rotation + 'deg)');
            rotation = (rotation + 7) % 360;
        }

        function onMainPageShow() {
            actionInProgress = false;
        }

        function bindEvents() {
            $(window).on('tizenhwkey', onHardwareKeysTap);
            //$id('audio-btn').on('tap', onAudioBtnTap);
            // rotate
            setInterval(stepRotate, 50);
            $id('main').on('pageshow', onMainPageShow);
        }

        function init() {
            // find rotating elements
            $rotating = $('.rotating');
            // bind events to page elements
            bindEvents();

            initRecentItem();
            initMediaItem();
        }

        e.listen('models.sap.initdone', function goToMainPage(ev) {
            var param = ev.detail;

            if(param.status == 'ok') {
                $.mobile.changePage('#main');
            } else if(param.status == 'error') {
                console.error('error : ' + param.message);
                popup(param.message);
                setTimeout(function() {
                    app.getCurrentApplication().exit();
                }, 2000);
            }
        });

        return {
            init: init
        };
    }

});
