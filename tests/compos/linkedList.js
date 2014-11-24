//Copyright 2010 Thomas Stjernegaard Jeppesen. All Rights Reserved.

//Licensed under the Apache License, Version 2.0 (the "License");
//you may not use this file except in compliance with the License.
//You may obtain a copy of the License at

//http://www.apache.org/licenses/LICENSE-2.0

//Unless required by applicable law or agreed to in writing, software
//distributed under the License is distributed on an "AS-IS" BASIS,
//WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//See the License for the specific language governing permissions and
//limitations under the License.
/**
 *
 *
 *
 * LinkedList provides the implementation of a doubly Linked List. The list is circular,
 * keeping a dummy element (<i>"sentinel"</i>) .<p>
 *
 * The assymptotic running time for important operations are below:
 * <pre>
 *   Method                 big-O
 * ----------------------------------------------------------------------------
 * - add                    O(n/2)
 * - addFirst               O(1)
 * - addLast                O(1)
 * - clear                  O(1)
 * - clone                  O(n)
 * - contains               O(n)
 * - containsAll            O(n*m) m is the cardinality of the supplied collection
 * - every                  O(n * O(f)) f is the function supplied as argument
 * - filter                 O(n * O(f)) f is the function supplied as argument
 * - forEach                O(n * O(f)) f is the function supplied as argument
 * - getValues              O(n)
 * - insertAll              O(m) m is the cardinality of the supplied collection
 * - map                    O(n * O(f)) f is the function supplied as argument
 * - remove                 O(n)
 * - removeAll              O(n*m) m is the cardinality of the supplied collection
 * - removeFirst            O(1)
 * - removeLast             O(1)
 * - some                   O(n * O(f)) f is the function supplied as argument
 * - contains               O(n * O(f)) f is the function supplied as argument
 * </pre>
 *
 * @constructor
 */

LinkedList = function(){

    // creating the dummy element in the list

    this.sentinel ={};
    this.sentinel.next = this.sentinel;
    this.sentinel.previous = this.sentinel;
    this.size = 0;
    return this;
};

/**
 * Returns the number of elements in the list
 * @return {Integer} number of elements in the list
 * @public
 */
LinkedList.prototype.getCount = function(){return this.size;}

/**
 * Adds an element to the beginning of the list
 * @param {*} element the element to add
 * @public
 */
LinkedList.prototype.addFirst = function (element){
    var newFirst = {};
    newFirst.data = element;
    newFirst.previous = this.sentinel;
    var oldFirst = this.sentinel.next;
    newFirst.next = oldFirst;
    oldFirst.previous = newFirst;
    this.sentinel.next = newFirst;
    this.size ++;

};

/**
 * Adds an element to the end of the list
 * @param {*} element the element to add
 * @public
 */
LinkedList.prototype.addLast = function(element){
    var newLast = {};
    newLast.data = element;
    newLast.next = this.sentinel;
    var oldLast = this.sentinel.previous;
    newLast.previous = oldLast;
    oldLast.next = newLast;
    this.sentinel.previous = newLast;
    this.size ++;

};

/**
 * Removes and returns the last element in the list
 * @return {*} the last element of the list
 * @public
 */
LinkedList.prototype.removeLast = function(){
    if (this.sentinel.previous == this.sentinel) return null;
    var last = this.sentinel.previous;
    last.previous.next = this.sentinel;
    this.sentinel.previous = last.previous;
    this.size --;
    return last.data;

};

/**
 * Removes and returns the first element in the list
 * @return {*} the first element of the list
 * @public
 */
LinkedList.prototype.removeFirst = function(){
    if (this.sentinel.next == this.sentinel) return null;
    var first = this.sentinel.next;
    first.next.previous = this.sentinel;
    this.sentinel.next = first.next;
    this.size --;
    return first.data;

};

/**
 * Returns the first element in the list
 * @return {*} the first element of the list
 * @public
 */
LinkedList.prototype.getFirst = function(){
    if (this.sentinel.next == this.sentinel) return null;
    return this.sentinel.next.data;

};

/**
 * Returns the last element in the list
 * @return {*} the last element of the list
 * @public
 */
