/*
 * Copyright (c) 2012, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

var streamUrl = null;

function EditItemScreen() {
    var self = this;
    self.viewMode = VIEW_MODE.NEW;
    self.photoCaptured = false;

    self.videoMask = document.getElementById('videoMask');
    self.videoItem = document.getElementById('itemVideo');
    self.itemCanvas = document.getElementById('itemPhoto');
    
    self.itemName = document.getElementById("item_name_input");
    self.listName = document.getElementById("item_list_input");
    self.itemType = document.getElementById("item_type_input");
    self.itemStore = document.getElementById("item_store_input");
    self.itemPhoto = document.getElementById("edititem_view_item_photo");
    self.itemPhoto.style.display = 'none';
    
    self.addPhotoButton = document.getElementById("edititem_view_add_photo");
    self.itemPhotoCanvas = document.getElementById("itemPhoto");
    self.itemVideoMask = document.getElementById("itemVideoMask");
    
    var saveButton = document.getElementById("edititem_view_save_text_button");
    saveButton.onclick = function() {
        ShoppingListApp.buttonClick03Audio.play();
        if(self.onSaveClicked()) {
            self.hide();
        }
    };

    document.getElementById("edititem_view_addto_favorites_button").onclick = function() {
        ShoppingListApp.buttonClick03Audio.play();
        self.onAddToFavoritesClicked();
    };
    
    document.getElementById("edititem_view_addfrom_favorites_button").onclick = function() {
        ShoppingListApp.buttonClick03Audio.play();
        self.onAddFromFavoritesClicked();
    };
    
    document.getElementById("edititem_view_delete_text_button").onclick = function() {
        ShoppingListApp.buttonClick03Audio.play();
        self.onDeleteClicked();
    };
    
    document.getElementById("edititem_view_close_button").onclick = function() {
        ShoppingListApp.buttonClick03Audio.play();
        self.resetForm();
        self.hide();
    };
    
    document.getElementById("edititem_list_button").onclick = function() {
        ShoppingListApp.buttonClick03Audio.play();
        MyListSelectionDialog.showListSelectionDialog(self.listitemSelectedCallback);
    };
    
    document.getElementById("edititem_stores_button").onclick = function() {
        ShoppingListApp.buttonClick03Audio.play();
        MyStoreSelectionDialog.showStoreSelectionDialog(self.storeitemSelectedCallback);
    };
    
    document.getElementById("edititem_view_add_photo").style.display = 'block';
    document.getElementById("edititem_view_add_photo").onclick = function() {
        ShoppingListApp.buttonClick03Audio.play();
        self.onAddPhotoButtonClicked();
    };
    
    document.getElementById("edititem_view_item_photo").onclick = function() {
        ShoppingListApp.buttonClick03Audio.play();
        // open Photo full screen view
        photoFullScreenView.show(IMAGE_TYPE.GALLERY_IMAGE, self.itemPhoto.value);
    }
    
    self.videoItem.onclick = function() {
        ShoppingListApp.buttonClick03Audio.play();
        self.takePhoto();
    }
    
    self.itemCanvas.onclick = function() {
        ShoppingListApp.buttonClick03Audio.play();
        photoFullScreenView.show(IMAGE_TYPE.CAMERA_IMAGE, "itemPhoto");
    }
}

EditItemScreen.prototype.resetForm = function() {
    this.itemName.value = "";
    this.listName.value = "";
    this.itemType.value = "";
    this.itemStore.value = "";
    this.itemPhoto.value = "";
    this.itemPhoto.setAttribute("src", "");
    this.photoCaptured = false;
    // clear the list color
    document.getElementById("edititem_listcolor").style.backgroundColor = "#CCCCCC";
}

EditItemScreen.prototype.show = function(viewMode, itemId) {
    ShoppingListApp.buttonClick03Audio.play();

    this.viewMode = viewMode;
    this.itemId = itemId;
    this.photoCaptured = false;
    
    if(viewMode == VIEW_MODE.NEW) {
        this.resetForm();
        
        document.getElementById( "edititem_view_title" ).innerHTML = Localizer.getTranslation("add_item");
        document.getElementById("edititem_view_addto_favorites_button").style.display = 'none';
        document.getElementById("edititem_view_delete_text_button").style.display = 'none';
        document.getElementById("edititem_view_addfrom_favorites_button").style.display = 'block';

        // show "Add Photo"
        document.getElementById("edititem_view_add_photo").style.display = 'block';
        this.itemPhoto.style.display = 'none'; // hide the photo content area
        this.videoMask.style.display = 'none';
        this.videoItem.style.display = 'none';
        this.itemCanvas.style.display = 'none';
    }
    else { // EDIT mode
        document.getElementById( "edititem_view_title" ).innerHTML = Localizer.getTranslation("edit_item");
        document.getElementById("edititem_view_addto_favorites_button").style.display = 'block';
        document.getElementById("edititem_view_delete_text_button").style.display = 'block';
        document.getElementById("edititem_view_addfrom_favorites_button").style.display = 'none';
        
        document.getElementById("edititem_view_add_photo").style.display = 'block';
        this.itemPhoto.style.display = 'none';
        this.itemCanvas.style.display = 'none';
        // get the row from item table and fill the fields
        ShoppingListApp.DBManager.selectSingleItem(itemId, this.itemQueryCallBack);
    }

    document.getElementById("item_name_label").innerHTML = Localizer.getTranslation("item_name_label");
    document.getElementById("item_list_label").innerHTML = Localizer.getTranslation("item_list_label");
    document.getElementById("item_type_label").innerHTML = Localizer.getTranslation("item_type_label");
    document.getElementById("item_store_label").innerHTML = Localizer.getTranslation("item_store_label");
    document.getElementById("photo_label").innerHTML = Localizer.getTranslation("photo_label");
    document.getElementById("add_photo_label").innerHTML = Localizer.getTranslation("add_photo_label");
    document.getElementById("edititem_add_from_my_favorites_text").innerHTML = Localizer.getTranslation("add_from_my_favorites");
    document.getElementById("edititem_delete_text").innerHTML = Localizer.getTranslation("delete_text");
    document.getElementById("edititem_save_text").innerHTML = Localizer.getTranslation("save_text");

    var view = document.getElementById('edititem-view');
    view.style.display = 'block';
    this.startVideo();
}

EditItemScreen.prototype.hide = function() {
    this.stopVideo();
    var view = document.getElementById('edititem-view');
    view.style.display = 'none';
}

EditItemScreen.prototype.onSaveClicked = function() {
    ShoppingListApp.buttonClick03Audio.play();

    var self = this;
    var itemName = self.itemName.value;
    var listName = self.listName.value;

    if (isEmpty(itemName)) {
        showInfoDialog(Localizer.getTranslation("item_name_is_empty"));
        return false;
    }
    if (isEmpty(listName)) {
        showInfoDialog(Localizer.getTranslation("list_is_empty"));
        return false;
    }
    
    // check if item already exists in the same list
    ShoppingListApp.DBManager.searchItemFromList(itemName, listName, self.itemNameQueryCallBack);
    return true;
}

EditItemScreen.prototype.onAddToFavoritesClicked = function() {
    if(this.favorite) {
        ShoppingListApp.DBManager.updateItemFavoriteById(this.itemId, 0);
        this.favorite = 0;
        this.setAddtoFavoritesButton(0);
    }
    else {
        ShoppingListApp.DBManager.updateItemFavoriteById(this.itemId, 1);
        this.favorite = 1;
        this.setAddtoFavoritesButton(1);
    }
    ShoppingListApp.updateCurrentList();
}

EditItemScreen.prototype.onAddFromFavoritesClicked = function() {
    showFavoritesView();
}

EditItemScreen.prototype.onDeleteClicked = function() {
    ShoppingListApp.DBManager.deleteItem(this.itemId);
    this.hide();
    // Refresh Main View
    ShoppingListApp.updateListOfLists();
    ShoppingListApp.updateCurrentList();
}

//List selection handling
EditItemScreen.prototype.listitemSelectedCallback = function(listName, listColor) {
    editItemScreen.listName.value = listName;
    var list = document.getElementById("edititem_listcolor");
    list.style.backgroundColor = ColorTable.COLOR[listColor];
}

// Store selection handling
EditItemScreen.prototype.storeitemSelectedCallback = function(storeName) {
    editItemScreen.itemStore.value = storeName;
}

// Photo handling 
EditItemScreen.prototype.onAddPhotoButtonClicked = function() {
    showPhotoSourceOptions(this.handlePhotoSourceOption);
}

EditItemScreen.prototype.handlePhotoSourceOption = function(option) {
    switch(option) {
    case 1:
        // take_from_camera
        editItemScreen.showLiveCamera();
        break;
    case 2:
        // select_from_gallery
        selectImageFromGallery(editItemScreen.setPhoto);
        break;
    default:
        break;
    }
}

EditItemScreen.prototype.startVideo = function() {
    var self = this;
    streamUrl = window.localStorage.getItem( "videoStreamUrl" );
    
    $("#itemVideo").height( 291 ).bind("play", function() {
        var thisWidth = $(this).width();
        var border = 6; //(thisWidth - 240)/2;

        self.videoMask.style.display = 'inline';
    } );    
}

EditItemScreen.prototype.stopVideo = function() {
    $("#itemVideo")[0].src = "";
    this.videoMask.style.display = 'none';
    this.videoItem.style.display = 'none';
}

EditItemScreen.prototype.showLiveCamera = function() {
    var self = this;
    document.getElementById("edititem_view_add_photo").style.display = "none";
    self.videoMask.style.display = 'inline';
    
    var streamUrl = window.localStorage.getItem( "videoStreamUrl" );
    
    if ( $("#itemVideo")[0].src != streamUrl ) {
        var $thisVideo = $("#itemVideo");
        self.videoItem.style.display = 'none';
        self.itemCanvas.style.display = 'none';
        
        $thisVideo.bind("playing", function() {
            editItemScreen.itemCanvas.style.display = 'none';
            editItemScreen.videoItem.style.display = 'block';
        });
        $thisVideo[0].src = streamUrl;
    }
}

EditItemScreen.prototype.takePhoto = function() {
    var self = this;
    console.log("--> takePhoto()");

    self.videoMask.style.display = 'none';
    self.videoItem.style.display = 'none';
    
    if (navigator.webkitGetUserMedia) {
        var $canvas = $("#itemPhoto");
        $canvas[0].width = 320; // 388
        $canvas[0].height = 291;

        var $itemVideo = $("#itemVideo");
        var video = $itemVideo[0];
        
        var context = $canvas[0].getContext("2d");
        context.scale(-1,1);
        context.translate(-320,0);
        
        context.drawImage( video, 0, 0, 320, 291 );
        this.itemCanvas.style.display = 'block';
        this.photoCaptured = true;
    }
    else {
        showInfoDialog(Localizer.getTranslation("photo_capture_not_supported"));
        document.getElementById("edititem_view_add_photo").style.display = "block";
    }
    
    self.stopVideo();
    console.log("<-- takePhoto()");
}

EditItemScreen.prototype.setPhoto = function(imageType, photoURI) {
    editItemScreen.photoCaptured = false;
    document.getElementById("edititem_view_add_photo").style.display = 'none';
    
    if(imageType == IMAGE_TYPE.GALLERY_IMAGE) {
        // show photo img
        editItemScreen.itemPhoto.style.display = 'block';
        editItemScreen.itemPhoto.setAttribute("src", photoURI);
        editItemScreen.itemPhoto.value = photoURI;
        editItemScreen.itemCanvas.style.display = 'none';
    }
    else if(imageType == IMAGE_TYPE.CAMERA_IMAGE) {
        editItemScreen.photoCaptured = true;
        
        // show photo from camera on canvas
        try {
            // camera picture - take imagedata from canvas
            var $fullScreencanvas = $("#photofullscreen_view_itemCanvas");
            var fullScreenContext = $fullScreencanvas[0].getContext("2d");
            console.log($fullScreencanvas[0].width + "  " +  $fullScreencanvas[0].height);
            var imageData = fullScreenContext.getImageData(0, 0, $fullScreencanvas[0].width, $fullScreencanvas[0].height);
            
            var $canvas = $("#itemPhoto");
            $canvas[0].width = $fullScreencanvas[0].width;
            $canvas[0].height =  $fullScreencanvas[0].height;
            
            var context = $canvas[0].getContext("2d");
            context.putImageData(imageData, 0, 0);
        } catch (err) {
            console.log("Exception: getImageData(): " + err.toString());
            showInfoDialog(Localizer.getTranslation("image_data_reading_failed"));
        }
        editItemScreen.itemCanvas.style.display = 'block';
        editItemScreen.itemPhoto.style.display = 'none';
    }
    else if (imageType == IMAGE_TYPE.NONE) {
        // show "add photo"
        document.getElementById("edititem_view_add_photo").style.display = 'block';
    }
}

EditItemScreen.prototype.onListInstalledApplications = function(applications) {
    for (var i = 0; i < applications.length; i++) {
        console.log("");
        Helper.printObjectProperties(applications[i]);
    }
}

EditItemScreen.prototype.savePhotoInsertCallback = function(result) {
    if (result == true) {
        // photo has been saved successfully, insert the item
        editItemScreen.doInsertItem();
    }
    else {
        editItemScreen.itemPhoto.value = "";
        // photo saving failed. show question dialog 
        showQuestionDialog(
                Localizer.getTranslation("photo_saving_failed_do_you_want_to_save"),
                null, // No button handler
                editItemScreen.doInsertItem);
    }
}

EditItemScreen.prototype.insertItem = function() {
    var self = editItemScreen;
    // if photo has been captured from Camera
    if (isEmpty(editItemScreen.itemPhoto.value) && self.photoCaptured == true) {
        // First save the photo and then insert the item into database
        var currentDate = new Date();
        var h = currentDate.getHours();
        var m = currentDate.getMinutes();
        var s = currentDate.getSeconds();
        var t = h + "" + m + "" + s;
        var d = currentDate.getDate()+""+ currentDate.getMonth() + ""+ currentDate.getFullYear();
        self.itemPhoto.value = d + t + self.itemName.value + ".png";
        FileSystem.saveCanvasAsImage(self.itemPhoto.value, self.savePhotoInsertCallback);
    }
    else {
        // Insert item directly
        self.doInsertItem();
    }
}

EditItemScreen.prototype.doInsertItem = function() {
    // insert item
    ShoppingListApp.DBManager.insertItem(
            editItemScreen.itemName.value,
            editItemScreen.listName.value,
            editItemScreen.itemStore.value,
            editItemScreen.itemType.value,
            editItemScreen.itemPhoto.value);
    // Refresh Main View
    ShoppingListApp.updateListOfLists();
    ShoppingListApp.updateCurrentList();
}

EditItemScreen.prototype.updateItem = function() {
    // if photo has been captured from Camera
    if (editItemScreen.photoCaptured == true) {
        // First save the photo and then insert the item into database
        var currentDate = new Date();
        var h = currentDate.getHours();
        var m = currentDate.getMinutes();
        var s = currentDate.getSeconds();
        var t = h + "" + m + "" + s;
        var d = currentDate.getDate()+""+ currentDate.getMonth() + ""+ currentDate.getFullYear();
        editItemScreen.itemPhoto.value = d + t + editItemScreen.itemName.value + ".png";
        FileSystem.saveCanvasAsImage(editItemScreen.itemPhoto.value, editItemScreen.savePhotoUpdateCallback);
    }
    else {
        // update the item directly
        editItemScreen.doUpdateItem();
    }
}

EditItemScreen.prototype.doUpdateItem = function() {
    ShoppingListApp.DBManager.updateItem(
            editItemScreen.itemId,
            editItemScreen.itemName.value,
            editItemScreen.listName.value,
            editItemScreen.itemStore.value,
            editItemScreen.itemType.value,
            editItemScreen.itemPhoto.value);
    // Refresh Main View
    ShoppingListApp.updateListOfLists();
    ShoppingListApp.updateCurrentList();
}

EditItemScreen.prototype.savePhotoUpdateCallback = function(result) {
    if (result == true) {
        // photo has been saved successfully, update the item
        editItemScreen.doUpdateItem();
    }
    else {
        // photo saving failed. show question dialog
        editItemScreen.itemPhoto.value = "";
        showQuestionDialog(
                Localizer.getTranslation("photo_saving_failed_do_you_want_to_save"),
                null, // No button handler
                editItemScreen.doUpdateItem);
    }
}

// to fill the form
EditItemScreen.prototype.itemQueryCallBack = function(dataset) {
    if (typeof dataset == "undefined" || dataset.length != 1) {
        showInfoDialog(Localizer.getTranslation("database_error"));
        return;
    }

    var item = dataset.item(0);
    if (typeof item._id != "undefined") {
        editItemScreen.itemName.value = item.name;
        editItemScreen.listName.value = item.list;
        editItemScreen.itemStore.value = item.store;
        editItemScreen.itemType.value = item.type;
        editItemScreen.itemPhoto.value = item.image;
        
        editItemScreen.favorite = item.favorite;
        editItemScreen.setAddtoFavoritesButton(editItemScreen.favorite);

        if (!isEmpty(editItemScreen.itemPhoto.value)) {
            editItemScreen.itemPhoto.setAttribute("src", editItemScreen.itemPhoto.value);
            editItemScreen.itemPhoto.style.display = 'block';
            document.getElementById("edititem_view_add_photo").style.display = 'none';
        }
        
        // this selects list name and color also. To set the color box
        ShoppingListApp.DBManager.selectListName(item.list,
                editItemScreen.listQueryCallBack);
    }
}

EditItemScreen.prototype.setAddtoFavoritesButton = function(favorite) {
    if (favorite == 1) {
        document.getElementById("edititem_view_addto_favorites_button").style.backgroundImage
            = "url('./images/btn_faves_03.png')";
    } else {
        document.getElementById("edititem_view_addto_favorites_button").style.backgroundImage
            = "url('./images/btn_faves_01.png')";
    }
}

// To get list color and set the color box
EditItemScreen.prototype.listQueryCallBack = function(dataset) {
    if (typeof dataset == "undefined" || dataset.length == 0) {
        showInfoDialog(Localizer.getTranslation("database_error"));
        return;
    }

    var item = dataset.item(0);
    if (typeof item.color != "undefined") {
        // set list color
        document.getElementById("edititem_listcolor").style.backgroundColor = ColorTable.COLOR[item.color];
    }
}

// Items Query - for duplicate checking
EditItemScreen.prototype.itemNameQueryCallBack = function(dataset) {
    if (typeof dataset == "undefined") {
        showInfoDialog(Localizer.getTranslation("database_error"));
        return;
    }
    
    if (dataset.length == 0) {
        if (editItemScreen.viewMode == VIEW_MODE.NEW) {
            // insert new row
            editItemScreen.insertItem();
        }
        else if (editItemScreen.viewMode == VIEW_MODE.EDIT) {
            // update the item in the table with _id
            editItemScreen.updateItem();
        }
    }
    // if item exists in the list already
    else {
        var itemName = document.getElementById("item_name_input").value;
        var listName = document.getElementById("item_list_input").value;

        if (editItemScreen.viewMode == VIEW_MODE.NEW) {
            showQuestionDialog(
                    itemName + Localizer.getTranslation("already_exists_in_the") + listName + Localizer.getTranslation("do_you_want_to_add_anyway"),
                    null, // No button handler
                    editItemScreen.insertItem);
        }
        else if (editItemScreen.viewMode == VIEW_MODE.EDIT) {
            // update the item in the table with _id
            editItemScreen.updateItem();
        }
    }
}

