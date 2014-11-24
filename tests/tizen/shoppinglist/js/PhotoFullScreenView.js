/*
 * Copyright (c) 2012, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

var IMAGE_TYPE = {
        "GALLERY_IMAGE": 0,
        "CAMERA_IMAGE": 1,
        "NONE": 2
};

var currentPhotoFullScreenView;

function PhotoFullScreenView() {
    var self = this;
    self.imageType = IMAGE_TYPE.GALLERY_IMAGE; // default

    document.getElementById('delete_photo').innerHTML = Localizer.getTranslation("delete_text");
    document.getElementById('change_photo').innerHTML = Localizer.getTranslation("change_text");
    document.getElementById('save_photo').innerHTML = Localizer.getTranslation("save_text");

    self.itemPhoto = document.getElementById("photofullscreen_view_item_photo");
    self.itemPhoto.setAttribute("src", "");
    self.itemPhoto.value = "";
    self.itemPhoto.style.display = 'none';
    
    self.itemCanvas = document.getElementById("photofullscreen_view_itemCanvas");
    self.itemCanvas.style.display = 'none';

    self.itemVideo = document.getElementById("photofullscreen_view_itemVideo");
    self.itemVideo.style.display = 'none';
    
    document.getElementById("photofullscreen_view_close_button").onclick = function() {
        ShoppingListApp.buttonClick03Audio.play();
        self.hide();
    };

    document.getElementById("photofullscreen_view_delete_text_button").onclick = function() {
        ShoppingListApp.buttonClick03Audio.play();
        self.onDeleteClicked();
    };

    document.getElementById("photofullscreen_view_change_text_button").onclick = function() {
        ShoppingListApp.buttonClick03Audio.play();
        self.onChangeClicked();
    };

    document.getElementById("photofullscreen_view_save_text_button").onclick = function() {
        ShoppingListApp.buttonClick03Audio.play();
        self.onSaveClicked();
    };

    self.itemVideo.onclick = function() {
        ShoppingListApp.buttonClick03Audio.play();
        self.takePhoto();
    }
    
}

PhotoFullScreenView.prototype.show = function(imageType, photoPath) {
    var self = photoFullScreenView;
    currentPhotoFullScreenView = photoFullScreenView;
    
    if (imageType == IMAGE_TYPE.GALLERY_IMAGE) {
        self.imageType = IMAGE_TYPE.GALLERY_IMAGE;
        self.itemCanvas.style.display = 'none'; // hide canvas
        
        self.updateStyles();
        self.itemPhoto.setAttribute("src", photoPath);
        self.itemPhoto.value = photoPath;
        self.itemPhoto.style.display = 'block';
        document.getElementById('photofullscreen-view').style.display = 'block';
    }
    else if(imageType == IMAGE_TYPE.CAMERA_IMAGE) {
        self.imageType = IMAGE_TYPE.CAMERA_IMAGE;
        self.itemPhoto.style.display = 'none'; // hide img element
        
        try {
            // camera picture - take imagedata from canvas
            var $canvas = $("#itemPhoto");
            var context = $canvas[0].getContext("2d");
            console.log($canvas[0].width + "  " +  $canvas[0].height);
            var imageData = context.getImageData(0, 0, $canvas[0].width, $canvas[0].height);
            
            var $fullScreencanvas = $("#photofullscreen_view_itemCanvas");
            $fullScreencanvas[0].width = $canvas[0].width;
            $fullScreencanvas[0].height =  $canvas[0].height;
            var fullScreenContext = $fullScreencanvas[0].getContext("2d");
            fullScreenContext.putImageData(imageData, 0, 0);
        } catch (err) {
            console.log("Exception: getImageData(): " + err.toString());
            showInfoDialog(Localizer.getTranslation("image_data_reading_failed"));
        }

        self.itemCanvas.style.display = 'block';
        document.getElementById('photofullscreen-view').style.display = 'block';
    }
}

PhotoFullScreenView.prototype.hide = function() {
    currentPhotoFullScreenView = null;
    this.stopVideo();
    this.itemPhoto.setAttribute("src", "");
    this.itemPhoto.style.display = 'none';
    this.itemCanvas.style.display = 'none';
    document.getElementById('photofullscreen-view').style.display = 'none';
}

PhotoFullScreenView.prototype.updateStyles = function() {
    if (isEmpty(this.itemPhoto.src)) {
        return;
    }
    
    var self = photoFullScreenView;
    self.itemPhoto.style.display = 'none';
    
    tempImage = new Image();
    tempImage.src = this.itemPhoto.src;
    
    var viewSize = Helper.getViewSize();
    if (viewSize.width / tempImage.width < viewSize.height / tempImage.height) {
        self.itemPhoto.style.width = "100%";
        self.itemPhoto.style.height = "auto";
        
        self.itemPhoto.style.top = (viewSize.height - tempImage.height)/2 + "px";
        self.itemPhoto.style.left = "0px";
    } else {
        self.itemPhoto.style.height = "100%";
        self.itemPhoto.style.width = "auto";
        
        self.itemPhoto.style.left = (viewSize.width - tempImage.width)/2 + "px";
        self.itemPhoto.style.top = "0px";
    }    
    
    self.itemPhoto.style.display = 'block';
}

PhotoFullScreenView.prototype.onSaveClicked = function() {
    this.hide();
    editItemScreen.setPhoto(photoFullScreenView.imageType, this.itemPhoto.value);
}

PhotoFullScreenView.prototype.onDeleteClicked = function() {
    this.itemPhoto.setAttribute("src", "");
    this.itemPhoto.value = "";
    this.itemPhoto.style.display = 'none';

    var $fullScreencanvas = $("#photofullscreen_view_itemCanvas");
    var fullScreenContext = $fullScreencanvas[0].getContext("2d");
    fullScreenContext.fillStyle = 'blue';
    fullScreenContext.fill();
    this.itemCanvas.style.display = 'none';
    
    photoFullScreenView.imageType = IMAGE_TYPE.NONE;
}

PhotoFullScreenView.prototype.onChangeClicked = function() {
    showPhotoSourceOptions(this.handlePhotoSourceOption);
}

PhotoFullScreenView.prototype.handlePhotoSourceOption = function(option) {
    switch(option) {
    case 1:
        photoFullScreenView.itemPhoto.src = "";
        photoFullScreenView.itemPhoto.style.display = 'none';
        // take_from_camera
        photoFullScreenView.showLiveCamera();
        break;
    case 2:
        // select_from_gallery
        photoFullScreenView.stopVideo();
        selectImageFromGallery(photoFullScreenView.setGalleryPhoto);
        break;
    default:
        break;
    }
}

PhotoFullScreenView.prototype.setGalleryPhoto = function(imageType, photoURI) {
    //imageType = IMAGE_TYPE.GALLERY_IMAGE
    photoFullScreenView.imageType = IMAGE_TYPE.GALLERY_IMAGE;
    photoFullScreenView.show(IMAGE_TYPE.GALLERY_IMAGE, photoURI);
}

PhotoFullScreenView.prototype.showLiveCamera = function() {
    var self = this;
    var streamUrl = window.localStorage.getItem( "videoStreamUrl" );
    
    if ( $("#photofullscreen_view_itemVideo")[0].src != streamUrl ) {
        var $thisVideo = $("#photofullscreen_view_itemVideo");
        self.itemVideo.style.display = 'none';
        
        $thisVideo.bind("playing", function() {
            photoFullScreenView.itemCanvas.style.display = 'none';
            photoFullScreenView.itemVideo.style.display = 'block';
        });
        $thisVideo[0].src = streamUrl;
    }
}

PhotoFullScreenView.prototype.takePhoto = function() {
    var self = this;
    self.itemVideo.style.display = 'none';

    if (navigator.webkitGetUserMedia) {
        var $canvas = $("#photofullscreen_view_itemCanvas");
        $canvas[0].width = 388;
        $canvas[0].height = 303;

        var $itemVideo = $("#photofullscreen_view_itemVideo");
        var video = $itemVideo[0];
        
        var context = $canvas[0].getContext("2d");
        context.scale(-1,1);
        context.translate(-388,0);
        context.drawImage( video, 0, 0, 388, 303 );

        self.itemCanvas.style.display = 'block';
        self.imageType = IMAGE_TYPE.CAMERA_IMAGE;
    }
    else {
        showInfoDialog(Localizer.getTranslation("photo_capture_not_supported"));
    }
    
    self.stopVideo();
}

PhotoFullScreenView.prototype.stopVideo = function() {
    var $thisVideo = $("#photofullscreen_view_itemVideo");
    // TODO - stop the video ?
    $("#photofullscreen_view_itemVideo")[0].src = "";
    this.itemVideo.style.display = 'none';
}
