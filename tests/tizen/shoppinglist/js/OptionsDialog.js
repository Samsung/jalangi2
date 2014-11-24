/*
 * Copyright (c) 2012, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

var OPTIONS_TYPE = {
        "LIST": 0,
        "ITEM": 1,
        "STORE": 2,
        "PHOTO_SOURCE": 3
};

var currentOptionsDialog;

function OptionsDialog(optionsType, optionClickHandler, name) {
    var self = this;
    currentOptionsDialog = self;
    self.optionsType = optionsType;
    self.optionClickHandler = optionClickHandler;
    self.optionsCount = 0;

    document.getElementById('options_title').innerHTML = Localizer.getTranslation("options_title") + " | " + name;
    document.getElementById('option1_img').style.display = 'none';
    document.getElementById('option2_img').style.display = 'none';

    document.getElementById('option_1').style.display = 'block';
    document.getElementById('option_2').style.display = 'block';
    document.getElementById('option_3').style.display = 'block';
    document.getElementById('option_4').style.display = 'block';
    document.getElementById('option_5').style.display = 'block';
    
    if(optionsType == OPTIONS_TYPE.ITEM) {
    	self.optionsCount = 3;
        document.getElementById('optiontext_1').innerHTML = Localizer.getTranslation("edit_item");
        document.getElementById('optiontext_2').innerHTML = Localizer.getTranslation("move_item");
        document.getElementById('optiontext_3').innerHTML = Localizer.getTranslation("delete_item");
        document.getElementById('option_4').style.display = 'none';
        document.getElementById('option_5').style.display = 'none';
    }
    else if(optionsType == OPTIONS_TYPE.LIST) {
    	self.optionsCount = 5;
        document.getElementById('optiontext_1').innerHTML = Localizer.getTranslation("edit_list_2");
        document.getElementById('optiontext_2').innerHTML = Localizer.getTranslation("uncheck_all_list_items");
        document.getElementById('optiontext_3').innerHTML = Localizer.getTranslation("move_all_list_items");
        document.getElementById('optiontext_4').innerHTML = Localizer.getTranslation("remove_all_list_items");
        document.getElementById('optiontext_5').innerHTML = Localizer.getTranslation("delete_list");
    }
    else if(optionsType == OPTIONS_TYPE.STORE) {
    	self.optionsCount = 5;
        document.getElementById('optiontext_1').innerHTML = Localizer.getTranslation("change_name");
        document.getElementById('optiontext_2').innerHTML = Localizer.getTranslation("uncheck_all_store_names");
        document.getElementById('optiontext_3').innerHTML = Localizer.getTranslation("move_all_store_items_to");
        document.getElementById('optiontext_4').innerHTML = Localizer.getTranslation("remove_all_store_items");
        document.getElementById('optiontext_5').innerHTML = Localizer.getTranslation("delete_store");
    }
    else if(optionsType == OPTIONS_TYPE.PHOTO_SOURCE) {
    	self.optionsCount = 1; // hide camera option
        document.getElementById('options_title').innerHTML = Localizer.getTranslation("photo_source");
        document.getElementById('optiontext_1').innerHTML = Localizer.getTranslation("take_from_camera");
        document.getElementById('optiontext_2').innerHTML = Localizer.getTranslation("select_from_gallery");

        document.getElementById('option_1').style.display = 'none'; // hide "Take from camera" option
        document.getElementById('option_3').style.display = 'none';
        document.getElementById('option_4').style.display = 'none';
        document.getElementById('option_5').style.display = 'none';
        document.getElementById('option1_img').style.display = 'block';
        document.getElementById('option2_img').style.display = 'block';
    }
    
    document.getElementById('optionsdialog').style.height = (self.optionsCount * 116) + 112 + 'px';
    document.getElementById('options_pane').style.height = (self.optionsCount * 116) + 'px';
    
    document.getElementById("options_close_button").onclick = function() {
       ShoppingListApp.buttonClick03Audio.play();

        self.hide();
    };

    document.getElementById("option_1").onclick = function() {
       ShoppingListApp.buttonClick03Audio.play();

        self.hide();
        self.optionClickHandler(1);
    };
    document.getElementById("option_2").onclick = function() {
       ShoppingListApp.buttonClick03Audio.play();

        self.hide();
        self.optionClickHandler(2);
    };
    document.getElementById("option_3").onclick = function() {
       ShoppingListApp.buttonClick03Audio.play();

        self.hide();
        self.optionClickHandler(3);
    };
    document.getElementById("option_4").onclick = function() {
       ShoppingListApp.buttonClick03Audio.play();

        self.hide();
        self.optionClickHandler(4);
    };
    document.getElementById("option_5").onclick = function() {
       ShoppingListApp.buttonClick03Audio.play();

        self.hide();
        self.optionClickHandler(5);
    };    
}

OptionsDialog.prototype.show = function() {
    ShoppingListApp.buttonClick03Audio.play();

    this.updateStyles();
    document.getElementById('shadow').style.display = 'block';
    document.getElementById('optionsdialog').style.display = 'block';
}

OptionsDialog.prototype.hide = function() {
    ShoppingListApp.buttonClick03Audio.play();

    document.getElementById('shadow').style.display = 'none';
    document.getElementById('optionsdialog').style.display = 'none';
}

OptionsDialog.prototype.updateStyles = function() {
    var dialogElement = document.getElementById('optionsdialog');
    if(Helper.isLandscape()) {
        dialogElement.setAttribute("class", "landscape");
    }
    else {
        dialogElement.setAttribute("class", "portrait");
    }
    var viewSize = Helper.getViewSize();
    dialogElement.style.top = (viewSize.height - ((this.optionsCount * 116) + 112))/2 + "px";
}

// global functions
function showListOptions(optionClickHandler, selectedListName) {
    var dialog = new OptionsDialog(OPTIONS_TYPE.LIST, optionClickHandler, selectedListName);
    dialog.show();
}

function showItemOptions(optionClickHandler, selectedItemName) {
    var dialog = new OptionsDialog(OPTIONS_TYPE.ITEM, optionClickHandler, selectedItemName);
    dialog.show();   
}

function showStoreOptions(optionClickHandler, selectedStoreName) {
    var dialog = new OptionsDialog(OPTIONS_TYPE.STORE, optionClickHandler, selectedStoreName);
    dialog.show();   
}

function showPhotoSourceOptions(optionClickHandler, selectedPhotoSource) {
    var dialog = new OptionsDialog(OPTIONS_TYPE.PHOTO_SOURCE, optionClickHandler, selectedPhotoSource);
    dialog.show();   
}
