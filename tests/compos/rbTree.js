//Copyright Thomas Stjernegaard Jeppesen. All Rights Reserved.
if (typeof window === "undefined") {
    require('../../src/js/InputManager');
    require(process.cwd()+'/inputs');
}

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
 * RedBlackMap provides the implementation of a Red Black Tree map datastructure. The tree
 * maintains a set of values, sorted by their corresponding keys. The key/value pairs can be
 * inserted and deleted efficiently in their sorted order as the tree enforces a logn
 * maximum height. This implementation provides guaranteed log(n) time cost for the
 * <tt>contains</tt>, <tt>insert</tt> and <tt>remove</tt>
 * operations.  Algorithms are adaptations of those in Thomas H. Cormen, Charles E. Leiserson,
 * Ronald L. Rivest, Clifford Stein <I>Introduction to Algorithms, second edition</I>.<p>
 *
 * The assymptotic running time for important operations are below:
 * <pre>
 *   Method                 big-O
 * ----------------------------------------------------------------------------
 * - clear                  O(1)
 * - clone                  O(n logn)
 * - contains               O(logn)
 * - containsAll            O(m logn) m is the cardinality of the supplied collection
 * - every                  O(n * O(f)) f is the function supplied as argument
 * - filter                 O(n * O(f)) f is the function supplied as argument
 * - forEach                O(n * O(f)) f is the function supplied as argument
 * - get                    O(logn)
 * - getValues              O(n)
 * - insert                 O(logn)
 * - insertAll              O(m logn) m is the cardinality of the supplied collection
 * - map                    O(n * O(f)) f is the function supplied as argument
 * - remove                 O(logn)
 * - removeAll              O(m logn) m is the cardinality of the supplied collection
 * - some                   O(n * O(f)) f is the function supplied as argument
 * - contains               O(n * O(f)) f is the function supplied as argument
 * </pre>
 *
 *
 * Constructs a new Red Black map
 * @param {Function=} compare_func an optional compare function to compare the keys. This function should
 * take two values, a and b, and return x where:
 * <pre>
 *  x < 0 if a < b,
 *  x > 0 if a > b,
 *  x = 0 otherwise
 * </pre>
 * if not defined, a default compare function for <tt>numbers</tt> will be used
 * @constructor
 * @public
 */
var RBnode = function(tree){
    this.tree = tree;
    this.right = this.tree.sentinel;
    this.left = this.tree.sentinel;
    return this;
};

var RedBlackMap = function(compare_func){

    this.RED = true;
    this.BLACK = false;
    this.size = 0;
    this.sentinel = new RBnode(this);
    this.sentinel.color = this.BLACK;
    this.root = this.sentinel; // when the tree is empty, root = sentinel
    this.root.parent = this.sentinel;
    /**
     * Comparison function used to compare values in the tree. This function should
     * take two values, a and b, and return x where:
     * <pre>
     *  x < 0 if a < b,
     *  x > 0 if a > b,
     *  x = 0 otherwise
     * </pre>
     *
     * @type {Function}
     * @private
     */
    RedBlackMap.prototype.compare = compare_func || this.default_compare;
    return this;
};

RedBlackMap.prototype = {constructor: RedBlackMap};

/**
 * A default compare function, if compare_func is not specified.
 * @private
 */
RedBlackMap.prototype.default_compare = function (a,b) {
    if (a < b) return -1;
    else if (b < a) return 1;
    else return 0;
};


/**
 * Clones a set and returns a new set.
 * @return {!RedBlackMap} A new map with the same key-value pairs.
 */
RedBlackMap.prototype.clone = function(){
    var rv = new RedBlackMap(this.compare);
    rv.insertAll(this);
    return rv;

};

/**
 * Removes all elements from this set
 *
 */
RedBlackMap.prototype.clear = function(){
    this.size = 0;
    this.sentinel = new RBnode(this);
    this.sentinel.color = this.BLACK;
    this.root = this.sentinel; // when the tree is empty, root = sentinel
    this.root.parent = this.sentinel;

};


/**
 * A helper function, used for tree balancing
 * @param x {RBnode} the node to rotate about
 * @private
 */
