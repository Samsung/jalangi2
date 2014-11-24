/*
 * Copyright (c) 2012, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

var VIEW_MODE = {
        "NEW": 0,
        "EDIT": 1
};

function EditListScreen() {
    var self = this;

    // Get the UI elements that we can interact with.
    self.listName = document.getElementById("list_name");
    self.listTypeColor = "";
    self.viewMode = VIEW_MODE.NEW;
    
    var saveButton = document.getElementById("save_text_button");
    saveButton.onclick = function() {
        ShoppingListApp.buttonClick03Audio.play();

        if(self.onSaveClicked()) {
            self.hide();
        }
    };

    document.getElementById("editlist_save_text").innerHTML = Localizer.getTranslation("save_text");

    document.getElementById("close_button").onclick = function() {
        ShoppingListApp.buttonClick03Audio.play();

        self.hide();
    };
}

EditListScreen.prototype.updateColorLabel = function() {
    if (Helper.isLandscape()) {
        document.getElementById( "list_color_label_id" ).innerHTML = Localizer.getTranslation("choose_color");
    }
    else {
        document.getElementById( "list_color_label_id" ).innerHTML = Localizer.getTranslation("item_type");
    }
}

EditListScreen.prototype.resetForm = function() {
    this.listName.value = "";
    this.unSelectColor(this.listTypeColor);
    this.listTypeColor = "";
}

EditListScreen.prototype.show = function(viewMode, oldListName, oldListColor) {
    ShoppingListApp.buttonClick03Audio.play();

    this.viewMode = viewMode;
    this.oldListName = oldListName;
    
    if(viewMode == VIEW_MODE.NEW) {
        this.resetForm();
        document.getElementById( "title_id" ).innerHTML = Localizer.getTranslation("create_new_list");
    }
    else { // EDIT mode
        document.getElementById( "title_id" ).innerHTML = Localizer.getTranslation("edit_list");
        this.listName.value = oldListName;
        this.unSelectColor(this.listTypeColor);
        this.selectColor(oldListColor);
        this.listTypeColor = oldListColor;
    }
    
    document.getElementById( "list_name_label_id" ).innerHTML = Localizer.getTranslation("name_of_list");
    this.updateColorLabel();
    document.getElementById('edit-list-view').style.display = 'block';
}

EditListScreen.prototype.hide = function() {
    document.getElementById('edit-list-view').style.display = 'none';
}

EditListScreen.prototype.onSaveClicked = function() {
    var self = this;
    var listName = self.listName.value;
    if (isEmpty(listName)) {
        showInfoDialog(Localizer.getTranslation("list_name_is_empty"));
        return false;
    }
    if (isEmpty(self.listTypeColor)) {
        showInfoDialog(Localizer.getTranslation("list_color_is_empty"));
        return false;
    }
    
    // check if list already exists
    ShoppingListApp.DBManager.selectListName(listName, self.listNameQueryCallBack);
    return true;
}

EditListScreen.prototype.listTypeColorClick = function(color) {
    // un-select the current color
    this.unSelectColor(this.listTypeColor);
    
    this.listTypeColor = color;
    
    // show indication of selected color
    this.selectColor(this.listTypeColor);
}

EditListScreen.prototype.unSelectColor = function(color) {
    if (!isEmpty(color)) {
        document.getElementById(color).style.border = '2px solid #414042';
        document.getElementById(color).style.marginLeft = '16px';
        document.getElementById(color).style.marginTop = '16px';
    }
}

EditListScreen.prototype.selectColor = function(color) {
     // TODO - use "selected" css class?
    if (!isEmpty(color)) {
        document.getElementById(color).style.border = '8px solid #414042';
        document.getElementById(color).style.marginLeft = '8px';
        document.getElementById(color).style.marginTop = '8px';
    }
}

EditListScreen.prototype.listNameQueryCallBack = function(dataset) {
    if (typeof dataset == "undefined") {
        showInfoDialog(Localizer.getTranslation("database_error"));
        return;
    }
    
    // if list does not exist
    if (dataset.length == 0) {

        if (editListScreen.viewMode == VIEW_MODE.NEW) {
            // insert new row
            ShoppingListApp.DBManager.insertList(
                    editListScreen.listName.value,
                    editListScreen.listTypeColor);
        }
        else if (editListScreen.viewMode == VIEW_MODE.EDIT) {
            // list name (and may be color also) has been changed.
            // So, update list name and color
            ShoppingListApp.DBManager.updateList(
                    editListScreen.listName.value,
                    editListScreen.listTypeColor,
                    editListScreen.oldListName);
            
            // update items list name
            ShoppingListApp.DBManager.updateItemsListName(
                    editListScreen.listName.value, // new name
                    editListScreen.oldListName);

            // Notify ShoppingListApp that a list name has changed.
            ShoppingListApp.updateListOrStoreName(editListScreen.oldListName, editListScreen.listName.value);
        }
    }
    // if list already exists
    else {
        if (editListScreen.viewMode == VIEW_MODE.NEW) {
            showInfoDialog(Localizer.getTranslation("list") + editListScreen.listName.value + 
                    Localizer.getTranslation("already_exists_define_other_name"));
        }
        else if (editListScreen.viewMode == VIEW_MODE.EDIT) {
            // color might have been changed. So, update the list
            ShoppingListApp.DBManager.updateListColor(
                    editListScreen.listName.value,
                    editListScreen.listTypeColor);
        }
    }

    // Refresh Main View
    ShoppingListApp.updateListOfLists();
}

