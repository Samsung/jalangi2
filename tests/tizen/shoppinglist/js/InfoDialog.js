/*
 * Copyright (c) 2012, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

var DIALOG_TYPE = {
        "INFO": 0,
        "QUESTION": 1
};

var currentInfoDialog;

function InfoDialog(dialogType, message, noButtonHandler, yesButtonHandler, keepShadow) {
    var self = this;
    currentInfoDialog = self;
    self.keepShadow = keepShadow;

    if (dialogType == DIALOG_TYPE.INFO) {
        document.getElementById( "infodialog_title" ).innerHTML = Localizer.getTranslation("info_text");
        document.getElementById( "yes_button_text" ).innerHTML = Localizer.getTranslation("ok_text");
        document.getElementById( "infodialog_no_text_button" ).style.display = 'none';
        document.getElementById( "infodialog_yes_text_button" ).style.marginRight = '14px';
    }
    else if (dialogType == DIALOG_TYPE.QUESTION) {
        document.getElementById( "infodialog_title" ).innerHTML = Localizer.getTranslation("question_text");
        document.getElementById( "yes_button_text" ).innerHTML = Localizer.getTranslation("yes_text");
        document.getElementById( "no_button_text" ).innerHTML = Localizer.getTranslation("no_text");
        document.getElementById( "infodialog_no_text_button" ).style.display = 'block';
        document.getElementById( "infodialog_yes_text_button" ).style.marginRight = '150px';
    }
    document.getElementById( "infodialog_message" ).innerHTML = message;
    
    
    var yesButton = document.getElementById("infodialog_yes_text_button");
    yesButton.onclick = function() {
        ShoppingListApp.buttonClick03Audio.play();

        self.hide();
        if(yesButtonHandler) {
            yesButtonHandler();
        }        
    };
    var noButton = document.getElementById("infodialog_no_text_button");
    noButton.onclick = function() {
        ShoppingListApp.buttonClick03Audio.play();

        self.hide();
        if(noButtonHandler) {
            noButtonHandler();
        }
    };    
}

InfoDialog.prototype.show = function() {
    ShoppingListApp.buttonClick03Audio.play();

    this.updateStyles();
    document.getElementById('shadow').style.display = 'block';
    document.getElementById('infodialog').style.display = 'block';
}

InfoDialog.prototype.hide = function() {
    ShoppingListApp.buttonClick03Audio.play();

    if (!this.keepShadow) {
        document.getElementById('shadow').style.display = 'none';
    }
    document.getElementById('infodialog').style.display = 'none';
}

InfoDialog.prototype.updateStyles = function() {
    var dialogElement = document.getElementById('infodialog');
    if (Helper.isLandscape()) {
        dialogElement.setAttribute("class", "landscape");
    }
    else {
        dialogElement.setAttribute("class", "portrait");
    }
}

// global functions
function showInfoDialog(message, keepShadow) {
    var dialog = new InfoDialog(DIALOG_TYPE.INFO, message, null, null, keepShadow);
    dialog.show();
}

function showQuestionDialog(message, noButtonHandler, yesButtonHandler) {
    var dialog = new InfoDialog(DIALOG_TYPE.QUESTION, message, noButtonHandler, yesButtonHandler);
    dialog.show();    
}