RedBlackMap.prototype.leftRotate = function(x){

    var y = x.right;
    x.right = y.left;
    if (y.left != this.sentinel) y.left.parent= x;
    y.parent = x.parent;
    if (x.parent == this.sentinel){
        this.root = y;
    }
    else if(x==x.parent.left){
        x.parent.left = y;
    }
    else {
        x.parent.right = y;
    }
    y.left = x;
    x.parent = y;

};
/**
 * A helper function, used for tree balancing
 * @param x {RBnode} the node to rotate about
 * @private
 */
RedBlackMap.prototype.rightRotate= function(x){

    var y = x.left;
    x.left = y.right;
    if (y.right != this.sentinel) y.right.parent= x;
    y.parent = x.parent;
    if (x.parent == this.sentinel){
        this.root = y;
    }
    else if(x==x.parent.right){
        x.parent.right = y;
    }
    else {
        x.parent.left = y;
    }
    y.right = x;
    x.parent = y;

};
/**
 * Inserts a key/value pair into the tree
 * @param {*} key the key used for ordering and location
 * @param {*} element the value associated with the key
 * @public
 */
RedBlackMap.prototype.insert = function(key, value){

    if (!this.contains(key)){

        var z = new RBnode(this);
        z.key = key;
        z.value = value;
        var y = this.sentinel;
        var x = this.root;
        while (x != this.sentinel){
            y=x;
            //if (z.key < x.key) x = x.left;
            if (this.compare(z.key, x.key) <0) x = x.left;
            else x=x.right;
        }
        z.parent = y;
        if (y == this.sentinel){
            this.root = z;
        }
        //else if(z.key < y.key){
        else if(this.compare(z.key, y.key) < 0){
            y.left = z;
        }
        else {
            y.right = z;
        }
        z.left = this.sentinel;
        z.right = this.sentinel;
        z.color = this.RED;
        this.insertFixup(z);
        this.size++;
    }
    else{
        var node = this.get_(key);
        node.value = value;
    }
};

/**
 * Helper method for insertAll
 * @private
 */
RedBlackMap.prototype.insertSwapped = function(value, key){
    this.insert(key, value);
};


/**
 * A helper function, used to reestablish the tree invariants after insertion of a node
 * @private
 */
RedBlackMap.prototype.insertFixup = function(z) {

    while (z != this.sentinel && z != this.root && z.parent.color == this.RED) {
        if (z.parent == z.parent.parent.left){
            var y = z.parent.parent.right;
            if (y.color == this.RED){
                z.parent.color = this.BLACK;
                y.color = this.BLACK;
                z.parent.parent.color = this.RED;
                z = z.parent.parent;
            }
            else
            {
                if (z == z.parent.right){
                    z = z.parent;
                    this.leftRotate(z);
                }
                z.parent.color = this.BLACK;
                z.parent.parent.color = this.RED;
                if (z.parent.parent != this.sentinel) this.rightRotate(z.parent.parent);
            }
        }else{
            var y = z.parent.parent.left;
            if (y.color == this.RED){
                z.parent.color = this.BLACK;
                y.color = this.BLACK;
                z.parent.parent.color = this.RED;
                z = z.parent.parent;
            }else{
                if (z == z.parent.left){
                    z=z.parent;
                    this.rightRotate(z);
                }
                z.parent.color = this.BLACK;
                z.parent.parent.color = this.RED;
                if (z.parent.parent != this.sentinel) this.leftRotate(z.parent.parent);
            }
        }
    }
    this.root.color = this.BLACK;
};

/**
 *	Deletes a node in the tree
 * @param z {RBnode} the node to delete
 * @private
 */

RedBlackMap.prototype.delete_ = function(z){
    var y;
    var x;

    if (z.left == this.sentinel || z.right == this.sentinel){
        y = z;

    }
    else {
        y = this.successor_(z);

    }

    if (y.left != this.sentinel){
        x = y.left;

    }
    else {
        x = y.right;

    }
    x.parent = y.parent;
    if (y.parent == this.sentinel){
        this.root = x;

    }
    else if (y == y.parent.left){
        y.parent.left = x;

    }
    else {
        y.parent.right = x;

    }

    if (y != z){
        z.key = y.key;
        z.value = y.value;

    }
    if (y.color == this.BLACK){
        this.deleteFixup(x);

    }
    this.size--;
    //return y;

};


