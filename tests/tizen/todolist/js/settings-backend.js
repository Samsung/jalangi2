/*
 * Copyright (c) 2012, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

function SettingsItem() {
    this.id = '';
    this.value = SettingsItem.dayItem.CHECKED;
    
    this.defaultview = SettingsItem.DefaultView.WEEKVIEW;
    this.sortby = SettingsItem.SortItemBy.TIME;
}

SettingsItem.DefaultView = {
    WEEKVIEW: 0,
    DAYVIEW: 1
};

SettingsItem.SortItemBy = {
    TIME: 0,
    PRIORITY: 1
};

SettingsItem.dayItem = {
    UNCHECKED: 0,
    CHECKED: 1
};

function SettingsBackend() {
    /* Connect to data store, or other initlization code. */
    this.init = function() {};

    /* Creates a new settingsItem. This method should ALWAYS be used to create
     * settings items, instead of a simple instantiation. */
    this.create = function() {};

    
    /* Saves days settings to data store. */
    this.saveSettingsDays = function(dayid, value) {};

    /* Gets days settings from data store. */
    this.getSettingsDays = function() {};
    
    /* Gets sort by type from data store. */
    this.getSortItem = function() {};

    /* Sets sort by type to data store. */
    this.setSortItem = function(viewval) {};

    /* Gets default view from data store. */
    this.getDefaultView = function() {};

    /* Sets default view to data store. */
    this.setDefaultView = function(sortbyval) {};
}

function SettingsBackendLocalStorage() {
}
SettingsBackendLocalStorage.prototype = new SettingsBackend();

SettingsBackendLocalStorage.prototype.init = function() {

    settingsdaykey = 'settingsdays';
    var daysArray = JSON.parse(localStorage.getItem(settingsdaykey));
    if (daysArray == null) { 
        var noofdays = 7;
        var array = new Array(7);
        for (var i = 0; i < noofdays ; i++) {
            var day = new SettingsItem();
            day.id = i;
            day.value = SettingsItem.dayItem.CHECKED;
            array[i] = day;
        }
        localStorage.setItem('settingsdays', JSON.stringify(array));
        localStorage.setItem('defaultview', JSON.stringify(SettingsItem.DefaultView.WEEKVIEW));
        localStorage.setItem('sortby', JSON.stringify(SettingsItem.SortItemBy.TIME));
    }
};

SettingsBackendLocalStorage.prototype.create = function() {
    var item = new SettingsItem();
    item.guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
    return item;
};

SettingsBackendLocalStorage.prototype.getSettingsDays = function() {
    key = 'settingsdays';

    var array = JSON.parse(localStorage.getItem(key));
    if (array == null) 
        return [];

    return array.map(function(array) {
        var day = new SettingsItem();
        day.id = array.id;
        day.value = array.value;
        return day;
    });
};

SettingsBackendLocalStorage.prototype.getUncheckedSettingsDays = function() {
    key = 'settingsdays';

    var array = JSON.parse(localStorage.getItem(key));
    if (array == null) 
        return [];

    var temparray = new Array;
    $.each(array, function(index, item) {
        if (item.value == SettingsItem.dayItem.UNCHECKED) {
            temparray.push(item);
        }
    });
    return temparray;
};


SettingsBackendLocalStorage.prototype.saveDaySettings = function(dayid, value) {
    key = 'settingsdays';

    var array = JSON.parse(localStorage.getItem(key));
    if (array == null) {
        array = new Array();
    }

    var edited = false;
    $.each(array, function(index, item) {
        if (item.id == dayid) {
            array[index].id = dayid;
            array[index].value = value;
            edited = true;
        }
    });
    if(edited)
        localStorage.setItem('settingsdays', JSON.stringify(array));
};

SettingsBackendLocalStorage.prototype.getDefaultView = function() {
    return JSON.parse(localStorage.getItem('defaultview'));
};

SettingsBackendLocalStorage.prototype.setDefaultView = function(viewval) {
    localStorage.setItem('defaultview', JSON.stringify(viewval));
};

SettingsBackendLocalStorage.prototype.getSortBy = function() {
    return JSON.parse(localStorage.getItem('sortby'));
};

SettingsBackendLocalStorage.prototype.setSortBy = function(sortbyval) {
    localStorage.setItem('sortby', JSON.stringify(sortbyval));
};
