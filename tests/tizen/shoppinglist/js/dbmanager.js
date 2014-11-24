/*
 * Copyright (c) 2012, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

/**
 * DBManager class for storing and retrieving data from, and managing, the shopping list application's database.
 */
function DBManager() {
    var self = this;

    self.createStoresStatement = "CREATE TABLE IF NOT EXISTS stores (name TEXT PRIMARY KEY NOT NULL UNIQUE)";
    self.createListsStatement = "CREATE TABLE IF NOT EXISTS lists (name TEXT PRIMARY KEY NOT NULL UNIQUE, color TEXT NOT NULL)";
    self.createItemsStatement = "CREATE TABLE IF NOT EXISTS items (_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, name TEXT NOT NULL, list TEXT, store TEXT, type TEXT, image TEXT, \
                                                                   bought INTEGER NOT NULL, favorite INTEGER NOT NULL, \
                                                                   FOREIGN KEY(list) REFERENCES lists(name), FOREIGN KEY(store) REFERENCES stores(name))";

    self.insertStoreStatement = "INSERT INTO stores(name) VALUES (?)";
    self.insertListStatement = "INSERT INTO lists(name, color) VALUES (?, ?)";
    self.insertItemStatement = "INSERT INTO items(name, list, store, type, image, bought, favorite) VALUES(?, ?, ?, ?, ?, 0, 0)";

    self.updateItemBoughtStatement = "UPDATE items SET bought = ? WHERE _id = ?";
    self.updateItemFavoriteStatement = "UPDATE items SET favorite = ? WHERE _id = ?";

    self.selectListDataStatement = "SELECT items.list AS name, lists.color AS color, SUM(items.bought) AS boughtcount, COUNT(*) AS totalcount FROM items, lists WHERE lists.name = items.list GROUP BY list \
                                    UNION \
                                    SELECT name, color, 0 AS boughtcount, 0 AS totalcount FROM lists WHERE name NOT IN (SELECT items.list AS name FROM items GROUP BY name)";
    self.selectStoreDataStatement = "SELECT items.store AS name, SUM(items.bought) AS boughtcount, COUNT(*) AS totalcount FROM items, stores WHERE stores.name = items.store GROUP BY store \
                                     UNION \
                                     SELECT name, 0 AS boughtcount, 0 AS totalcount FROM stores WHERE name NOT IN (SELECT items.store AS name FROM items GROUP BY name)";
    self.selectFavoritesDataStatement = "SELECT items.list AS name, lists.color AS color, SUM(items.favorite) AS totalcount FROM items, lists WHERE lists.name = items.list AND items.favorite = 1 GROUP BY list \
                                         UNION \
                                         SELECT name, color, 0 AS totalcount FROM lists WHERE name NOT IN (SELECT items.list AS name FROM items WHERE items.favorite = 1 GROUP BY name)";

    self.selectAllItemDataStatement = "SELECT '-1' as name, COALESCE(SUM(items.bought), 0) AS boughtcount, COUNT(*) AS totalcount FROM items";
    self.selectAllFavoriteItemDataStatement = "SELECT '-1' as name, COALESCE(SUM(items.favorite), 0) AS totalcount FROM items";

    self.selectItemsFromListStatement = "SELECT * FROM items WHERE list = ? AND items.name LIKE 'pattern%'";
    self.selectItemsFromStoreStatement = "SELECT items._id AS _id, items.name AS name, items.store AS store, items.type AS type, items.image AS image, items.bought AS bought, items.favorite AS favorite, lists.color AS color \
                                          FROM items, lists WHERE items.list = lists.name AND store = ? AND items.name LIKE 'pattern%'";
    self.selectItemsFromFavoritesStatement = "SELECT * FROM items WHERE items.favorite = 1 AND list = ? AND items.name LIKE 'pattern%'";

    self.selectAllItemsStatement = "SELECT items._id AS _id, items.name AS name, items.store AS store, items.type AS type, items.image AS image, items.bought AS bought, items.favorite AS favorite, lists.color AS color \
                                    FROM items, lists WHERE items.list = lists.name AND items.name LIKE '%pattern%'";
    self.selectAllItemsFromFavoritesStatement = "SELECT items._id AS _id, items.name AS name, items.store AS store, items.type AS type, items.image AS image, items.bought AS bought, items.favorite AS favorite, lists.color AS color \
                                    FROM items, lists WHERE items.list = lists.name AND items.favorite = 1 AND items.name LIKE 'pattern%'";

    self.orderItemsByName = " ORDER BY LOWER(items.name)";
    self.orderItemsByStoreThenName = " ORDER BY LOWER(items.store), LOWER(items.name)";
    self.orderItemsByTypeThenName = " ORDER BY LOWER(items.type), LOWER(items.name)";
    self.orderItemsByBoughtThenName = " ORDER BY items.bought, LOWER(items.name)";

    self.onError = function(tx, error) {
        console.log("[ERR] DBmanager: "+error.message);
    };

    self.onSuccess = function(tx, result) {
    };

    self.createTables = function() {
        self.db.transaction(function(tx) {
            tx.executeSql(self.createStoresStatement, [], self.onSuccess, self.onError);
            tx.executeSql(self.createListsStatement, [], self.onSuccess, self.onError);
            tx.executeSql(self.createItemsStatement, [], self.onSuccess, self.onError);
        });
    };

    self.insertList = function(name, color) {
        self.db.transaction(function(tx) {
             tx.executeSql(self.insertListStatement, [name, color], self.onSuccess, self.onError);
        });
    };

    self.insertStore = function(store) {
        self.db.transaction(function(tx) {
             tx.executeSql(self.insertStoreStatement, [store], self.onSuccess, self.onError);
        });
    };

    self.insertItem = function(name, list, store, type, image) {
        self.db.transaction(function(tx) {
             tx.executeSql(self.insertItemStatement, [name, list, store, type, image], self.onSuccess, self.onError);
        });
    };

    self.selectListData = function(callback) {
        self.db.transaction(function(tx) {
             tx.executeSql(
                 self.selectListDataStatement,
                 [],
                 function(tx, result) {
                     var dataset = result.rows;
                     callback(dataset);
                 },
                 self.onError);
        });
    };
    
    self.selectListNameStatement = "SELECT name, color FROM lists WHERE name = ?"; 
    self.selectListName = function(name, callback) {
        self.db.transaction(function(tx) {
             tx.executeSql(
                 self.selectListNameStatement,
                 [name],
                 function(tx, result) {
                     var dataset = result.rows;
                     callback(dataset);
                 },
                 self.onError);
        });
    };
    
    self.selectStoreData = function(callback) {
        self.db.transaction(function(tx) {
             tx.executeSql(
                 self.selectStoreDataStatement,
                 [],
                 function(tx, result) {
                     var dataset = result.rows;
                     callback(dataset);
                 },
                 self.onError);
        });
    };

    self.selectStoreNameStatement = "SELECT name FROM stores WHERE name = ?";
    self.selectStoreName = function(storeName, callback) {
        self.db.transaction(function(tx) {
             tx.executeSql(
                 self.selectStoreNameStatement,
                 [storeName],
                 function(tx, result) {
                     var dataset = result.rows;
                     callback(dataset);
                 },
                 self.onError);
        });
    };

    self.selectFavoritesData = function(callback) {
        self.db.transaction(function(tx) {
             tx.executeSql(
                 self.selectFavoritesDataStatement,
                 [],
                 function(tx, result) {
                     var dataset = result.rows;
                     callback(dataset);
                 },
                 self.onError);
        });
    };

    self.selectAllItemData = function(callback) {
        self.db.transaction(function(tx) {
             tx.executeSql(
                 self.selectAllItemDataStatement,
                 [],
                 function(tx, result) {
                     var dataset = result.rows;
                     callback(dataset);
                 },
                 self.onError);
        });
    };

    self.selectAllFavoriteItemData = function(callback) {
        self.db.transaction(function(tx) {
             tx.executeSql(
                 self.selectAllFavoriteItemDataStatement,
                 [],
                 function(tx, result) {
                     var dataset = result.rows;
                     callback(dataset);
                 },
                 self.onError);
        });
    };

    self.selectItemsFromList = function(list, callback, pattern) {
        self.db.transaction(function(tx) {
             tx.executeSql(
                 self.selectItemsFromListStatement.replace("pattern", pattern) + self.itemOrderMode,
                 [list],
                 function(tx, result) {
                     var dataset = result.rows;
                     callback(dataset);
                 },
                 self.onError);
        });
    };

    self.searchItemFromListStatement = "SELECT name, list FROM items WHERE list = ? AND name = ?";
    self.searchItemFromList = function(itemName, listName, callback) {
        self.db.transaction(function(tx) {
            tx.executeSql(
                self.searchItemFromListStatement,
                [listName, itemName],
                function(tx, result) {
                    var dataset = result.rows;
                    callback(dataset);
                },
                self.onError);
       });
    };
    
    self.selectItemsFromStore = function(store, callback, pattern) {
        self.db.transaction(function(tx) {
             tx.executeSql(
                 self.selectItemsFromStoreStatement.replace("pattern", pattern) + self.itemOrderMode,
                 [store],
                 function(tx, result) {
                     var dataset = result.rows;
                     callback(dataset);
                 },
                 self.onError);
        });
    };

    self.selectItemsFromFavorites = function(list, callback, pattern) {
        self.db.transaction(function(tx) {
             tx.executeSql(
                 self.selectItemsFromFavoritesStatement.replace("pattern", pattern) + self.itemOrderMode,
                 [list],
                 function(tx, result) {
                     var dataset = result.rows;
                     callback(dataset);
                 },
                 self.onError);
        });
    };

    self.selectAllItems = function(callback, pattern) {
        self.db.transaction(function(tx) {
             tx.executeSql(
                 self.selectAllItemsStatement.replace("pattern", pattern) + self.itemOrderMode,
                 [],
                 function(tx, result) {
                     var dataset = result.rows;
                     callback(dataset);
                 },
                 self.onError);
        });
    };

    self.selectAllItemsFromFavorites = function(callback, pattern) {
        self.db.transaction(function(tx) {
             tx.executeSql(
                 self.selectAllItemsFromFavoritesStatement.replace("pattern", pattern) + self.itemOrderMode,
                 [],
                 function(tx, result) {
                     var dataset = result.rows;
                     callback(dataset);
                 },
                 self.onError);
        });
    };

    self.updateItemBought= function(id, bought, callback) {
        self.db.transaction(function(tx) {
             tx.executeSql(
                 self.updateItemBoughtStatement,
                 [bought, id],
                 function(tx, result) {
                     var dataset = result.rows;
                     callback(dataset);
                 },
                 self.onError);
        });
    };

    self.updateItemFavorite = function(id, favorite, callback) {
        self.db.transaction(function(tx) {
             tx.executeSql(
                 self.updateItemFavoriteStatement,
                 [favorite, id],
                 function(tx, result) {
                     var dataset = result.rows;
                     callback(dataset);
                 },
                 self.onError);
        });
    };

    self.deleteAllItemsFromListStatement = "DELETE FROM items WHERE list = ?";
    self.deleteAllItemsFromList = function(listname) {
        self.db.transaction(function(tx) {
             tx.executeSql(
                 self.deleteAllItemsFromListStatement,
                 [listname],
                 self.onSuccess,
                 self.onError);
        });
    };
    
    self.deleteListStatement = "DELETE FROM lists WHERE name = ?";
    self.deleteList = function(listname) {
        self.db.transaction(function(tx) {
             tx.executeSql(
                 self.deleteListStatement,
                 [listname],
                 self.onSuccess,
                 self.onError);
        });
    };    
    
    self.uncheckAllListItemsStatement = "UPDATE items SET bought = 0 WHERE list = ?";
    self.uncheckAllListItems = function(listname) {
        self.db.transaction(function(tx) {
             tx.executeSql(
                 self.uncheckAllListItemsStatement,
                 [listname],
                 self.onSuccess,
                 self.onError);
        });
    };
    
    self.deleteItemStatement = "DELETE FROM items WHERE _id = ?";
    self.deleteItem = function(itemId) {
        self.db.transaction(function(tx) {
             tx.executeSql(
                 self.deleteItemStatement,
                 [itemId],
                 self.onSuccess,
                 self.onError);
        });
    };

    self.updateListColorStatement = "UPDATE lists SET color = ? WHERE name = ?";
    self.updateListColor = function(listName, listColor) {
        self.db.transaction(function(tx) {
             tx.executeSql(
                 self.updateListColorStatement,
                 [listColor, listName],
                 self.onSuccess,
                 self.onError);
        });
    };
    
    self.updateListStatement = "UPDATE lists SET name = ?, color = ? WHERE name = ?";
    self.updateList = function(newListName, newColor, oldListName) {
        self.db.transaction(function(tx) {
             tx.executeSql(
                 self.updateListStatement,
                 [newListName, newColor, oldListName],
                 self.onSuccess,
                 self.onError);
        });
    };
    
    self.updateItemsListNameStatement = "UPDATE items SET list = ? WHERE list = ?";
    self.updateItemsListName = function(newListName, oldListName) {
        self.db.transaction(function(tx) {
             tx.executeSql(
                 self.updateItemsListNameStatement,
                 [newListName, oldListName],
                 self.onSuccess,
                 self.onError);
        });
    };

    self.updateSingleItemListNameStatement = "UPDATE items SET list = ? WHERE _id = ?";
    self.updateSingleItemListName = function(newListName, itemId) {
        self.db.transaction(function(tx) {
             tx.executeSql(
                 self.updateSingleItemListNameStatement,
                 [newListName, itemId],
                 self.onSuccess,
                 self.onError);
        });
    };    

    self.selectSingleItemStatement = "SELECT * FROM items WHERE _id = ?";
    self.selectSingleItem = function(itemId, callback) {
        self.db.transaction(function(tx) {
            tx.executeSql(
                self.selectSingleItemStatement,
                [itemId],
                function(tx, result) {
                    var dataset = result.rows;
                    callback(dataset);
                },
                self.onError);
       });
    };

    self.updateItemStatement = "UPDATE items SET name = ?, list = ?, store = ?, type = ?," +
                               " image = ? WHERE _id = ?";
    self.updateItem= function(id, name, list, store, type, image) {
        self.db.transaction(function(tx) {
             tx.executeSql(
                 self.updateItemStatement,
                 [name, list, store, type, image, id],
                 self.onSuccess,
                 self.onError);
        });
    };

    self.updateItemFavoriteByIdStatement = "UPDATE items SET favorite = ? WHERE _id = ?";
    self.updateItemFavoriteById = function(id, favorite) {
        self.db.transaction(function(tx) {
             tx.executeSql(
                 self.updateItemFavoriteByIdStatement,
                 [favorite, id],
                 self.onSuccess,
                 self.onError);
        });
    };
    
    self.selectAllFavoritesStatement = "SELECT * FROM items WHERE favorite = 1";
    self.selectAllFavorites = function(callback) {
        self.db.transaction(function(tx) {
             tx.executeSql(
                 self.selectAllFavoritesStatement,
                 [],
                 function(tx, result) {
                     var dataset = result.rows;
                     callback(dataset);
                 },
                 self.onError);
        });
    };
    
    self.uncheckAllStoreItemsStatement = "UPDATE items SET bought = 0 WHERE store = ?";
    self.uncheckAllStoreItems = function(storeName) {
        self.db.transaction(function(tx) {
             tx.executeSql(
                 self.uncheckAllStoreItemsStatement,
                 [storeName],
                 self.onSuccess,
                 self.onError);
        });
    };
    
    self.deleteAllItemsFromStoreStatement = "DELETE FROM items WHERE store = ?";
    self.deleteAllItemsFromStore = function(storeName) {
        self.db.transaction(function(tx) {
             tx.executeSql(
                 self.deleteAllItemsFromStoreStatement,
                 [storeName],
                 self.onSuccess,
                 self.onError);
        });
    };
    
    self.deleteStoreStatement = "DELETE FROM stores WHERE name = ?";
    self.deleteStore = function(storeName) {
        self.db.transaction(function(tx) {
             tx.executeSql(
                 self.deleteStoreStatement,
                 [storeName],
                 self.onSuccess,
                 self.onError);
        });
    }; 

    self.updateItemsStoreNameStatement = "UPDATE items SET store = ? WHERE store = ?";
    self.updateItemsStoreName = function(newStoreName, oldStoreName) {
        self.db.transaction(function(tx) {
             tx.executeSql(
                 self.updateItemsStoreNameStatement,
                 [newStoreName, oldStoreName],
                 self.onSuccess,
                 self.onError);
        });
    };
    
    self.updateStoreNameStatement = "UPDATE stores SET name = ? WHERE name = ?";
    self.updateStoreName = function(newStoreName, oldStoreName) {
        self.db.transaction(function(tx) {
             tx.executeSql(
                 self.updateStoreNameStatement,
                 [newStoreName, oldStoreName],
                 self.onSuccess,
                 self.onError);
        });
    };

    self.updateItemsStoreNameStatement = "UPDATE items SET store = ? WHERE store = ?";
    self.updateItemsStoreName = function(newStoreName, oldStoreName) {
        self.db.transaction(function(tx) {
             tx.executeSql(
                 self.updateItemsStoreNameStatement,
                 [newStoreName, oldStoreName],
                 self.onSuccess,
                 self.onError);
        });
    };
    
    self.selectAllItemNamesFromListStatement = "SELECT name FROM items WHERE list = ?";
    self.selectAllItemNamesFromList = function(listName, callback) {
        self.db.transaction(function(tx) {
             tx.executeSql(
                 self.selectAllItemNamesFromListStatement,
                 [listName],
                 function(tx, result) {
                     var dataset = result.rows;
                     callback(dataset);
                 },
                 self.onError);
        });
    };
    
    self.db = openDatabase("ShoppingListDb", "0.1", "Shopping List DB", 2 * 1024 * 1024);
    self.createTables();
    self.itemOrderMode = self.orderItemsByName;
}