/**
 * A helper function, used to reestablish the tree invariants after deletion of a node
 * @param x {RBnode}
 * @private
 */
RedBlackMap.prototype.deleteFixup = function(x) {

    while (x != this.root && x.color == this.BLACK) {
        if (x == x.parent.left) {
            var w = x.parent.right;

            if (w.color == this.RED) {
                w.color = this.BLACK;
                x.parent.color = this.RED;
                this.leftRotate(x.parent);
                w = x.parent.right;
            }

            if (w.left.color  == this.BLACK &&
                w.right.color == this.BLACK) {
                w.color = this.RED;
                x = x.parent;
            } else {
                if (w.right.color == this.BLACK) {
                    w.left.color = this.BLACK;
                    w.color = this.RED;
                    this.rightRotate(w);
                    w = x.parent.right;
                }
                w.color = x.parent.color;
                x.parent.color = this.BLACK;
                w.right.color = this.BLACK;
                this.leftRotate(x.parent);
                x = this.root;
            }
        } else {
            var w = x.parent.left;

            if (w.color == this.RED) {
                w.color = this.BLACK;
                x.parent.color = this.RED;
                this.rightRotate(x.parent);
                w = x.parent.left;
            }

            if (w.right.color == this.BLACK &&
                w.left.color == this.BLACK) {
                w.color =  this.RED;
                x = x.parent;
            } else {
                if (w.left.color == this.BLACK) {
                    w.right.color = this.BLACK;
                    w.color = this.RED;
                    this.leftRotate(w);
                    w = x.parent.left;
                }
                w.color = x.parent.color;
                x.parent.color = this.BLACK;
                w.left.color = this.BLACK;
                this.rightRotate(x.parent);
                x = this.root;
            }
        }
    }

    x.color = this.BLACK;


};
/**
 * Remove the key and the value associated with it,
 * and returns the value
 * @param {*} key
 * @return {*} the value
 * @public
 */
RedBlackMap.prototype.remove = function(key){
    var x = this.get_(key);
    if (x != this.sentinel){
        var retval = x.value;
        this.delete_(x);
        return retval;
    }
    else return null;
};

/**
 * helper function for removeAll
 * @param {*} key
 * @param {*} value
 * @private
 */
RedBlackMap.prototype.removeSwapped = function(value,key){
    this.remove(key);
};

/**
 * Retrieve the node with the minimum key
 * @param {RBnode} x the node from which to retrieve the minimum key
 * @return {RBnode} the node with the minimum key
 * @private
 */
RedBlackMap.prototype.min = function(x){
    while (x.left != this.sentinel){
        x = x.left;
    }
    return x;
};

/**
 * Retrieve the node with the maximum key
 * @param {RBnode} x the node from which to retrieve the maximum key
 * @return {RBnode} the node with the maximum key
 * @private
 */
RedBlackMap.prototype.max = function(x){
    while (x.right != this.sentinel){
        x = x.right;
    }
    return x;
};

/**
 * Finds and returns the succeeding node of that passed to the function
 * @param {RBnode} x
 * @return {RBnode} the succeeding node
 * @private
 */
RedBlackMap.prototype.successor_ = function(x){
    if (x.right != this.sentinel) return this.min(x.right);
    var y = x.parent;
    while (y != this.sentinel && x==y.right){
        x = y;
        y = y.parent;
    }
    return y;
};

/**
 * Finds and returns the preceeding node of that passed to the function
 * @param {RBnode} x
 * @return {RBnode} the preceeding node
 * @private
 */
RedBlackMap.prototype.predecessor_ = function(x){

    if (x.left != this.sentinel) return this.max(x.left);
    var y = x.parent;
    while (y != this.sentinel && x==y.left){
        x = y;
        y = y.parent;
    }
    return y;
};
/**
 * Finds and returns the value associated with the succeeding key to that passed to the function
 * @param {*} key
 * @return {*} the value associated with the succeeding key
 * @public
 */
