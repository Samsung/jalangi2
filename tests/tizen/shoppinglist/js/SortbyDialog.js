/*
 * Copyright (c) 2012, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

var currentSortbyDialog;

function SortbyDialog(currentSortbyOption, sortOptionHandler) {
    var self = this;
    currentSortbyDialog = self;

    document.getElementById('sortby_title').innerHTML = Localizer.getTranslation("sortby_title");
    document.getElementById('sortby_alphabet_label').innerHTML = Localizer.getTranslation("sortby_alphabet");
    document.getElementById('sortby_store_label').innerHTML = Localizer.getTranslation("sortby_store");
    document.getElementById('sortby_type_label').innerHTML = Localizer.getTranslation("sortby_type");
    document.getElementById('sortby_bought_status_label').innerHTML = Localizer.getTranslation("sortby_bought_status");

    // Initialize with current sort option
    self.selectedOption = currentSortbyOption;
    document.getElementById("sortoption_button_" + currentSortbyOption).setAttribute("class", "selected");
    
    document.getElementById("sortby_close_button").onclick = function() {
        self.hide();
        sortOptionHandler(self.selectedOption);
    };
    
    document.getElementById("shadow").onclick = function() {
        ShoppingListApp.buttonClick03Audio.play();

        self.hide();
        sortOptionHandler(self.selectedOption);
        // clear onclick event for shadow
        this.onclick = function() {
            return true;
        };
    };
    
    document.getElementById("sortby_alphabet").onclick = function() {
        ShoppingListApp.buttonClick03Audio.play();

        self.selectedOption = 1;
        self.clearAllOptions();
        document.getElementById("sortoption_button_1").setAttribute("class", "selected");
    };
    document.getElementById("sortby_store").onclick = function() {
        ShoppingListApp.buttonClick03Audio.play();

        self.selectedOption = 2;
        self.clearAllOptions();
        document.getElementById("sortoption_button_2").setAttribute("class", "selected");
    };
    document.getElementById("sortby_type").onclick = function() {
        ShoppingListApp.buttonClick03Audio.play();

        self.selectedOption = 3;
        self.clearAllOptions();
        document.getElementById("sortoption_button_3").setAttribute("class", "selected");
    };
    document.getElementById("sortby_bought_status").onclick = function() {
        ShoppingListApp.buttonClick03Audio.play();

        self.selectedOption = 4;
        self.clearAllOptions();
        document.getElementById("sortoption_button_4").setAttribute("class", "selected");
    };
}

SortbyDialog.prototype.clearAllOptions = function() {
    document.getElementById("sortoption_button_1").setAttribute("class", "");
    document.getElementById("sortoption_button_2").setAttribute("class", "");
    document.getElementById("sortoption_button_3").setAttribute("class", "");
    document.getElementById("sortoption_button_4").setAttribute("class", "");
}

SortbyDialog.prototype.show = function() {
    ShoppingListApp.buttonClick03Audio.play();

    this.updateStyles();
    document.getElementById('shadow').style.display = 'block';
    document.getElementById('sortbydialog').style.display = 'block';
}

SortbyDialog.prototype.hide = function() {
    ShoppingListApp.buttonClick03Audio.play();

    document.getElementById('shadow').style.display = 'none';
    document.getElementById('sortbydialog').style.display = 'none';
}

SortbyDialog.prototype.updateStyles = function() {
    var dialogElement = document.getElementById('sortbydialog');
    if(Helper.isLandscape()) {
        dialogElement.setAttribute("class", "landscape");
    }
    else {
        dialogElement.setAttribute("class", "portrait");
    }
}

function showSortbyDialog(currentSortbyOption, sortOptionHandler) {
    var dialog = new SortbyDialog(currentSortbyOption, sortOptionHandler);
    dialog.show();
}