LinkedList.prototype.getLast = function(){
    if (this.sentinel.previous == this.sentinel) return null;
    return this.sentinel.previous.data;

};

/**
 * Removes a given element from the list, if it is contained
 * @param {*} o the element to remove
 * @return {Boolean} wheter the object was removed;
 * @public
 */
LinkedList.prototype.removeObject = function(o){
    var it = new LinkedList.LinkedListIterator(0, this);
    var done = false;
    while(it.hasNext() && !done){
        if (o == it.next()) {
            it.remove();
            done = true;
            return true
        }
    }
    return false;
};

/**
 * This operation is equal to removeObject
 * Removes a given element from the list, if it is contained
 * @param {*} o the element to remove
 * @return {Boolean} wheter the object was removed;
 * @public
 */
LinkedList.prototype.remove = function(o){
    return this.removeObject(o);
};

/**
 * Removes the element at index i from the list
 * @param {Integer} index the index of the element to remove
 * @public
 */
LinkedList.prototype.removeIndex = function(index){
    var it = new LinkedList.LinkedListIterator(index, this);
    it.remove();
};

/**
 * Adds an element at index i in the list
 * @param {Integer} index the index of the element
 * @param {*} element the element to add
 * @public
 */
LinkedList.prototype.add = function(index,o){
    var it = new LinkedList.LinkedListIterator(index-1, this);
    it.add(o);
};

/**
 * Checks whether a given element is contained in the list
 * @param {*} o the element to locate
 * @public
 */
LinkedList.prototype.contains = function(o){
    var it = new LinkedList.LinkedListIterator(0, this);
    var done = false;
    while(it.hasNext() && !done){
        if (o == it.next()) done = true;

    };
    return done;
};

/**
 * Returns an iterator over the list, starting at the specified position
 * @param {Integer} startpos the start position of this Iterator
 * @return {LinkedList.LinkedListIterator} an iterator over the elements in the list
 * @public
 */
LinkedList.prototype.iterator = function(startPos){
    return new LinkedList.LinkedListIterator(startPos, this);
};

/**
 * Returns an Array with the values of the list.
 * @return {!Array} The values in the list.
 */

LinkedList.prototype.toArray = function() {
    var retArray = [];
    var iter = this.iterator(0);
    while (iter.hasNext()){
        retArray.push(iter.next());
    };
    return retArray;
};

/**
 * Returns the values of the list in an Array.
 * This operation is equal to toArray
 * @return {!Array} The values in the list.
 */
LinkedList.prototype.getValues = function(){
    return this.toArray();
};

/**
 * Removes all elements from the list.
 *
 */
LinkedList.prototype.clear = function(){
    this.sentinel.next = this.sentinel;
    this.sentinel.previous = this.sentinel;
    this.size = 0;
};

/**
 * Creates a new list and inserts all elements from this list
 * to the new list and returns it
 *@return {LinkedList} a shallow clone of this list
 */
LinkedList.prototype.clone = function(){
    var rv = new LinkedList();
    this.forEach(rv.addLast, rv);
    return rv;
};
/**
 * Returns true if the size of the list is zero.
 * @return {Boolean}
 */
LinkedList.prototype.isEmpty = function(){
    return this.size == 0;
};

/**
 * Calls a function on each item in the LinkedList.
 *
 * @param {Function} f The function to call for each item. The function takes
 *     three arguments: the value, the key, and the LinkedHashMap.
 * @param {Object=} opt_obj The object context to use as "this" for the
 *     function.
 */
LinkedList.prototype.forEach = function(f, opt_obj) {
    for (var n = this.sentinel.next; n != this.sentinel; n = n.next) {
        f.call(opt_obj, n.data, n.data, this);
    };
};


/**
 * Calls a function on each item in the LinkedList and returns the results of
 * those calls in an array.
 *
 * @param {!Function} f The function to call for each item. The function takes
 *     three arguments: the value, the key, and the LinkedList.
 * @param {Object=} opt_obj The object context to use as "this" for the
 *     function.
 * @return {!Array} The results of the function calls for each element in the
 *     LinkedList.
 */