RedBlackMap.prototype.successor = function(key){
    // TODO if key not in tree, throw exception?
    if(this.size >0){
        var x = this.get_(key);
        if (x == this.sentinel) return null;
        if (x.right != this.sentinel) return this.min(x.right).value;
        var y = x.parent;
        while (y != this.sentinel && x==y.right){
            x = y;
            y = y.parent;
        }
        if (y != this.sentinel)return y.value;
        else return null;
    }
    else {
        return null;
    }
};
/**
 * Finds and returns the value associated with the preceeding key to that passed to the function
 * @param {*} key
 * @return {*} the value associated with the preceeding key, or null if the tree is not in the map
 * @public
 */
RedBlackMap.prototype.predecessor = function(key){

    if(this.size >0){
        var x = this.get_(key);
        if (x == this.sentinel) return null;
        if (x.left != this.sentinel) return this.max(x.left).value;
        var y = x.parent;
        while (y != this.sentinel && x==y.left){
            x = y;
            y = y.parent;
        }
        if (y != this.sentinel)return y.value;
        else return null;
    }
    else {
        return null;
    }

};

/**
 * Returns the value associated with the minimum key in this tree
 * @return {*} the value associated with the minimum key in this tree
 * @public
 */
RedBlackMap.prototype.getMin = function (){
    return this.min(this.root).value;
};

/**
 * Returns the value associated with the maximum key in this tree
 * @return {*} the value associated with the maximum key in this tree
 * @public
 */
RedBlackMap.prototype.getMax = function (){
    return this.max(this.root).value;
};
/**
 * @return {RBnode} the node with the given key
 * @private
 */
RedBlackMap.prototype.get_ = function(key){
    var x = this.root;
    while (x != this.sentinel && this.compare(x.key, key) !=0){
        if (this.compare(key, x.key)<0) x = x.left;
        else x= x.right;
    }
    return x;
};


/**
 * Finds and returns the value associated with the key that is passed to the function
 * @param {*} key
 * @return {*} the value associated with the key if it exists in this tree, otherwise null
 * @public
 */
RedBlackMap.prototype.get = function(key){
    var x = this.root;
    while (x != this.sentinel && this.compare(x.key, key) != 0){
        if (this.compare(key, x.key)<0) x = x.left;
        else x= x.right;
    }
    return x.value;
};

/**
 * Returns true if the key is associated with a value in this tree
 * @param {*} key
 * @return {Boolean}
 * @public
 */
RedBlackMap.prototype.contains = function(key){
    return this.get_(key).key != null;
};

/**
 * Whether the map contains the given key.
 * @param {*} key The key to check for.
 * @return {boolean} Whether the map contains the key.
 * @private
 */
RedBlackMap.prototype.containsSwapped = function(value, key){
    return this.contains(key);
};

/**
 * Inserts the values stored in the tree into a new Array and returns the Array.
 *
 * @return {Array} An array containing all of the trees values in sorted order.
 */
RedBlackMap.prototype.getValues = function() {
    var ret = [];
    this.traverse(function(x) {
        ret.push(x);
    });
    return ret;
};

/**
 * Inserts the keys stored in the tree into a new Array and returns the Array.
 *
 * @return {Array} An array containing all of the trees values in sorted order.
 */
RedBlackMap.prototype.getKeys = function() {
    var ret = [];
    if (this.isEmpty()) return ret;
    var node = this.min(this.root);
    while (node != this.sentinel){
        ret.push(node.key);
        node = node = this.successor_(node);
    };
    return ret;
};

/**
 * Inserts a collection of key/value pairs into the map
 * If the collection has no notion of keys (i.e. an Array or Set) each element
 * is inserted as both key and value (mapping to it self)
 * @param {Collection || Object || Array} col the collection to insert
 * @public
 */
RedBlackMap.prototype.insertAll = function(col){
    if (typeOf(col) == "array"){
        for (var i = 0; i < col.length; i++){
            this.insert(col[i],col[i]);
        };
    }
    else if (typeOf(col.forEach) == "function"){
        col.forEach(this.insertSwapped, this);
    }
    else if (typeOf(col.getValues) == "function" && typeOf(col.getKeys) == "function" ){
        var vals = col.getValues();
        var keys = col.getKeys();
        for (var i = 0; i < keys.length; i++){
            this.insert(keys[i], vals[i]);
        };
    }
    else if (typeOf(col) == "object") {
        for (var key in col){
            this.insert(key, col[key]);
        }
    }
};



