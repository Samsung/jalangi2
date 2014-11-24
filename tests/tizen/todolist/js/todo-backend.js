/*
 * Copyright (c) 2012, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

function Day(date) {
    if (date === undefined) {
        date = new Date();
    }

    this.date = date;
    this.todos = new Array();

    this.addTodo = function(todo) {
        this.todos.push(todo);
    };
}


function TodoItem(text, priority, color, period) {
    this.guid = '';
    this.text = text || '';
    this.priority = priority || 0;
    this.color = color || TodoItem.ColorEnum.BLACK;
    this.period = period || TodoItem.PeriodEnum.MORNING;

    this.status = TodoItem.StatusEnum.NEW;

    this.isNew = function() {
        return this.status == TodoItem.StatusEnum.NEW;
    };

    this.isDone = function() {
        return this.status == TodoItem.StatusEnum.DONE;
    };

    this.setNew = function() {
        this.status = TodoItem.StatusEnum.NEW;
    };

    this.setDone = function() {
        this.status = TodoItem.StatusEnum.DONE;
    };

    this.equals = function(other) {
        if (this.guid == '' || other.guid == '') {
            if (this.text != other.text) return false;
            if (this.priority != other.priority) return false;
            if (this.color != other.color) return false;
            if (this.period != other.period) return false;
            if (this.status != other.status) return false;

            return true;
        }

        return this.guid == other.guid;
    };
}

TodoItem.ColorEnum = {
    BLACK:  'black',
    RED  :  'red',
    ORANGE: 'orange',
    GREEN:  'green',
    BLUE :  'blue',
    GREY :  'grey'
};

TodoItem.PeriodEnum = {
    MORNING: 0,
    AFTERNOON: 1,
    EVENING: 2
};

TodoItem.StatusEnum = {
    NEW: 0,
    DONE: 1
};


function TodoBackend() {
    /* Connect to data store, or other initlization code. */
    this.init = function() {};

    /* Creates a new TodoItem. This method should ALWAYS be used to create
     * todo items, instead of a simple instantiation. */
    this.create = function() {};

    /* Get all todo items for a certain date. */
    this.get = function(date) {};

    /* Save a todo item back to the data store. */
    this.save = function(todo, date) {};

    /* Removes a todo item from the data store. */
    this.remove = function(todo, date) {};

    this.getNotes = function() {};
    this.saveNotes = function() {};
};


function TodoBackendDummy() {
    this.store = {};
}
TodoBackendDummy.prototype = new TodoBackend();

TodoBackendDummy.prototype.init = function() {
};
TodoBackendDummy.prototype.create = function() {
    return new TodoItem();
};
TodoBackendDummy.prototype.get = function(date) {
    return this.store[date.toString('yyyy-MM-dd')] || [];
};

TodoBackendDummy.prototype.save = function(todo, date) {
    var key = date.toString('yyyy-MM-dd');
    var array = this.store[key];
    if (array === undefined) {
        array = new Array();
    }

    array.push(todo);
    this.store[key] = array;
};

TodoBackendDummy.prototype.remove = function(todo, date) {
    var key = date.toString('yyyy-MM-dd');
    var array = this.store[key];
    if (array === undefined) {
        /* Nothing to remove. */ 
        return;
    }

    array = $.grep(array, function(item, i) {
        if (item.equals(todo))  {
            return false;
        }
        return true;
    });

    this.store[key] = array;
};


function TodoBackendLocalStorage() {
}
TodoBackendLocalStorage.prototype = new TodoBackend();

TodoBackendLocalStorage.prototype.init = function() {
};

TodoBackendLocalStorage.prototype.create = function() {
    var item = new TodoItem();
    item.guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });

    return item;
};

TodoBackendLocalStorage.prototype.get = function(date) {
    var key = date.toString('yyyy-MM-dd');
    var items = JSON.parse(localStorage.getItem(key));
    if (items == null)
        return [];

    return items.map(function(item) {
        var todo = new TodoItem();
        todo.guid = item.guid;
        todo.text = item.text;
        todo.priority = item.priority;
        todo.color = item.color;
        todo.period = item.period;
        todo.status = item.status;

        return todo;
    });
};

TodoBackendLocalStorage.prototype.save = function(todo, date) {
    var self = this,
        key = date.toString('yyyy-MM-dd');

    var array = JSON.parse(localStorage.getItem(key));
    if (array == null) {
        array = new Array();
    }

    var edited = false;
    $.each(array, function(index, item) {
        if (item.guid == todo.guid) {
            array[index] = todo;
            edited = true;
        }
    });

    if (!edited) {
        /* Item not found on the provided date, Let's try to remove it
         * from another date, if it's there. After all, if we're here
         * it means that we're either creating a new Todo item, or we
         * are moving it to a different day. */
        for (var i = 0; i < localStorage.length; i++) {
            var k = localStorage.key(i);
            if (k != 'notes') {
                try {
                    $.each(JSON.parse(localStorage.getItem(k)), function(index, item) {
                        if (item.guid == todo.guid)
                            self.remove(item, k);
                    });
                } 
                catch (e) {
                    console.log(e.message + ' ' + k);
                }
            }
        }
        /* Finally, regardless of having removed an item or not, we add
         * one to the new date. */
        array.push(todo);
    }

    localStorage.setItem(key, JSON.stringify(array));
};

TodoBackendLocalStorage.prototype.remove = function(todo, date) {
    var key = date.toString('yyyy-MM-dd');
    var array = JSON.parse(localStorage.getItem(key));
    if (array == null) {
        /* Nothing to remove. */ 
        return;
    }

    array = $.grep(array, function(item, index) {
        return item.guid != todo.guid;
    });

    localStorage.setItem(key, JSON.stringify(array));
};

TodoBackendLocalStorage.prototype.getNotes = function() {
    return localStorage.getItem('notes');
};

TodoBackendLocalStorage.prototype.saveNotes = function(text) {
    localStorage.setItem('notes', text);
};
