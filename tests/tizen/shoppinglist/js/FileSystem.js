/*
 * Copyright (c) 2012, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

// Singleton classes.
//
FileSystem = {}; //

// http://www.html5rocks.com/en/tutorials/file/filesystem/

FileSystem = new function() {
    var self = this;
    self.streamUrl = null;
    self.fileSystem = null;
    self.savePhotoCallback = null;
    
    self.initialize = function() {
        // request access to a sandboxed file system
        window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
        
        // Initiate filesystem on page load
        if (window.requestFileSystem) {
            self.initFS();
        }

        if (navigator.webkitGetUserMedia) {
            self.startVideo();
        }
        
    };
    
    self.initFS = function() {
        var quotaBytes = 10*1024*1024; // 10 MB
        window.requestFileSystem(
                window.PERSISTENT, // TEMPORARY, PERSISTENT
                quotaBytes,
                self.onInitFs,
                self.errorHandler);
    };
    
    self.onInitFs = function(fs) {
        //console.log('FileSystem onInitFs() Opened file system: ' + fs.name);
        Helper.printObjectProperties(fs);
        var quotaBytes = 10*1024*1024; // 10 MB
        
        if (window.webkitStorageInfo && window.webkitStorageInfo.requestQuota) {
            window.webkitStorageInfo.requestQuota(webkitStorageInfo.PERSISTENT, quotaBytes);
        }
        self.fileSystem = fs;
    };

    self.saveCanvasAsImage = function(fileName, callback) {
        console.log("saveCanvasAsImage(): " + fileName);
        self.savePhotoCallback = callback;
        
        //create image file
        self.fileSystem.root.getFile(fileName, {create:true}, function(fileEntry) {
            //start file writer
            console.log("start file writer");
            
            fileEntry.createWriter(function(fileWriter) {
                console.log("createWriter");
                var image = $("#itemPhoto")[0];
                
                var url = "";
                try {
                    url = image.toDataURL("image/png");
                } catch (err) {
                    console.log("Exception: image.toDataURL: " + err.toString());
                    self.savePhotoCallback(false);
                    return;
                }
                console.log("url: " + url);

                //write base64 data as blob to file
                fileWriter.onwriteend = function(e) {
                    console.log('Write Ended: ' + e.toString());
                    self.savePhotoCallback(true);
                    //showInfoDialog('File saved.');
                };

                fileWriter.onerror = function(e) {
                    console.log('Write failed: ' + e.toString());
                    self.savePhotoCallback(false);
                    //showInfoDialog('File saving failed.');
                };
                fileWriter.write(self.dataURItoBlob(url));
            }, self.errorHandler);
        }, self.errorHandler);
    };

    self.dataURItoBlob = function(dataURI, callback) {
        console.log("dataURItoBlob() dataURI: " + dataURI);
        
        // convert base64 to raw binary data held in a string
        // doesn't handle URLEncoded DataURIs
        var byteString = atob(dataURI.split(",")[1]);

        // separate out the mime component
        var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

        // write the bytes of the string to an ArrayBuffer
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        // write the ArrayBuffer to a blob, and you're done
        var bb = new window.WebKitBlobBuilder();
        bb.append(ab);
        return bb.getBlob(mimeString);
    };
    
    self.errorHandler = function(e) {
        var msg = '';

        switch (e.code) {
        case FileError.QUOTA_EXCEEDED_ERR:
            msg = 'QUOTA_EXCEEDED_ERR';
            break;
        case FileError.NOT_FOUND_ERR:
            msg = 'NOT_FOUND_ERR';
            break;
        case FileError.SECURITY_ERR:
            msg = 'SECURITY_ERR';
            break;
        case FileError.INVALID_MODIFICATION_ERR:
            msg = 'INVALID_MODIFICATION_ERR';
            break;
        case FileError.INVALID_STATE_ERR:
            msg = 'INVALID_STATE_ERR';
            break;
        default:
            msg = 'Unknown Error';
        break;
        }

        console.log('FileSystem Error: ' + msg);
        //showInfoDialog('FileSystem Error: ' + msg);
        self.savePhotoCallback(false);
    };    
    
    // http://www.html5rocks.com/en/tutorials/video/basics/
    // http://www.html5rocks.com/en/tutorials/getusermedia/intro/
    self.getVideoStream = function() {
        function gotStream(stream) {
            var url = webkitURL.createObjectURL(stream);
            window.localStorage.setItem( "videoStreamUrl", url );
            //console.log("FileSystem gotStream() url: " + url);
        }

        function errorHandler(e) {
            window.localStorage.setItem( "videoStreamUrl", "" );
        }

        try {
            // slp and chrome pre 20.0.1132.3 dev
            navigator.webkitGetUserMedia("video user", gotStream, errorHandler);
        } catch (err) {
            // starting with chrome Version 20.0.1132.3 dev
            navigator.webkitGetUserMedia( {video:true}, gotStream, errorHandler);
        }
    };

    self.startVideo = function() {
        var streamUrl = window.localStorage.getItem( "videoStreamUrl" );
        //console.log("FileSystem startVideo() streamUrl: " + streamUrl);

        if ( streamUrl === null ) {
            self.getVideoStream();
        }
    };
    
    return self;
}