/**
 * Removes a all values contained in the collection from the tree
 * The values in the collection are treated as keys in the tree,
 * and the values associated with those keys are removed.
 * @param {Collection || Array || Object} col the collection of values to remove
 * @public
 */
RedBlackMap.prototype.removeAll = function(col){
    if (typeOf(col) == "array"){
        for (var i = 0; i < col.length; i++){
            this.remove(col[i]);
        };
    }
    else if (typeOf(col.forEach) == "function"){
        col.forEach(this.removeSwapped, this);
    }
    else if (typeOf(col.getValues) == "function"){
        var arr = col.getValues();
        for (var i = 0; i < arr.length; i++){
            this.remove(arr[i]);
        };
    }
    else if (typeOf(col) == "object") {
        for (var key in col){
            this.remove(col[key]);
        }
    }
};

/**
 * Checks that all values contained in the collection are also contained as keys in the tree
 * @param {Collection || Array || Object} col the collection of values to check
 * @return {Boolean}
 * @public
 */
RedBlackMap.prototype.containsAll = function(col){
    if (typeOf(col) == "array"){
        for (var i = 0; i < col.length; i++){
            if (!this.contains(col[i]))
            { return false;
            };
        };
        return true;
    }
    else if (typeOf(col.every) == "function"){
        return col.every(this.containsSwapped, this);
    }
    else if (typeOf(col.getValues) == "function"){
        var arr = col.getValues();
        for (var i = 0; i < arr.length; i++){
            if (!this.contains(arr[i])){
                return false;
            };
        };
        return true;
    }
    else if (typeOf(col) == "object") {
        for (var key in col){
            if (!this.contains(key)){
                return false;
            };
        }
        return true;
    }
};


/**
 * Calls a function on each item in the RedBlackMap.
 *
 * @param {Function} f The function to call for each item. The function takes
 *     three arguments: tha value, the key, and the RedBlackMap.
 * @param {Object=} opt_obj The object context to use as "this" for the
 *     function.
 */
RedBlackMap.prototype.forEach = function(f, opt_obj) {
    if (this.isEmpty()) return;
    for (var n = this.min(this.root); n != this.sentinel; n = this.successor_(n)) {

        f.call(opt_obj, n.value, n.key, this);
    }
};

/**
 * Calls a function on each item in the RedBlackMap and returns true if any of
 * those function calls returns a true-like value.
 *
 * @param {Function} f The function to call for each item. The function takes
 *     three arguments: the value, the key and the RedBlackMap, and returns a
 *     boolean.
 * @param {Object=} opt_obj The object context to use as "this" for the
 *     function.
 * @return {boolean} Whether f evaluates to true for at least one item in the
 *     RedBlackSet.
 */
RedBlackMap.prototype.some = function(f, opt_obj) {
    if (this.isEmpty()) return false;
    for (var n = this.min(this.root); n != this.sentinel; n = this.successor_(n)) {
        if (f.call(opt_obj,n.value, n.key, this)) {
            return true;
        }
    }
    return false;
};


/**
 * Calls a function on each item in the RedBlackMap and returns true only if every
 * function call returns a true-like value.
 *
 * @param {Function} f The function to call for each item. The function takes
 *     three arguments: the value, the key, and the RedBlackMap, and returns a
 *     boolean.
 * @param {Object=} opt_obj The object context to use as "this" for the
 *     function.
 * @return {boolean} Whether f evaluates to true for every item in the RedBlackMap.
 */
RedBlackMap.prototype.every = function(f, opt_obj) {
    if (this.isEmpty()) return false;
    for (var n = this.min(this.root); n != this.sentinel; n = this.successor_(n)) {
        if (!f.call(opt_obj,n.value, n.key, this)) {
            return false;
        }
    }
    return true;
};

/**
 * Calls a function on each item in the RedBlackMap and returns the results of
 * those calls in an array.
 *
 * @param {!Function} f The function to call for each item. The function takes
 *     three arguments: the value, the key, and the RedBlackMap.
 * @param {Object=} opt_obj The object context to use as "this" for the
 *     function.
 * @return {!Array} The results of the function calls for each item in the
 *     RedBlackMap.
 */
