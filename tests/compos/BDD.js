/*
 * Copyright 2013 Samsung Information Systems America, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Author: Koushik Sen
//------------------------------------------- Begin boolean MySymbolic expressions ----------------------------


var MySymbolicBool;
var MySymbolic = {};

function init (){

    MySymbolicBool = function (op, left, right) {
        if (!(this instanceof MySymbolicBool)){
            return new MySymbolicBool(op, left, right);
        }
        this.left = left;
        this.right = right;
        switch(op) {
            case "!":
                if (left.op === MySymbolicBool.TRUE) {
                    return MySymbolicBool.false;
                } else if (left.op === MySymbolicBool.FALSE) {
                    return MySymbolicBool.true;
                }
                this.op = MySymbolicBool.NOT;
                break;
            case "&&":
                if (left.op === MySymbolicBool.TRUE) {
                    return right;
                } else if (left.op === MySymbolicBool.FALSE) {
                    return MySymbolicBool.false;
                }
                if (right.op === MySymbolicBool.TRUE) {
                    return left;
                } else if (right.op === MySymbolicBool.FALSE) {
                    return MySymbolicBool.false;
                }
                this.op = MySymbolicBool.AND;
                break;
            case "||":
                if (left.op === MySymbolicBool.TRUE) {
                    return MySymbolicBool.true;
                } else if (left.op === MySymbolicBool.FALSE) {
                    return right;
                }
                if (right.op === MySymbolicBool.TRUE) {
                    return MySymbolicBool.true;
                } else if (right.op === MySymbolicBool.FALSE) {
                    return left;
                }
                this.op = MySymbolicBool.OR;
                break;
            case "true":
                this.op = MySymbolicBool.TRUE;
                break;
            case "false":
                this.op = MySymbolicBool.FALSE;
                break;
            default:
                this.op = MySymbolicBool.LITERAL;
                this.left = op;
        }
    }



    MySymbolicBool.simpleImplies = function(f1, f2) {
        if (f1 === f2) {
            return true;
        } else if (f1 instanceof MySymbolicBool && f1.isAnd()) {
            if (MySymbolicBool.simpleImplies(f1.left, f2) || MySymbolicBool.simpleImplies(f1.right, f2)) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    };

    MySymbolicBool.NOT = 0;
    MySymbolicBool.AND = 1;
    MySymbolicBool.OR = 2;
    MySymbolicBool.IMPLIES = 3;
    MySymbolicBool.EQUIV = 4;
    MySymbolicBool.XOR = 5;
    MySymbolicBool.TRUE = 6;
    MySymbolicBool.FALSE = 7;
    MySymbolicBool.LITERAL = 8;

    MySymbolicBool.prototype = {
        constructor: MySymbolicBool,
        not: function() {
            switch(this.op) {
                case MySymbolicBool.NOT:
                    return this.left;
                    break;
                case MySymbolicBool.TRUE:
                    return MySymbolicBool.false;
                    break;
                case MySymbolicBool.FALSE:
                    return MySymbolicBool.true;
                default:
                    return new MySymbolicBool("!",this);
            }
        },

        substitute: function(assignments) {
            var left = this.left?this.left.substitute(assignments):this.left;
            var right = this.right?this.right.substitute(assignments):this.right;
            switch(this.op) {
                case MySymbolicBool.FALSE:
                case MySymbolicBool.TRUE:
                    return this;
                case MySymbolicBool.NOT:
                    if (left === MySymbolicBool.true) {
                        return MySymbolicBool.false;
                    } else if (left === MySymbolicBool.false) {
                        return MySymbolicBool.true;
                    } else if (left === this.left) {
                        return this;
                    } else {
                        return new MySymbolicBool("!",left);
                    }
                case MySymbolicBool.AND:
                    if (left === this.left && right === this.right) {
                        return this;
                    } else if (left === MySymbolicBool.true) {
                        return right;
                    } else if (right === MySymbolicBool.true) {
                        return left;
                    } else if (left === MySymbolicBool.false || right === MySymbolicBool.false) {
                        return MySymbolicBool.false;
                    } else {
                        return new MySymbolicBool("&&", left, right);
                    }
                case MySymbolicBool.OR:
                    if (left === this.left && right === this.right) {
                        return this;
                    } else if (left === MySymbolicBool.false) {
                        return right;
                    } else if (right === MySymbolicBool.false) {
                        return left;
                    } else if (left === MySymbolicBool.true || right === MySymbolicBool.true) {
                        return MySymbolicBool.true;
                    } else {
                        return new MySymbolicBool("||", left, right);
                    }
                default:
                    return this;
            }
        },

        isAnd: function() {
            return this.op === MySymbolicBool.AND;
        },

        isOr: function() {
            return this.op === MySymbolicBool.OR;
        },

        toString: function() {
            switch(this.op) {
                case MySymbolicBool.TRUE:
                    return "TRUE";
                case MySymbolicBool.FALSE:
                    return "FALSE";
                case MySymbolicBool.NOT:
                    return "(!"+this.left+")";
                case MySymbolicBool.AND:
                    return "("+this.left+" && " + this.right+")";
                case MySymbolicBool.OR:
                    return "("+this.left+" || " + this.right+")";
                case MySymbolicBool.LITERAL:
                    return "b"+this.left;
            }
        },

        getFormulaString: function(freeVars, mode, assignments) {
            var sb = "(", tmp;
            switch(this.op) {
                case MySymbolicBool.FALSE:
                    sb += "FALSE";
                    break;
                case MySymbolicBool.TRUE:
                    sb += "TRUE";
                    break;
                case MySymbolicBool.NOT:
                    sb += "NOT ";
                    sb += this.left.getFormulaString(freeVars, mode, assignments);
                    break;
                case MySymbolicBool.AND:
                    tmp = this.left.getFormulaString(freeVars, mode, assignments);
                    sb += tmp;
                    sb += " AND ";
                    sb += this.right.getFormulaString(freeVars, mode, assignments);
                    break;
                case MySymbolicBool.OR:
                    tmp = this.left.getFormulaString(freeVars, mode, assignments);
                    sb += tmp;
                    sb += " OR ";
                    sb += this.right.getFormulaString(freeVars, mode, assignments);
                    break;
            }
            sb += ")";
            return sb;
        },


        print: function(formulaFh) {
            fs.writeSync(formulaFh,"(");
            switch(this.op) {
                case MySymbolicBool.NOT:
                    fs.writeSync(formulaFh,"NOT ");
                    this.left.print(formulaFh);
                    break;
                case MySymbolicBool.AND:
                    this.left.print(formulaFh);
                    fs.writeSync(formulaFh," AND ");
                    this.right.print(formulaFh);
                    break;
                case MySymbolicBool.OR:
                    this.left.print(formulaFh);
                    fs.writeSync(formulaFh," OR ");
                    this.right.print(formulaFh);
                    break;
            }
            fs.writeSync(formulaFh,")");
        },

        type: MySymbolic

    };

    MySymbolicBool.true = new MySymbolicBool("true");
    MySymbolicBool.false = new MySymbolicBool("false");

//------------------------------------------- End boolean MySymbolic expressions ----------------------------
};

var MyBdd = {};


(function(){

    function Hash() {
        this.table = [];
        this.nextNodeId = 2;
    }

    Hash.prototype = {
        constructor: Hash,

        put: function(i, l, h, u) {
            l = l.id;
            h = h.id;
            var tmp = this.table[l];
            if (!tmp) {
                tmp = this.table[l] = [];
            }
            var tmp2 = tmp[h];
            if (!tmp2) {
                tmp2 = tmp[h] = {};
            }
            tmp2[i] = u;
        },

        get: function(i, l, h) {
            l = l.id;
            h = h.id;
            var tmp;
            if (!(tmp = this.table[l])) {
                return null;
            }
            if (!(tmp = tmp[h])) {
                return null;
            }
            if (!(tmp = tmp[i])) {
                return null;
            }
            return tmp;
        },

        clear: function() {
            this.table = [];
            this.nextNodeId = 2;
        },

        getNextNodeID: function() {
            var ret = this.nextNodeId;
            this.nextNodeId = ret + 1;
            return ret;
        }

    }

    function Graph() {
        this.table = [];
    }

    Graph.prototype = {
        constructor: Graph,

        put: function(u1, u2, u) {
            u1 = u1.id;
            u2 = u2.id;
            var tmp = this.table[u1];
            if (!tmp) {
                tmp = this.table[u1] = [];
            }
            tmp[u2] = u;
        },

        get: function(u1, u2) {
            u1 = u1.id;
            u2 = u2.id;
            var tmp;
            if (!(tmp = this.table[u1])) {
                return null;
            }
            if (!(tmp = tmp[u2])) {
                return null;
            }
            return tmp;
        },

        clear: function() {
            this.table = [];
        }

    }

    var H = new Hash();

    function Node(i, l, h, id) {
        this.var = i;
        this.low = l;
        this.high = h;
        this.id = id;
    }

    Node.prototype.toString = function() {
//        if (STAT_FLAG) stats.resumeTimer("MyBdd");
        var ret = MyBdd.getFormula(this).toString();
//        if (STAT_FLAG) stats.suspendTimer("MyBdd");
        return ret;
    };

    Node.prototype.and = function(u) {
//        if (STAT_FLAG) stats.resumeTimer("MyBdd");
        var ret = MyBdd.apply("&&", this, u);
//        if (STAT_FLAG) stats.suspendTimer("MyBdd");
        return ret;
    };

    Node.prototype.or = function(u) {
//        if (STAT_FLAG) stats.resumeTimer("MyBdd");
        var ret = MyBdd.apply("||", this, u);
//        if (STAT_FLAG) stats.suspendTimer("MyBdd");
        return ret;
    };

    Node.prototype.not = function() {
//        if (STAT_FLAG) stats.resumeTimer("MyBdd");
        var ret = MyBdd.not(this);
//        if (STAT_FLAG) stats.suspendTimer("MyBdd");
        return ret;
    };

    Node.prototype.isEqual = function(u) {
//        if (STAT_FLAG) stats.resumeTimer("MyBdd");
        var ret = MyBdd.isEqual(this,u);
//        if (STAT_FLAG) stats.suspendTimer("MyBdd");
        return ret;
    };

    Node.prototype.isZero = function() {
        return this === MyBdd.zero;
    };

    Node.prototype.isOne = function() {
        return this === MyBdd.one;
    };


    MyBdd.one = new Node(10000000, null, null, 1);
    MyBdd.zero = new Node(10000000, null, null, 0);

    MyBdd.isZeroOne = function(u) {
        return u === MyBdd.one || u === MyBdd.zero;
    };

    function make (i, l, h) {
        var ret;
        if (l===h) {
            return l;
        } else if (ret = H.get(i, l, h)) {
            return ret;
        } else {
            ret = new Node(i, l, h, H.getNextNodeID());
            H.put(i, l, h, ret);
            return ret;
        }
    }

    function applyToBool(op, u1, u2) {
        var ret, tmp1 = u1.id, tmp2 = u2.id;
        switch(op) {
            case "&&":
                ret = tmp1 && tmp2;
                break;
            case "||":
                ret = tmp1 || tmp2;
                break;
            case "=>":
                ret = (!tmp1) || tmp2;
                break;
            default:
                throw new Error("Unknown op "+op);
        }
        return ret?MyBdd.one:MyBdd.zero;
    }

    var G;

    function app(op, u1, u2) {
        var ret;
        if ((ret = G.get(u1, u2))) {
            return ret;
        }
        if (MyBdd.isZeroOne(u1) && MyBdd.isZeroOne(u2)) {
            return applyToBool(op, u1, u2);
        }
        if (u1.var === u2.var) {
            ret = make(u1.var, app(op, u1.low, u2.low), app(op, u1.high, u2.high));
        } else if (u1.var < u2.var) {
            ret = make(u1.var, app(op, u1.low, u2), app(op, u1.high, u2));
        } else {
            ret = make(u2.var, app(op, u1, u2.low), app(op, u1, u2.high));
        }
        G.put(u1, u2, ret);
        return ret;
    }

    function not(u) {
        var ret;
        if (u === MyBdd.one) {
            return MyBdd.zero;
        }
        if (u === MyBdd.zero) {
            return MyBdd.one;
        }
        ret = make(u.var, not(u.low), not(u.high));
        return ret;
    }

    MyBdd.build = function(i) {
        return new Node(i, MyBdd.zero, MyBdd.one, 2);
    };

    MyBdd.buildNot = function(i) {
        return new Node(i, MyBdd.one, MyBdd.zero, 2);
    };

    MyBdd.apply = function(op, u1, u2) {
        G = new Graph();
        H.clear();
        return app(op, u1, u2);
    };


    MyBdd.not = function(u) {
        H.clear();
        return not(u);
    };



    MyBdd.size = function(u)  {
        var nodes = {size:0};
        size(u, nodes);
        return nodes.size;
    };

    function size (u, nodes) {
        if (u !== MyBdd.one && u !== MyBdd.zero) {
            if (!Object.prototype.hasOwnProperty.call(nodes, u.id)) {
                nodes.size = nodes.size + 1;
                nodes[u.id] = true;
            }
            size (u.high, nodes);
            size (u.low, nodes);
        }
    }

    MyBdd.getFormula = function(u, literalToFormulas) {
        if (u === MyBdd.one) {
            return MySymbolicBool.true;
        }
        if (u === MyBdd.zero) {
            return MySymbolicBool.false;
        }
        var t;

        t = literalToFormulas?literalToFormulas[u.var-1]: new MySymbolicBool(u.var);

        return new MySymbolicBool("||",
            new MySymbolicBool("&&",
                t,
                MyBdd.getFormula(u.high, literalToFormulas)),
            new MySymbolicBool("&&",
                t.not(),
                MyBdd.getFormula(u.low, literalToFormulas)));
    };

    MyBdd.isEqual = function(u, v) {
        G = new Graph();
        return MyBdd.isEqualAux(u,v);
    };

    MyBdd.isEqualAux = function(u, v) {
        var ret, tmp;
        if ((tmp = G.get(u,v))!==null)
            return tmp;
        if ((u === MyBdd.one && v == MyBdd.one) || (u === MyBdd.zero && v == MyBdd.zero)) {
            G.put(u,v,true);
            return true;
        } else if (u === MyBdd.one || v == MyBdd.zero || u === MyBdd.zero || v == MyBdd.one) {
            G.put(u,v,false);
            return false;
        }
        if (u.var !== v.var) {
            G.put(u,v,false);
            return false;
        }
        ret = MyBdd.isEqualAux(u.high, v.high) && MyBdd.isEqualAux(u.low, v.low);
        G.put(u,v,ret);
        return ret;
    };

    MyBdd.Node = Node;

})();

//function ndSwap(vars, i, j) {
//    if (J$.readInput(0)) {
//        var tmp = vars[i];
//        vars[i] = vars[j];
//        vars[j] = tmp;
//    }
//}
//
//function setup() {
//    var N = 3, tmp, i, j;
//    var vars = [];
//    for (i = 0; i < N; i++) {
//        vars[i] = MyBdd.build(i + 1);
//    }
//    for (i = 0; i < N; i++) {
//        for (j = i; j < N; j++) {
//            ndSwap(vars,i,j);
//        }
//    }
//    return vars;
//}
//
//var vars = setup();
//vars[0].not().and(vars[1].not()).not().or(vars[2]).not();


var result = MyBdd.build(1)

var N = 3, i;
var vars = [];
for (i = 0; i < N; i++) {
    vars[i] = MyBdd.build(i + 2);
}


function oneOp(choice1, choice2, i) {
    var op1, op2;

    if (choice1 == 1) {
        op1 = vars[i].not();
        op2 = result.not();
    } else if (choice1 == 2) {
        op1 = vars[i].not();
        op2 = result;
    } else if (choice1 == 3) {
        op1 = vars[i];
        op2 = result.not();
    } else {
        op1 = vars[i];
        op2 = result;
    }
    if (choice2 === 1) {
        result = op1.and(op2);
    } else {
        result = op1.or(op2);
    }
}

function runTest() {
    for (var i=0; i<N; i++) {
        oneOp(J$.readInput(1), J$.readInput(2), i);
    }
}

runTest();
