/*global define, $, console, tizen*/
/*jslint regexp: true*/

/**
 * SAP module
 */

define({
    name: 'models/sap',
    requires: [
        'core/event'
    ],
    def: function modelsSAP(e) {
        'use strict';

        var sap = null,
            SAP_ID = '/system/evernoteforgear',
            SAP_NAME = 'evernoteforgear',
            SAP_ROLE = 'CONSUMER',
            SAP_CHANNEL_ID = 143,
            CONST_ERROR_TRIAL = 2,
            CONST_TIMEOUT = 15000,
            agent = null,
            sock = null,
            requestListener = null,
            sentData = '',
            trial = 2,
            acc = 0;

        function dispatchSuccess(data) {
            var param = {
                type:'success',
                data:data
            };

            e.fire(requestListener, param);

            requestListener = null;
            trial = CONST_ERROR_TRIAL;
            sentData = '';
        }

        function dispatchError(name, message) {
            e.fire(requestListener, {
                type:'error',
                name:name,
                message:message
            });

            requestListener = null;
            trial = CONST_ERROR_TRIAL;
            sentData = '';
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

        function sendData(listener, str) {
            try {
                sock.sendData(SAP_CHANNEL_ID, str);
            } catch(e) {
                console.error(e.name + ': ' + e.message);
            }

            sentData = str;
            trial--;
            requestListener = listener;
            acc++;
        }

        function mockRequestList(listener) {
            // the real code will send a request, receive a response
            // and finally trigger the event
            var dataObj = {
                id: 'notelistresp',
                count: 10,
                items: [
                    {title: 'title', text: 'Simon'},
                    {title: 'title', text: 'text'},
                    {title: 'title', text: 'text'},
                    {title: 'title', text: 'text'},
                    {title: 'title', text: 'text'},
                    {title: 'title', text: 'text'},
                    {title: 'title', text: 'text'},
                    {title: 'title', text: 'text'},
                    {title: 'title', text: 'text'},
                    {title: 'title', text: 'text'}
                ]
            };
            var param = {
                type:'success',
                data:dataObj
            };
            e.fire(listener, param);
        }

        function requestList(params) {
            var param = params.detail,
                listener = '',
                data = null,
                paramData = {
                    id: 'notelistreq',
                    request: 'list',
                    count: 10
                };

            if(typeof param.listener !== 'string') {
                console.error('param is wrong');
                return;
            }

            listener = param.listener;

            if (typeof tizen === 'undefined' || typeof tizen.sa === 'undefined') {
                mockRequestList(listener);
                return;
            }

            if(requestListener != null) {
                console.error('waiting for result of the previous request');
                dispatchImmediateError(listener, 'OccupiedError', 'Still doing previous request.');
                return;
            }

            if(typeof sock !== 'object' || sock == null) {
                console.error('socket is not ready');
                dispatchImmediateError(listener, 'NotPreparedError', 'Initialization is not finished.');
                return;
            }

            if(!sock.isOpened()) {
                console.error('socket is closed');
                dispatchImmediateError(listener, 'NotPreparedError', 'Initialization is not finished.');
                return;
            }

            if(typeof param.data !== 'object') {
                console.error('param is wrong');
                dispatchImmediateError(listener, 'WrongParamError', 'Parameter is wrong.');
                return;
            }

            data = param.data;

            if(typeof data === 'object' &&
                    data !== null &&
                    data.count !== undefined &&
                    typeof data.count === 'number') {
                paramData.count = data.count;
            }

            var jsonStr = JSON.stringify(paramData);

            sendData(listener, jsonStr);

            var currentAcc = acc;
            setTimeout(function() {
                if(requestListener != null &&
                        currentAcc == acc) {
                    console.error('Time out...');
                    dispatchError('TimeoutError', 'Too long time after requested');
                }
            }, CONST_TIMEOUT);
        }

        function post(params) {
            var param = params.detail,
                listener = '',
                data = null,
                paramData = {
                    id:'notepostreq'
                };

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

            if(typeof sock !== 'object' || sock == null) {
                console.error('socket is not ready');
                dispatchImmediateError(listener, 'NotPreparedError', 'Initialization is not finished.');
                return;
            }

            if(!sock.isOpened()) {
                console.error('socket is closed');
                dispatchImmediateError(listener, 'NotPreparedError', 'Initialization is not finished.');
                return;
            }

            if(typeof param.data !== 'object') {
                console.error('param is wrong');
                dispatchImmediateError(listener, 'WrongParamError', 'Parameter is wrong.');
                return;
            }

            data = param.data;

            if(typeof data === 'object' &&
                    data !== null)
            {
                if(typeof data.title === 'string') {
                    paramData.title = data.title;
                }
                if(typeof data.text === 'string') {
                    paramData.text = data.text;
                }
                if(typeof data.image === 'object' &&
                        data.image !== null) {
                    paramData.image = data.image;
                }
                if(typeof data.audio === 'object' &&
                        data.audio !== null) {
                    paramData.audio = data.audio;
                }
            }

            var jsonStr = JSON.stringify(paramData);

            sendData(listener, jsonStr);

            var currentAcc = acc;
            setTimeout(function() {
                if(requestListener != null &&
                        currentAcc == acc) {
                    console.error('Time out...');
                    dispatchError('TimeoutError', 'Too long time after requested');
                }
            }, CONST_TIMEOUT);
        }

        function onReceive(channelId, data) {
            var dataObj = null,
                newData = {
                    channelId: channelId,
                    data: null
                };
            
            if(requestListener == null) {
                console.error('Request already expired');
                return;
            }

            if(data === undefined ||
                    typeof data !== 'string') {
                console.error('received data is not string');
                dispatchError('UnknownError', 'Wrong Data received.');
                return;
            }

            try {
                dataObj = JSON.parse(data);
            } catch(e) {
                console.error('JSON parse ' + e.name + ': ' + e.message);
                dispatchError('JSONError', 'Wrong Data.');
                return;
            }

            if(typeof dataObj !== 'object') {
                console.error('received data is not an object string');
                dispatchError('JSONError', 'Wrong Data.');
                return;
            }

            function reset() {
                requestListener = null;
                trial = CONST_ERROR_TRIAL;
                sentData = '';
            }

            if(typeof dataObj.id === 'string' &&
                    dataObj.id === 'notelistresp') {
                dispatchSuccess(dataObj); 
            } else if(typeof dataObj.result === 'string') {
                dispatchSuccess(dataObj);
            } else if(typeof dataObj.errormessage === 'string') {
                console.error('Error received : ' + dataObj.errormessage);
                if(trial == 0) {
                    console.error('error done');
                    dispatchError('RemoteError', dataObj.errormessage);
                } else {
                    console.error('retry');
                    sendData(requestListener, sentData);
                }
            } else {
                dispatchError('RemoteError', 'Received data is wrong');
            }
        }

        function init() {
            sap.requestSAAgent(
                {
                    id : SAP_ID,
                    name : SAP_NAME,
                    role : SAP_ROLE,
                    channelIds : [ SAP_CHANNEL_ID ]
                },
                function(agt) {
                    try {
                        console.log('requesteSAAgent succeed');
                        agent = agt;
                        agent.onserviceconnectionresponse = function(s) {
                            console.log('socket created');

                            sock = s;

                            e.fire('models.sap.initdone', { status : 'ok' });
                        };

                        agent.initsocket = {
                            onreceive : onReceive
                        };
                        agent.requestServiceConnection();
                    } catch(err) {
                        console.error(err.name + ': ' + err.message);
                    }
                },
                function(err) {
                    console.error(err.name + ': ' + err.message);
                }
            );

// Don't do this if in mock mode
//            setTimeout(function() {
//                if(sock == null) {
//                    console.error('initialize failed');
//                    e.fire('models.sap.initdone',
//                        {
//                            status: 'error',
//                            name: 'TimeoutError',
//                            message: 'Failed to initialize SAP. Check connection with peer device.'
//                        }
//                    );
//                }
//            }, CONST_TIMEOUT);
        }

        e.listeners({
            'models.sap.requestList': requestList,
            'models.sap.post': post
        });

        if (typeof tizen !== 'undefined' && typeof tizen.sa !== 'undefined') {
        	console.log('Track: sap: tizen not defined');
            sap = tizen.sa;
        } else {
        	console.log('Track: sap: tizen defined');
            sap = {
                requestSAAgent: function requestSAAgentMock() {
                    // requestSAAgent should trigger
                    // 'models.sap.initdone' after some time'
                    setTimeout(function triggerInitDone() {
                        e.fire('models.sap.initdone', {status : 'ok'});
                    }, 1500);
                }
            };
        }

        return {
            init: init,
        };
    }

});

/*
 * // Usage: request list
 *
 * var listener = 'models.sap.receiverequestedlist';
 *
 * e.listen(listener, function(params) {
 *     var param = params.detail;
 *     var type = param.type; // 'error' or 'success'
 *     if( type == 'error') {
 *         console.log('name: ' + param.name);
 *         console.log('message: ' + param.message);
 *     } else if(type == 'success') {
 *         var data = param.data;
 *         console.log('id: ' + data.id); // 'notelistresp'
 *         console.log('count: ' + data.count);
 *         for(var i=0; i<data.count; i++) {
 *             console.log(' #' + i + '#');
 *             console.log(' title : ' + data.items[i].title);
 *             console.log(' text : ' + data.items[i].text);
 *             console.log(' image mime : ' + data.items[i].image.mime);
 *             console.log(' image name : ' + data.items[i].image.name);
 *             //console.log(' image data : ' + data.items[i].image.data);
 *             console.log(' audio mime : ' + data.items[i].audio.mime);
 *             console.log(' audio name : ' + data.items[i].audio.name);
 *             //console.log(' audio data : ' + data.items[i].audio.data);
 *         }
 *     }
 * });
 *
 * e.fire('model.sap.requestList',
 *     {
 *         listener: listener,
 *         data: {
 *             count: 10
 *         }
 *     }
 * );
 *
 */

/*
 * // Usage: post
 *
 * var listener = 'models.sap.postdone';
 *
 * e.listen(listener, function(params) {
 *     var param = params.detail;
 *     var type = param.type; // 'error' or 'success'
 *     if( type == 'error') {
 *         console.log('name: ' + param.name);
 *         console.log('message: ' + param.message);
 *     } else if(type == 'success') {
 *         var data = param.data;
 *         console.log('result: ' + data.result); // 'success' or 'failed'
 *         console.log('errormessage: ' + data.errormessage);
 *     }
 * });
 *
 * e.fire('model.sap.post',
 *     {
 *         listener: listener,
 *         data: {
 *             title: 'Title',
 *             text: 'Text',
 *             image : {
 *                 name: 'Image name',
 *                 mime: 'image/jpeg',
 *                 data: ''
 *             },
 *             audio : {
 *                 name: 'Audio name',
 *                 mime: 'audio/mp3',
 *                 data: ''
 *             }
 *         }
 *     }
 * );
 *
 *
 */