RedBlackMap.prototype.map = function(f, opt_obj) {
    var rv = [];
    if (this.isEmpty()) return rv;
    for (var n = this.min(this.root); n != this.sentinel; n = this.successor_(n)) {
        rv.push(f.call(opt_obj, n.value, n.key, this));
    }
    return rv;
};

/**
 * Calls a function on each item in the RedBlackMap, if the function returns true, the key/value pair
 * is inserted into a new RedBlackMap that is returned when the tree is fully traversed
 *
 * @param {!Function} f The function to call for each item. The function takes
 *     three arguments: the value, the key, and the RedBlackMap.
 * @param {Object=} opt_obj The object context to use as "this" for the
 *     function.
 * @return {RedBlackMap} The key / value pairs that evaluated to true in the function calls are returned in
 *    a new RedBlackMap.
 */
RedBlackMap.prototype.filter = function(f, opt_obj) {
    var rv = new RedBlackMap(this.compare);
    if (this.isEmpty()) return rv;
    for (var n = this.min(this.root); n != this.sentinel; n = this.successor_(n)) {
        if (f.call(opt_obj, n.value, n.key, this)) {
            rv.insert(n.key, n.value);
        }
    }
    return rv;
};

/**
 * Finds all key/value pairs that are present in both this map and the given collection.
 * If the collection has no notion of keys (i.e. a Set or an Array), each element of the collection
 * will be treated as key, and it will be inserted to the returned map with its corresponding value from this map.
 * This operation is O(n * O(col.contains)).
 * Example: if col is another RedBlackMap of size m, running time is O(n log(m)),
 * if col is an Array or LinkedList, running time is O(n * m),
 * if col is a HashSet, running time is O(n).
 * @param {Collection || Object} col A collection.
 * @return {RedBlackMap} A new set containing all the key/value pairs (primitives
 *     or objects) present in both this set and the given collection.
 */
RedBlackMap.prototype.intersection = function(col) {
    var rv = new RedBlackMap(this.compare);
    if (this.isEmpty()) return rv;
    if (typeOf(col.get) == 'function'){
        for (var n = this.min(this.root); n != this.sentinel; n = this.successor_(n)) {
            if (col.get.call(col, n.key) == n.value) {
                rv.insert(n.key, n.value);
            }
        }
    }
    else{
        for (var n = this.min(this.root); n != this.sentinel; n = this.successor_(n)) {
            if (contains.call(col, col, n.key)) {
                rv.insert(n.key, n.value);
            }
        }
    }
    return rv;
};

/**
 * Detects wheter all key/value pairs present in this map are also present in the given collection.
 * If the collection has no notion of keys (i.e. a Set or an Array), the result will be whether the keys
 * in this map is a subset of the elements in the collection.
 * This operation is O(n * O(col.contains)).
 * Example: if col is another RedBlackMap of size m, running time is O(n log(m)),
 * if col is an Array or LinkedList, running time is O(n * m),
 * if col is a HashSet, running time is O(n).
 * @param {Collection || Object} col A collection.
 * @return {Boolean} wheter this map is a submap of col
 *
 */
RedBlackMap.prototype.isSubmapOf = function(col) {
    var colCount = getCount(col);
    if (this.getCount() > colCount) {
        return false;
    }
    var i =0;
    if (this.isEmpty()) return true;
    if (typeOf(col.get) == 'function'){
        for (var n = this.min(this.root); n != this.sentinel; n = this.successor_(n)) {
            if (col.get.call(col, n.key) == n.value) {
                i++;
            }
        }
    }
    else{
        for (var n = this.min(this.root); n != this.sentinel; n = this.successor_(n)) {
            if (contains.call(col, col, n.key)) {
                i++;
            }
        }
    }
    return i == this.getCount();
};

/**
 * Returns an array of the values in a given key range in this tree.
 * The 'from' key is inclusive, the 'to' key exclusive
 * @param {*} from the smallest key in the range
 * @param {*} to the successor of the largest key in the range
 * @return {Array} an array of values
 * @public
 */

