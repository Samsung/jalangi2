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
MyStoreSelectionDialog = {}; // The list selection dialog.

MyStoreSelectionDialog = new function() {
    var self = this;

    self.totalListItems = 0;

    self.listofstoresPopupScroll = new iScroll('listofstores-popup-pane', {checkDOMChanges: true});
    /**
     * work around to avoid accident clicking on the elements
     * inside scrolling area.
     */
    self.listofstoresPopupScroll.options.onScrollStart = function(e) {
        $('#listofstores-popup-pane').addClass("dragging");
        e.preventDefault();
    };
    self.listofstoresPopupScroll.options.onBeforeScrollEnd = function(e) {
        if(!this.moved){
            $('#listofstores-popup-pane').removeClass("dragging");
        }
    };
    
    self.initOnLoad = function() {
        document.getElementById('storeselection_title').innerHTML = Localizer.getTranslation("storeselection_title");
        document.getElementById('storeselection_close_button').onclick = function() {
            self.hide();
        };

        self.updateStyles();
    }

    self.show = function() {
        ShoppingListApp.buttonClick03Audio.play();

        document.getElementById('shadow').style.display = 'block';
        document.getElementById('storeselection-dialog').style.display = 'block';
    }

    self.hide = function() {
        ShoppingListApp.buttonClick03Audio.play();

        document.getElementById('shadow').style.display = 'none';
        document.getElementById('storeselection-dialog').style.display = 'none';
    }

    self.selectStoresCallback = function(dataset) {
        var self = this;

        if (typeof dataset == "undefined") {
            showInfoDialog(Localizer.getTranslation("database_error"));
            return;
        }
    
        if (dataset.length < 1) {
            self.hide();
            showInfoDialog(Localizer.getTranslation("stores_not_available"));
            return;
        }

        var content = "";
        self.totalListItems = dataset.length;
        for (var i = 0, item = null; i < dataset.length; i++) {
            item = dataset.item(i);
            content +=
                "<div class='listitem'>" +
                    "<a onclick='MyStoreSelectionDialog.storeitemClicked(\"" + escape(item.name) + "\")'>" +
                        "<label>" +  item.name + "</label>" +
                    "</a>" +
                    "<img src='' class='listitem_divider' />" +
                "</div>";
        }

        if (self.showViewAll) {
            self.totalListItems++;
            content +=
                "<div class='listitem'>" +
                    "<a onclick='MyStoreSelectionDialog.storeitemClicked(" + ShoppingListApp.ALL_KEY + ")'>" +
                        "<label>" +  "View All" + "</label>" +
                    "</a>" +
                    "<img src='' class='listitem_divider' />" +
                "</div>";
        }
    
        document.getElementById("listofstores-popup").innerHTML = content;
        self.updateStyles();
        self.show();
    }

    self.storeitemClicked = function(storeName) {
        if($(".dragging").is(':visible')) {
            return false;
        }
        ShoppingListApp.buttonClick03Audio.play();
        this.hide();
        if(storeName != ShoppingListApp.ALL_KEY)
            storeName = unescape(storeName);
        this.listClickHandler(storeName);
    }

    self.updateStyles = function() {
        var self = this;

        var dialogElement = document.getElementById('storeselection-dialog');
        var listspaneElement = document.getElementById('listofstores-popup-pane');
    
        var viewSize = Helper.getViewSize();

        if(Helper.isLandscape()) {
            dialogElement.setAttribute("class", "landscape");
            if(self.totalListItems > 5) {
                listspaneElement.style.height = "596px"; // 720 - 6 - 6 - 112
                dialogElement.style.top = "0px";
            }
            else {
                listspaneElement.style.height = self.totalListItems * 116 + "px";
                dialogElement.style.top = (viewSize.height - ((self.totalListItems * 116) + 6 + 6 + 112))/2 + "px";
            }
        }
        else {
            dialogElement.setAttribute("class", "portrait");
            if(self.totalListItems > 9) {
                listspaneElement.style.height = "1156px";  // 1280 - 6 - 6 - 112
                dialogElement.style.top = "0px";
            }
            else {
                listspaneElement.style.height = self.totalListItems * 116 + "px";
                dialogElement.style.top = (viewSize.height - ((self.totalListItems * 116) + 6 + 6 + 112))/2 + "px";
            }
        }
        
        self.listofstoresPopupScroll.refresh();
    }

    self.showStoreSelectionDialog = function(listClickHandler, showViewAll) {
        var self = this;

        self.listClickHandler = listClickHandler;
        self.showViewAll = showViewAll;

        // populate stores data
        ShoppingListApp.DBManager.selectStoreData(self.selectStoresCallback.bind(self));
    }

    return self;
}

