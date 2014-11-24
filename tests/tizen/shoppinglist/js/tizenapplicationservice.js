/*
 * Copyright (c) 2012, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

var galleryCallback = null;

// object with service reply callbacks
var serviceReply = {
    onsuccess: onServiceReplySuccess,
    onfail: function() {
        showInfoDialog(Localizer.getTranslation("gallery_launch_failed"));
    }
};

function selectImageFromGallery(callback) {
    galleryCallback = callback;
    
    try {
        // the object describing the service
        var service = new tizen.ApplicationService (
                'http://tizen.org/appsvc/operation/pick',
                null,
                'IMAGE/*'
        );
        
        tizen.application.launchService(

                service, // ApplicationService object

                null, // application ID
                
                // launch success function
                function() {
                },
                
                // launch error function
                function(err) {
                    console.log('Error: Gallery launch failed: ' + err.message);
                    showInfoDialog(Localizer.getTranslation("gallery_launch_failed"));
                },
                
                // service reply object
                serviceReply
        );
    } catch (exc) {
        console.log('Error: tizen.application.launchService() exception: ' + exc.message);
        showInfoDialog(Localizer.getTranslation("gallery_launch_failed"));
    }
}

function onServiceReplySuccess(replyData) {
    var data;
    
    if (replyData[0].value[0]) {
        if(galleryCallback) {
            galleryCallback(IMAGE_TYPE.GALLERY_IMAGE, replyData[0].value[0]);
        }
        else {
            showInfoDialog(Localizer.getTranslation("error_adding_photo"));
        }
    } else {
        showInfoDialog(Localizer.getTranslation("error_adding_photo"));
    }
}

function onError(e) {
    console.log('Error: ' + e.message);
}

