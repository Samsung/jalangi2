
// https://raw.githubusercontent.com/fitzgen/pfds-js/master/red-black-trees.js

/*jslint onevar: true, undef: true, eqeqeq: true, bitwise: true,
 newcap: true, immed: true, nomen: false, white: false, plusplus: false,
 laxbreak: true */

/*global define */

function RB(lt) {

    function T (color, left, el, right) {
        this._color = color;
        this._left = left;
        this._el = el;
        this._right = right;
    }

    var empty = null,
        R = 1,
        B = 2;

    function balance (color, left, val, right) {
        if ( color === B ) {
            if ( left && left._color === R
                && left._left && left._left._color === R ) {
                return new T(R,
                    new T(B,
                        left._left._left,
                        left._left._el,
                        left._left._right),
                    left._el,
                    new T(B, left._right, val, right));
            }
            if ( left && left._color === R
                && left._right && left._right._color === R ) {
                return new T(R,
                    new T(B,
                        left._left,
                        left._left._el,
                        left._right._left),
                    left._right._el,
                    new T(B, left._right._right, val, right));
            }
            if ( right && right._color === R
                && right._left && right._left._color === R ) {
                return new T(R,
                    new T(B, left, val, right._left._left),
                    right._left._el,
                    new T(B,
                        right._left._right,
                        right._el,
                        right._right));
            }
            if ( right && right._color === R
                && right._right && right._right._color === R ) {
                return new T(R,
                    new T(B, left, val, right._left),
                    right._el,
                    new T(B,
                        right._right._left,
                        right._right._el,
                        right._right._right));
            }
        }
        return new T(color, left, val, right);
    }

    return {

        empty: empty,

        member: function member (x, t) {
            if ( t === empty ) {
                return false;
            } else {
                if ( lt(x, t._el) ) {
                    return member(x, t._left);
                } else if ( lt(t._el, x) ) {
                    return member(x, t._right);
                } else {
                    return true;
                }
            }
        },

        insert: function insert (x, t) {
            function ins (s) {
                if ( s === empty ) {
                    return new T(R, empty, x, empty);
                } else {
                    var color = s._color,
                        a = s._left,
                        y = s._el,
                        b = s._right;
                    if ( lt(x, y) ) {
                        return balance(color, ins(a), y, b);
                    } else if ( lt(y, x) ) {
                        return balance(color, a, y, ins(b));
                    } else {
                        return s;
                    }
                }
            }
            var s = ins(t);
            return new T(B, s._left, s._el, s._right);
        }

    };

}

function lt(x, y) {
    return x < y;
}


var RBTree = RB(lt);

var tree = RBTree.empty;

tree = RBTree.insert(2, tree);
tree = RBTree.insert(0, tree);
tree = RBTree.insert(1, tree);

