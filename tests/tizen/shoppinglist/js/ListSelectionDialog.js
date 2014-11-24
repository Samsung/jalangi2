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
MyListSelectionDialog = {}; // The list selection dialog.

MyListSelectionDialog = new function() {
    var self = this;

    self.totalListItems = 0;

    self.listoflistsPopupScroll = new iScroll('listoflists-popup-pane', {checkDOMChanges: true});
    /**
     * work around to avoid accident clicking on the elements
     * inside scrolling area.
     */
    self.listoflistsPopupScroll.options.onScrollStart = function(e) {
        $('#listoflists-popup-pane').addClass("dragging");
        e.preventDefault();
    };
    self.listoflistsPopupScroll.options.onBeforeScrollEnd = function(e) {
        if(!this.moved){
            $('#listoflists-popup-pane').removeClass("dragging");
        }
    };

    self.initOnLoad = function() {
        document.getElementById('listselection_title').innerHTML = Localizer.getTranslation("listselection_title");
        document.getElementById('listselection_close_button').onclick = function() {
            ShoppingListApp.buttonClick03Audio.play();

            self.hide();
        };

        self.updateStyles();
    }

    self.show = function() {
        ShoppingListApp.buttonClick03Audio.play();

        document.getElementById('shadow').style.display = 'block';
        document.getElementById('listselection-dialog').style.display = 'block';
    }

    self.hide = function() {
        ShoppingListApp.buttonClick03Audio.play();

        document.getElementById('shadow').style.display = 'none';
        document.getElementById('listselection-dialog').style.display = 'none';
    }

    self.selectListsCallback = function(dataset) {
        var self = this;

        if (typeof dataset == "undefined") {
            showInfoDialog(Localizer.getTranslation("database_error"));
            return;
        }
    
        if (dataset.length < 1) {
            self.hide();
            showInfoDialog(Localizer.getTranslation("lists_not_available"));
            return;
        }

        var content = "";
        self.totalListItems = dataset.length;
        for (var i = 0, item = null; i < dataset.length; i++) {
            item = dataset.item(i);
            content +=
                "<div class='listitem'>" +
                    "<a onclick='MyListSelectionDialog.listitemClicked(\"" + escape(item.name) + "\", \"" + item.color + "\")'>" +
                        "<img src='' class='color_box " + item.color + "'/>" +
                        "<label>" +  item.name + "</label>" +
                    "</a>" +
                    "<img src='' class='listitem_divider' />" +
                "</div>";
        }

        if (self.showViewAll) {
            self.totalListItems++;
            content +=
                "<div class='listitem'>" +
                    "<a onclick='MyListSelectionDialog.listitemClicked(" + ShoppingListApp.ALL_KEY + ", \"" + "green_2" + "\")'>" + // TODO - localize
                        "<img src='' class='color_box " + "green_2" + "'/>" +
                        "<label>" +  "View All" + "</label>" +
                    "</a>" +
                    "<img src='' class='listitem_divider' />" +
                "</div>";
        }

        document.getElementById("listoflists-popup").innerHTML = content;
        self.updateStyles();
        self.show();
    }

    self.listitemClicked = function(listName, listColor) {
        if($(".dragging").is(':visible')) {
            return false;
        }
        ShoppingListApp.buttonClick03Audio.play();
        this.hide();
        if(listName != ShoppingListApp.ALL_KEY)
            listName = unescape(listName);
        this.listClickHandler(listName, listColor);
    }

    self.updateStyles = function() {
        var self = this;

        var dialogElement = document.getElementById('listselection-dialog');
        var listspaneElement = document.getElementById('listoflists-popup-pane');
    
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
        
        self.listoflistsPopupScroll.refresh();
    }

    self.showListSelectionDialog = function(listClickHandler, showViewAll) {
        var self = this;

        self.listClickHandler = listClickHandler;
        self.showViewAll = showViewAll;

        // populate list data
        ShoppingListApp.DBManager.selectListData(self.selectListsCallback.bind(self));
    }

    return self;
}