LinkedList.prototype.map = function(f, opt_obj) {
    var rv = [];
    for (var n = this.sentinel.next; n != this.sentinel; n = n.next) {
        rv.push(f.call(opt_obj, n.data, n.data, this));
    };
    return rv;
};

/**
 * Calls a function on each item in the LinkedList, if the function returns true, the key/value pair
 * is inserted into an object that is returned when all elements in the the list has been visited
 *
 * @param {!Function} f The function to call for each item. The function takes
 *     three arguments: the value, the key, and the LinkedList.
 * @param {Object=} opt_obj The object context to use as "this" for the
 *     function.
 * @return {!Array} The elements that evaluated to true in the function calls for each element in the
 *     LinkedList.
 */
LinkedList.prototype.filter = function(f, opt_obj) {
    var rv = [];
    for (var n = this.sentinel.next; n != this.sentinel; n = n.next) {
        if (f.call(opt_obj, n.data, n.data, this)) {
            rv.push(n.data);
        };
    };
    return rv;
};

/**
 * Calls a function on each item in the LinkedList and returns true if any of
 * those function calls returns a true-like value.
 *
 * @param {Function} f The function to call for each item. The function takes
 *     three arguments: the value, the key, and the LinkedList, and returns a
 *     boolean.
 * @param {Object=} opt_obj The object context to use as "this" for the
 *     function.
 * @return {boolean} Whether f evaluates to true for at least one element in the
 *     LinkedList.
 */
LinkedList.prototype.some = function(f, opt_obj) {
    for (var n = this.sentinel.next; n != this.sentinel; n = n.next) {
        if (f.call(opt_obj, n.data, n.data, this)) {
            return true;
        };
    };
    return false;
};


/**
 * Calls a function on each item in the LinkedList and returns true only if every
 * function call returns a true-like value.
 *
 * @param {Function} f The function to call for each item. The function takes
 *     three arguments: the value, the key, and the LinkedList, and returns a
 *     boolean.
 * @param {Object=} opt_obj The object context to use as "this" for the
 *     function.
 * @return {boolean} Whether f evaluates to true for every element in the LinkedList.
 */
LinkedList.prototype.every = function(f, opt_obj) {
    for (var n = this.sentinel.next; n != this.sentinel; n = n.next) {
        if (!f.call(opt_obj, n.data, n.data, this)) {
            return false;
        };
    };
    return true;
};

/**
 * Inserts an element to the head of the list
 * this operation is equal to addFirst
 * @param {*} element the element to insert
 * @public
 */
LinkedList.prototype.insert = function(element){
    this.addFirst(element);
};

/**
 * Inserts all values from the collection into the list
 * @param {Collection || Array || Object} col the collection of values
 * @public
 */
LinkedList.prototype.insertAll = function(col){
    if (typeOf(col) == "array"){
        for (var i = 0; i < col.length; i++){
            this.addLast(col[i]);
        };
    }
    else if (typeOf(col.forEach) == "function"){
        col.forEach(this.addLast, this);
    }
    else if (typeOf(col.getValues) == "function"){
        var arr = col.getValues();
        for (var i = 0; i < arr.length; i++){
            this.addLast(arr[i]);
        };
    }
    else if (typeOf(col) == "object") {
        for (var key in col){
            this.addLast(col[key]);
        }
    }
};

/**
 * Removes a all values contained in the collection from the list.
 * WARNING: this runs in O(n*m) where n is the cardinality of the LinkedList
 * and m is the cardinality of the collection
 * @param {Collection || Array || Object} col the collection of values to remove
 * @public
 */
LinkedList.prototype.removeAll = function(col){
    if (typeOf(col) == "array"){
        for (var i = 0; i < col.length; i++){
            this.removeObject(col[i]);
        };
    }
    else if (typeOf(col.forEach) == "function"){
        col.forEach(this.removeObject, this);
    }
    else if (typeOf(col.getValues) == "function"){
        var arr = col.getValues();
        for (var i = 0; i < arr.length; i++){
            this.removeObject(arr[i]);
        };
    }
    else if (typeOf(col) == "object") {
        for (var key in col){
            this.removeObject(col[key]);
        }
    }
};