RedBlackMap.prototype.range = function(from, to){

    var retArray = [];
    var f = function(x){
        retArray.push(x);
    };
    this.traverseFromTo(f, from, to);
    return retArray;

};
/**
 * Performs an in-order traversal of the tree and calls {@code func} with the value of each
 * traversed node. The traversal ends after traversing the tree's
 * maximum node or when {@code func} returns a value that evaluates to true.
 *
 * @param {Function} func Function to call on the value of each traversed node.
 * @public
 */
RedBlackMap.prototype.traverse =
    function(func) {
        if (this.isEmpty()) return;
        var node = this.min(this.root);
        while (node != this.sentinel){

            if (func(node.value)) return;
            node = this.successor_(node);
        }
    };

/**
 * Performs an in-order traversal of the tree and calls {@code func} with the value of each
 * traversed node, starting on the node with a key = to
 * the specified start key. The traversal ends after traversing the tree's
 * maximum node or when {@code func} returns a value that evaluates to true.
 *
 * @param {Function} func Function to call on the value of each traversed node.
 * @param {Object=} fromKey Traversal will begin on the
 *    node with key = fromKey.
 * @public
 */
RedBlackMap.prototype.traverseFrom =
    function(func, fromKey) {
        if (this.isEmpty()) return;
        var node = this.get_(fromKey);
        while (node != this.sentinel){

            if (func(node.value)) return;
            node = this.successor_(node);
        }
    };

/**
 * Performs an in-order traversal of the tree and calls {@code func} with the value of each
 * traversed node. The traversal ends before the node with key = toKey
 * or when {@code func} returns a value that evaluates to true.
 * @param {Function} func Function to call the value of on each traversed node.
 * @param {Object=} toKey Traversal will end before the
 *    node with the smallest key < toKey.
 * @public
 */
RedBlackMap.prototype.traverseTo =
    function(func, toKey) {
        if (this.isEmpty()) return;
        var node = this.min(this.root);
        var toNode = this.get_(toKey);
        while (node != toNode){

            if (func(node.value)) return;
            node = this.successor_(node);
        }
    };

/**
 * Performs an in-order traversal of the tree and calls {@code func} with the value of each
 * traversed node, starting on the node with a key = to
 * the specified start key. The traversal ends before the node with key = toKey
 * or when {@code func} returns a value that evaluates to true.
 *
 * @param {Function} func Function to call on the value of each traversed node.
 * @param {Object=} fromKey Traversal will begin on the
 *    node with key = fromKey.
 * @param {Object=} toKey Traversal will end before the
 *    node with the smallest key < toKey.
 * @public
 */
RedBlackMap.prototype.traverseFromTo =
    function(func,fromKey, toKey) {
        if (this.isEmpty()) return;
        var node = this.get_(fromKey);
        var toNode = this.get_(toKey);
        while (node != toNode){

            if (func(node.value)) return;
            node = this.successor_(node);
        }
    };

/**
 * Performs a reverse-order traversal of the tree and calls {@code f} with the value of
 * each traversed node, optionally starting from the largest node with a value
 * <= to the specified start value. The traversal ends after traversing the
 * tree's minimum node or when func returns a value that evaluates to true.
 *
 * @param {Function} f Function to call on the value of each traversed node.
 * @param {Object=} opt_startValue If specified, traversal will begin on the
 *    node with the largest value <= opt_startValue.
 * @public
 */
RedBlackMap.prototype.traverseBackwards =
    function(f) {
        if (this.isEmpty()) return;
        var node = this.max(this.root);
        while (node != this.sentinel){

            if (f(node.value)) return;
            node = this.predecessor_(node);
        }
    };

/**
 * Returns the current size of the tree (number of elements)
 * @return {Integer}
 * @public
 */

RedBlackMap.prototype.getCount = function(){
    return this.size;
};

/**
 * Returns true current size of the tree is zero
 * @return {Boolean}
 * @public
 */

RedBlackMap.prototype.isEmpty = function(){
    return this.size ==0;
};


var rb = new RedBlackMap();

rb.insert(J$.readInput(0), 3);
rb.insert(J$.readInput(1), 3);
rb.insert(J$.readInput(2), 3);
rb.insert(J$.readInput(3), 3);

	
	

