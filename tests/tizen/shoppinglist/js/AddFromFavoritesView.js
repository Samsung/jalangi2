/*
 * Copyright (c) 2012, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

var currentFavoritesView; 

function AddFromFavoritesView() {
    var self = this;
    currentFavoritesView = self;
    self.favoritesCount = 0;
    self.allFavorites = [];
    self.selectedFavorites = [];
    
    self.searchInput = document.getElementById("favorites_searchinput");
    self.listName = document.getElementById("favorites_list_input");
    self.itemStore = document.getElementById("favorites_store_input");
    
    document.getElementById('addfromfavorites_view_title_id').innerHTML = Localizer.getTranslation("addfromfavorites_view_title");
    document.getElementById('favorites_searchinput').placeholder = Localizer.getTranslation("enter_keyword");
    document.getElementById('favorites_item_list_label').innerHTML = Localizer.getTranslation("favorites_item_list_label");
    document.getElementById('favorites_item_store_label').innerHTML = Localizer.getTranslation("favorites_item_store_label");
    document.getElementById('add_one_item').innerHTML = Localizer.getTranslation("add_one_item");
    document.getElementById('addfromfavorites_save_text').innerHTML = Localizer.getTranslation("save_text");
    document.getElementById('favorites_store_input').placeholder = Localizer.getTranslation("set_store");

    document.getElementById("addfromfavorites_view_close_button").onclick = function() {
        ShoppingListApp.buttonClick03Audio.play();

        self.hide();
        //self.gotoMainView();
    };
    document.getElementById("addfromfavorites_view_search_button").onclick = function() {
        ShoppingListApp.buttonClick03Audio.play();

        self.showSearchpane();
    };
    document.getElementById("addfromfavorites_view_addoneitem_text_button").onclick = function() {
        ShoppingListApp.buttonClick03Audio.play();

        self.onAddOneItemClicked();
    };
    document.getElementById("addfromfavorites_view_save_text_button").onclick = function() {
        ShoppingListApp.buttonClick03Audio.play();

        self.onSaveClicked();
    };
    document.getElementById("favorites_searchbackbutton").onclick = function() {
        ShoppingListApp.buttonClick03Audio.play();

        self.hideSearchpane();
    };
    document.getElementById("favorites_searchclearbutton").onclick = function() {
        ShoppingListApp.buttonClick03Audio.play();

        self.searchInput.value = "";
        self.updateFavoritesList();
    };

    document.getElementById("favorites_list_button").onclick = function() {
        ShoppingListApp.buttonClick03Audio.play();

        MyListSelectionDialog.showListSelectionDialog(self.listitemSelectedCallback);
    };
    document.getElementById("favorites_stores_button").onclick = function() {
        ShoppingListApp.buttonClick03Audio.play();

        MyStoreSelectionDialog.showStoreSelectionDialog(self.storeitemSelectedCallback);
    };
    
    self.searchInput.onkeyup = function() {
        self.updateFavoritesList();
    };
    
    self.resetForm();
    
    self.scroll = new iScroll('listoffavorites-pane');
    // get favorites from database
    ShoppingListApp.DBManager.selectAllFavorites(self.favoritesQueryCallBack);
}

AddFromFavoritesView.prototype.resetForm = function() {
    this.listName.value = "";
    this.itemStore.value = "";
    document.getElementById("favorites_listcolor").style.backgroundColor = "#CCCCCC";
}

AddFromFavoritesView.prototype.show = function() {
    ShoppingListApp.buttonClick03Audio.play();
    this.selectedFavorites.splice(0);
    document.getElementById('addfromfavorites-view').style.display = 'block';
}

AddFromFavoritesView.prototype.hide = function() {
    this.hideSearchpane();
    document.getElementById('addfromfavorites-view').style.display = 'none';
}

AddFromFavoritesView.prototype.showSearchpane = function() {
    document.getElementById('favorites_titlepane').style.display = 'none';
    document.getElementById('favorites_searchpane').style.display = 'block';
    this.searchInput.focus();
}

AddFromFavoritesView.prototype.hideSearchpane = function() {
    this.searchInput.value = "";
    document.getElementById('favorites_titlepane').style.display = 'block';
    document.getElementById('favorites_searchpane').style.display = 'none';
}

AddFromFavoritesView.prototype.gotoMainView = function() {
    editItemScreen.resetForm();
    editItemScreen.hide();
}

AddFromFavoritesView.prototype.onAddOneItemClicked = function() {
    this.hide();
}

AddFromFavoritesView.prototype.onDeselectAllClicked = function() {
    // delete all item from array
    this.selectedFavorites.splice(0);
    
    for (var i = 0; i < currentFavoritesView.favoritesCount; i++) {
        var element = document.getElementById("favoriteitem_"+i);
        element.setAttribute("class", "favoriteitem");
    }
}

AddFromFavoritesView.prototype.listitemSelectedCallback = function(listName, listColor) {
    currentFavoritesView.listName.value = listName;
    var colorBox = document.getElementById("favorites_listcolor");
    colorBox.style.backgroundColor = ColorTable.COLOR[listColor];
}

AddFromFavoritesView.prototype.storeitemSelectedCallback = function(storeName) {
    currentFavoritesView.itemStore.value = storeName;
}

AddFromFavoritesView.prototype.onSaveClicked = function() {
    // Add selected items to the currently selected list
    var self = this;
    
    if (self.selectedFavorites.length == 0) {
        showInfoDialog(Localizer.getTranslation("select_items"));
        return;
    }
    if (isEmpty(self.listName.value)) {
        showInfoDialog(Localizer.getTranslation("list_is_empty"));
        return;
    }

    // check if any of the items already exist in the same list
    ShoppingListApp.DBManager.selectAllItemNamesFromList(self.listName.value, self.itemNamesQueryCallBack);
}

AddFromFavoritesView.prototype.updateFavoritesList = function(dataset) {
    document.getElementById("listoffavorites").innerHTML = "";
    var content = "";
    for (var i = 0, id = 0; i < this.allFavorites.length; i++) {
        var n = this.allFavorites[i].name.toLowerCase().indexOf(this.searchInput.value.toLowerCase());
        
        if (n !== -1) { // if found, add it to list
            content += 
                "<div class='favoriteitem' id='favoriteitem_" + id + "'" + 
                " ontouchend='currentFavoritesView.onFavoriteItemClicked(this, \"" + this.allFavorites[i].name + "\",  \"" + this.allFavorites[i].image + "\")'" +
                ">" + 
                    "<label>" + this.allFavorites[i].name + "</label>" +
                "</div>";

            // increment id only when item is added
            id++;
        }
    }

    document.getElementById("listoffavorites").innerHTML = content;
    this.scroll.refresh();
}

AddFromFavoritesView.prototype.favoritesQueryCallBack = function(dataset) {
    if (typeof dataset == "undefined") {
        showInfoDialog(Localizer.getTranslation("database_error"));
        return;
    }

    currentFavoritesView.favoritesCount = dataset.length;
    // delete all items from allFavorites array
    currentFavoritesView.allFavorites.splice(0);

    var content = "";
    for (var i = 0, item = null; i < dataset.length; i++) {
        item = dataset.item(i);
        currentFavoritesView.allFavorites.push(
                    { // object literal notation to the structure
                        name: item.name,
                        list: item.list,
                        store: item.store,
                        type: item.type,
                        image: item.image
                    }
                );
        
        content += 
            "<div class='favoriteitem' id='favoriteitem_" + i + "'" + 
            " ontouchend='currentFavoritesView.onFavoriteItemClicked(this, \"" + item.name + "\",  \"" + item.image + "\")'" +
            ">" + 
                "<label>" + item.name + "</label>" +
            "</div>";
    }
    document.getElementById("listoffavorites").innerHTML = content;
    currentFavoritesView.scroll.refresh();
}

AddFromFavoritesView.prototype.onFavoriteItemClicked = function(element, itemName, itemPhoto) {
    var self = currentFavoritesView;
    ShoppingListApp.buttonClick03Audio.play();

    if (element.getAttribute("class") == "favoriteitem") {
        element.setAttribute("class", "favoriteitem selected");
        self.selectedFavorites.push(
                { 
                    name: itemName,
                    image: itemPhoto
                }
        );
    }
    else {
        // find the item in array
        var searchidx = -1;
        for (var i = 0; i < self.selectedFavorites.length; i++) {
            if (self.selectedFavorites[i].name == itemName) {
                searchidx = i;
                break;
            }
        }
        
        if(searchidx != -1) {
            // name found. delete that one found item 
            this.selectedFavorites.splice(searchidx, 1);
            element.setAttribute("class", "favoriteitem");
        }
    }
}

AddFromFavoritesView.prototype.insertFavorites = function() {
    //(name, list, store, type, image)
    for (var i = 0; i < currentFavoritesView.selectedFavorites.length; i++) {
        ShoppingListApp.DBManager.insertItem(
                currentFavoritesView.selectedFavorites[i].name,
                currentFavoritesView.listName.value,
                currentFavoritesView.itemStore.value,
                "",
                currentFavoritesView.selectedFavorites[i].image);
    }
    currentFavoritesView.hide();
    //currentFavoritesView.gotoMainView();
    
    // Refresh Main View
    ShoppingListApp.updateListOfLists();
    ShoppingListApp.updateCurrentList();
    showInfoDialog(
            Localizer.getTranslation("items_saved_in")
            + currentFavoritesView.listName.value
            + Localizer.getTranslation("list_dot"));
}

//Items Query - for duplicate checking
AddFromFavoritesView.prototype.itemNamesQueryCallBack = function(dataset) {
    if (typeof dataset == "undefined") {
        showInfoDialog(Localizer.getTranslation("database_error"));
        return;
    }

    var itemFound = 0;
    for (var itemIdx = 0, item = null; itemIdx < dataset.length; itemIdx++) {
        item = dataset.item(itemIdx);
        // find this item name in selectedFavorites[]
        for (var favIdx = 0; favIdx < currentFavoritesView.selectedFavorites.length; favIdx++) {
            if (item.name === currentFavoritesView.selectedFavorites[favIdx].name) {
                itemFound = 1;
                break;
            }
        }
        if (itemFound === 1) {
            break;
        }
    }
    
    if (itemFound === 1) {
        showQuestionDialog( 
                Localizer.getTranslation("some_selected_items_already_in")
                + currentFavoritesView.listName.value
                + Localizer.getTranslation("do_you_want_to_add_anyway"),
                null, // No button handler
                currentFavoritesView.insertFavorites);
    }
    else {
        currentFavoritesView.insertFavorites();
    }
}

function showFavoritesView() {
    var view = new AddFromFavoritesView();
    view.show();
}
