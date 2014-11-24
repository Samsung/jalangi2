if (typeof window === "undefined") {
    require('../../src/js/InputManager2');
    require(process.cwd()+'/inputs');
}

// https://github.com/fitzgen/pfds-js/blob/master/red-black-trees.js

function T (color, left, el, right) {
    this._color = color;
    this._left = left;
    this._el = el;
    this._right = right;

    return this;
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

function member (x, t) {
    if ( t === empty ) {
        return false;
    } else {
        if ( x < t._el ) {
            return member(x, t._left);
        } else if ( t._el < x ) {
            return member(x, t._right);
        } else {
            return true;
        }
    }
}

function insert (x, t) {
    function ins (s) {
        if ( s === empty ) {
            return new T(R, empty, x, empty);
        } else {
            var color = s._color,
                a = s._left,
                y = s._el,
                b = s._right;
            if ( x < y ) {
                return balance(color, ins(a), y, b);
            } else if ( y < x ) {
                return balance(color, a, y, ins(b));
            } else {
                return s;
            }
        }
    }
    var s = ins(t);
    return new T(B, s._left, s._el, s._right);
}


var tree = empty;
var x, y, z, w, u;
x = J$.readInput(0);
y = J$.readInput(0);
z = J$.readInput(0);
w = J$.readInput(0);
u = J$.readInput(0);

tree = insert(x, tree);
tree = insert(y, tree);
tree = insert(z, tree);
tree = insert(w, tree);