/**
 * Checks that all values contained in the collection are also contained in the LinkedList
 * WARNING: this runs in O(n*m) where n is the cardinality of the LinkedList
 * and m is the cardinality of the collection
 * @param {Collection || Array || Object} col the collection of values to check
 * @return {Boolean}
 * @public
 */
LinkedList.prototype.containsAll = function(col){
    if (typeOf(col) == "array"){
        for (var i = 0; i < col.length; i++){
            if (!this.contains(col[i]))
            { return false;
            }
        }
        return true;
    }
    else if (typeOf(col.forEach) == "function"){
        return col.every(this.contains, this);
    }
    else if (typeOf(col.getValues) == "function"){
        var arr = col.getValues();
        for (var i = 0; i < arr.length; i++){
            if (!this.contains(arr[i])){
                return false;
            }
        }
        return true;
    }
    else if (typeOf(col) == "object") {
        for (var key in col){
            if (!this.contains(col[key])){
                return false;
            }
        }
        return true;
    }
};


/**
 * A Linked List Iterator used to traverse and modify elements in a Linked List,
 * @param {Integer} startpos the start position of this Iterator
 * @param {LinkedList} list the list to iterate
 * @constructor
 * @public
 */

LinkedList.LinkedListIterator = function(startPos, list){

    this.list = list;
    this.position = this.list.sentinel;

    if (startPos > this.list.size || startPos < 0)
    {startpos =0;}

    else
    if ((this.list.size - startPos) > (this.list.size / 2)) {
        for (i = 1; i <= startPos; i++)
            this.next();
    }
    else if (startPos !=0){
        for (i = this.list.size + 1; i > startPos; i--)
            this.previous();
    };
    return this;
};

/**
 * Checks if the iterator has a next element
 * @return {Boolean}
 * @public
 */
LinkedList.LinkedListIterator.prototype.hasNext = function(){
    return this.position.next != this.list.sentinel;
};

/**
 * Checks if the iterator has a previous element
 * @return {Boolean}
 * @public
 */
LinkedList.LinkedListIterator.prototype.hasPrevious = function(){
    return this.position.previous != this.list.sentinel;
};

/**
 * Moves the Iterator 1 step forward, and returns the new element reached
 * @return {*} the new element reached
 * @public
 */
LinkedList.LinkedListIterator.prototype.next = function(){
    if(!this.hasNext()) return null;
    this.position = this.position.next;
    return this.position.data;
};

/**
 * Moves the Iterator 1 step backwards, and returns the new element reached
 * @return {*} the new element reached
 * @public
 */
LinkedList.LinkedListIterator.prototype.previous = function(){
    if(!this.hasPrevious()) return null;
    this.position = this.position.previous;
    return this.position.data;
};

/**
 * Inserts a new element after the current position, and moves the Iterator
 * forward to this new elemnt
 * @param {*} element the new element to insert
 * @public
 */
LinkedList.LinkedListIterator.prototype.add = function(element){

    var newNode = {};
    newNode.data = element;
    newNode.next = this.position.next;
    this.position.next.previous = newNode;
    newNode.previous = this.position;
    this.position.next = newNode;
    this.position = newNode;
    this.list.size ++;
};

/**
 * Removes the element at the current position, and moves the Iterator
 * to the previous element
 * @return {*} the removed element
 * @public
 */
LinkedList.LinkedListIterator.prototype.remove = function(){
    if (this.position == this.list.sentinel) return null;
    var toBeRemoved = this.position;
    this.position.previous.next = this.position.next;
    this.position.next.previous = this.position.previous;
    this.position = this.position.previous;
    this.list.size --;
    return toBeRemoved.data;

};

/**
 * Replaces the element at the current position
 * @param {*} element the new element to replace the current position
 * @public
 */
LinkedList.LinkedListIterator.prototype.set = function(element){
    if (this.position == this.list.sentinel) return false;
    this.position.data = element;
    return true;
};

	

var l = new LinkedList();

l.addFirst(J$.readInput(0));
l.addFirst(J$.readInput(1));
l.addFirst(J$.readInput(2));
l.addFirst(J$.readInput(2));
l.addFirst(J$.readInput(2));
if (l.contains(J$.readInput(2))) {
    console.log("R");
}
