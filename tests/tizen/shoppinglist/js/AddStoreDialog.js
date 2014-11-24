/*
 * Copyright (c) 2012, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

var currentAddStoreDialog;

function AddStoreDialog() {
    var self = this;
    currentAddStoreDialog = self;
    self.storeName = document.getElementById("storename_input");
    var saveButton = document.getElementById("addstore_save_text_button");
    saveButton.onclick = function() {
        ShoppingListApp.buttonClick03Audio.play();

        if(self.onSaveClicked()) {
            self.hide();
        }
    };

    document.getElementById("addstore_dialog_close_button").onclick = function() {
        ShoppingListApp.buttonClick03Audio.play();

        self.hide();
    };
}

AddStoreDialog.prototype.onSaveClicked = function() {
    var storeName = this.storeName.value;
    if (isEmpty(storeName)) {
        // continue showing shadow.
        showInfoDialog(Localizer.getTranslation("store_name_is_empty"), 1); // keep shadow
        return false;
    }

    // check if store is already exists
    ShoppingListApp.DBManager.selectStoreName(storeName, this.storeNameQueryCallBack);
    return true;
}

AddStoreDialog.prototype.resetForm = function() {
    this.storeName.value = "";
}

AddStoreDialog.prototype.show = function(viewMode, oldStoreName) {
    ShoppingListApp.buttonClick03Audio.play();

    this.viewMode = viewMode;
    this.oldStoreName = oldStoreName;
    
    if(viewMode == VIEW_MODE.NEW) {
        this.resetForm();
        document.getElementById("addstore_dialog_title_id").innerHTML = Localizer.getTranslation("add_store");
    }
    else { // EDIT mode
        document.getElementById("addstore_dialog_title_id").innerHTML = Localizer.getTranslation("edit_store");
        this.storeName.value = oldStoreName;
    }

    document.getElementById("storename_label").innerHTML = Localizer.getTranslation("storename_label");
    document.getElementById("addstore_save_text").innerHTML = Localizer.getTranslation("save_text");

    this.updateStyles();
    document.getElementById('shadow').style.display = 'block';
    document.getElementById('addstore-dialog').style.display = 'block';
}

AddStoreDialog.prototype.hide = function() {
    document.getElementById('shadow').style.display = 'none';
    document.getElementById('addstore-dialog').style.display = 'none';
}

AddStoreDialog.prototype.updateStyles = function() {
    var dialogElement = document.getElementById('addstore-dialog');
    if (Helper.isLandscape()) {
        dialogElement.setAttribute("class", "landscape");
    }
    else {
        dialogElement.setAttribute("class", "portrait");
    }
    
    var viewSize = Helper.getViewSize();
    dialogElement.style.top = (viewSize.height - 496)/2 + "px";  // 496 is the total height of dialog
}

AddStoreDialog.prototype.storeNameQueryCallBack = function(aDataset) {
    if (typeof aDataset == "undefined") {
        showInfoDialog(Localizer.getTranslation("database_error"));
        return;
    }
    
    var storeName = document.getElementById("storename_input").value;
    if (aDataset.length == 0) {
        if (addStoreDialog.viewMode == VIEW_MODE.NEW) {
            // insert new store
            ShoppingListApp.DBManager.insertStore(addStoreDialog.storeName.value);
        }
        else if (addStoreDialog.viewMode == VIEW_MODE.EDIT) {
            // store name has been changed. So, update store name
            ShoppingListApp.DBManager.updateStoreName(
                    addStoreDialog.storeName.value,
                    addStoreDialog.oldStoreName);

            // update items with new store name
            ShoppingListApp.DBManager.updateItemsStoreName(
                    addStoreDialog.storeName.value,
                    addStoreDialog.oldStoreName);

            // Notify ShoppingListApp that a store name has changed.
            ShoppingListApp.updateListOrStoreName(addStoreDialog.oldStoreName, addStoreDialog.storeName.value);
        }
    }
    else {
        if (addStoreDialog.viewMode == VIEW_MODE.NEW) {
            showInfoDialog(Localizer.getTranslation("store") + addStoreDialog.storeName.value +
                    Localizer.getTranslation("already_exists_define_other_name"));
        }
        else if (addStoreDialog.viewMode == VIEW_MODE.EDIT) {
            // NOTHING to do.
        }
    }

    // Refresh Main View
    ShoppingListApp.updateListOfLists();
}
