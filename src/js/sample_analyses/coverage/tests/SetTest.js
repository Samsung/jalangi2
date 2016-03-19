var assert = require('assert');
var Set = require('./../AddCoverage').Features.Set;

describe("Set functionality", function () {
    describe("set creation", function () {
        it("1", function () {
            new Set();
        })
    });
    describe("set add", function () {
        it("add no element", function () {
            var s = new Set();
            s.add();
            assert.equal(JSON.stringify(s.set), JSON.stringify(true));
        });
        it("add one element", function () {
            var s = new Set();
            s.add(1);
            assert.equal(JSON.stringify(s.set), JSON.stringify({"isFinal": false, "children": {"1": true}}));
        });
        it("add two elements", function () {
            var s = new Set();
            s.add(1);
            s.add(2);
            assert.equal(JSON.stringify(s.set), JSON.stringify({"isFinal": false, "children": {"1": true, "2": true}}));
        });
        it("add same elements", function () {
            var s = new Set();
            s.add(1);
            s.add(1);
            assert.equal(JSON.stringify(s.set), JSON.stringify({"isFinal": false, "children": {"1": true}}));
        });
        it("add multi dimensional elements 1", function () {
            var s = new Set();
            s.add("a", "b");
            s.add("a", "c");
            s.add("b", "c");
            assert.equal(JSON.stringify(s.set), JSON.stringify({
                "isFinal": false,
                "children": {
                    "a": {"isFinal": false, "children": {"b": true, "c": true}},
                    "b": {"isFinal": false, "children": {"c": true}}
                }
            }));
        });
        it("add multi dimensional elements 2", function () {
            var s = new Set();
            s.add("a", "b");
            s.add("a", "c");
            s.add("b", "c");
            s.add("c", "b");
            assert.equal(JSON.stringify(s.set), JSON.stringify({
                "isFinal": false,
                "children": {
                    "a": {"isFinal": false, "children": {"b": true, "c": true}},
                    "b": {"isFinal": false, "children": {"c": true}},
                    "c": {"isFinal": false, "children": {"b": true}}
                }
            }));
        });
        it("add same multi dimensional elements 1", function () {
            var s = new Set();
            s.add("a", "b");
            s.add("a", "c");
            s.add("b", "c");
            s.add("a", "c");
            assert.equal(JSON.stringify(s.set), JSON.stringify({
                "isFinal": false,
                "children": {
                    "a": {"isFinal": false, "children": {"b": true, "c": true}},
                    "b": {"isFinal": false, "children": {"c": true}}
                }
            }));
        });
        it("add same multi dimensional elements 2", function () {
            var s = new Set();
            s.add("a", "b");
            s.add("a", "c");
            s.add("b", "c");
            s.add("b", "c");
            assert.equal(JSON.stringify(s.set), JSON.stringify({
                "isFinal": false,
                "children": {
                    "a": {"isFinal": false, "children": {"b": true, "c": true}},
                    "b": {"isFinal": false, "children": {"c": true}}
                }
            }));
        });
        it("add arbitrary multi dimensional elements 1", function () {
            var s = new Set();
            s.add("a", "b");
            s.add("a", "c");
            s.add("b", "c");
            s.add("b", "c");
            s.add("a");
            assert.equal(JSON.stringify(s.set), JSON.stringify({
                "isFinal": false,
                "children": {
                    "a": {"isFinal": true, "children": {"b": true, "c": true}},
                    "b": {"isFinal": false, "children": {"c": true}}
                }
            }));
        });
        it("add arbitrary multi dimensional elements 2", function () {
            var s = new Set();
            s.add("a", "b");
            s.add("a", "c");
            s.add("b", "c");
            s.add("b", "c");
            s.add("a");
            s.add();
            assert.equal(JSON.stringify(s.set), JSON.stringify({
                "isFinal": true,
                "children": {
                    "a": {
                        "isFinal": true,
                        "children": {
                            "b": true,
                            "c": true
                        }
                    },
                    "b": {
                        "isFinal": false,
                        "children": {"c": true}
                    }
                }
            }));
        });
        it("add arbitrary multi dimensional elements 3", function () {
            var s = new Set();
            s.add("a", "b");
            s.add("a", "c");
            s.add("b", "c");
            s.add("b", "c");
            s.add("a");
            s.add();
            s.add("a", "b", "c");
            s.add("a", "b", "c", "d");
            assert.equal(JSON.stringify(s.set), JSON.stringify(
                {
                    "isFinal": true,
                    "children": {
                        "a": {
                            "isFinal": true,
                            "children": {
                                "b": {
                                    "isFinal": true,
                                    "children": {
                                        "c": {
                                            "isFinal": true,
                                            "children": {"d": true}
                                        }
                                    }
                                },
                                "c": true
                            }
                        },
                        "b": {
                            "isFinal": false,
                            "children": {"c": true}
                        }
                    }
                }));
        });
    });
    describe("set clone", function () {
        it("clone empty set", function () {
            var s = new Set();
            s = s.clone();
            assert.equal(JSON.stringify(s.set), JSON.stringify(false));
        });
        it("clone set", function () {
            var s = new Set();
            s.add(1);
            s.add(2);
            s = s.clone();
            assert.equal(JSON.stringify(s.set), JSON.stringify({"isFinal": false, "children": {"1": true, "2": true}}));
        });
        it("clone multi dimensional elements set", function () {
            var s = new Set();
            s.add("a", "b");
            s.add("a", "c");
            s.add("b", "c");
            s.add("c", "b");
            s = s.clone();
            assert.equal(JSON.stringify(s.set), JSON.stringify({
                "isFinal": false,
                "children": {
                    "a": {"isFinal": false, "children": {"b": true, "c": true}},
                    "b": {"isFinal": false, "children": {"c": true}},
                    "c": {"isFinal": false, "children": {"b": true}}
                }
            }));
        });
        it("clone multi dimensional elements set 2", function () {
            var s = new Set();
            s.add("a", "b");
            s.add("a", "c");
            s.add("b", "c");
            s.add("b", "c");
            s = s.clone();
            assert.equal(JSON.stringify(s.set), JSON.stringify({
                "isFinal": false,
                "children": {
                    "a": {"isFinal": false, "children": {"b": true, "c": true}},
                    "b": {"isFinal": false, "children": {"c": true}}
                }
            }));
        });
        it("clone arbitrary multi dimensional set", function () {
            var s = new Set();
            s.add("a", "b");
            s.add("a", "c");
            s.add("b", "c");
            s.add("b", "c");
            s.add("a");
            s.add();
            s.add("a", "b", "c");
            s.add("a", "b", "c", "d");
            s = s.clone();
            assert.equal(JSON.stringify(s.set), JSON.stringify(
                {
                    "isFinal": true,
                    "children": {
                        "a": {
                            "isFinal": true,
                            "children": {
                                "b": {
                                    "isFinal": true,
                                    "children": {
                                        "c": {
                                            "isFinal": true,
                                            "children": {"d": true}
                                        }
                                    }
                                },
                                "c": true
                            }
                        },
                        "b": {
                            "isFinal": false,
                            "children": {"c": true}
                        }
                    }
                }));
        });
    });
    describe("set contains", function () {
        it("contains in empty set", function () {
            var s = new Set();
            assert.equal(false, s.contains(1));
        });
        it("set contains single dimensional", function () {
            var s = new Set();
            s.add(1);
            s.add(2);
            assert.equal(true, s.contains(1));
            assert.equal(true, s.contains(2));
            assert.equal(false, s.contains(3));
        });
        it("set contains multi dimensional 1", function () {
            var s = new Set();
            s.add("a", "b");
            s.add("a", "c");
            s.add("b", "c");
            s.add("c", "b");
            assert.equal(true, s.contains("a", "b"));
            assert.equal(true, s.contains("a", "c"));
            assert.equal(true, s.contains("b", "c"));
            assert.equal(true, s.contains("c", "b"));
            assert.equal(false, s.contains("a"));
            assert.equal(false, s.contains("a", "d"));
        });
        it("set contains multi dimensional 2", function () {
            var s = new Set();
            s.add("a", "b");
            s.add("a", "c");
            s.add("b", "c");
            s.add("b", "c");
            assert.equal(true, s.contains("a", "b"));
            assert.equal(true, s.contains("a", "c"));
            assert.equal(true, s.contains("b", "c"));
            assert.equal(false, s.contains("c", "b"));
            assert.equal(false, s.contains("a"));
            assert.equal(false, s.contains("a", "d"));
            assert.equal(false, s.contains("b", "c", "d"));
        });
        it("set contains in arbitrary dimensional set", function () {
            var s = new Set();
            s.add("a", "b");
            s.add("a", "c");
            s.add("b", "c");
            s.add("b", "c");
            s.add("a");
            s.add();
            s.add("a", "b", "c");
            s.add("a", "b", "c", "d");
            assert.equal(true, s.contains("a"));
            assert.equal(true, s.contains("a", "b"));
            assert.equal(true, s.contains("a", "c"));
            assert.equal(true, s.contains("b", "c"));
            assert.equal(true, s.contains("a", "b", "c"));
            assert.equal(true, s.contains("a", "b", "c", "d"));
            assert.equal(true, s.contains());
            assert.equal(false, s.contains("a", "a"));
            assert.equal(false, s.contains("b"));
            assert.equal(false, s.contains("c"));
            assert.equal(false, s.contains("a", "b", "c", "d", "e"));
        });

    });
    describe("set split", function () {
        it("typical case", function () {
            var s = new Set();
            s.add("a", "1");
            s.add("a", "2");
            s.add("b", "1");
            s.add("b", "2");
            var c;
            var split = s.split(c = {a:{1:1, 3:1}, b:{2:1, 1:2, 4:1}});
            assert.equal('{"isFinal":false,"children":{"a":{"isFinal":false,"children":{"1":true}},"b":{"isFinal":false,"children":{"2":true}}}}', JSON.stringify(split.intersection.set));
            assert.equal('{"isFinal":false,"children":{"a":{"isFinal":false,"children":{"2":true}},"b":{"isFinal":false,"children":{"1":true}}}}', JSON.stringify(split.difference.set));
            assert.equal('{"a":{"1":3,"3":1},"b":{"1":2,"2":3,"4":1}}', JSON.stringify(c));
        });
        it("full intersection", function () {
            var s = new Set();
            s.add("a", "1");
            s.add("a", "2");
            s.add("b", "1");
            s.add("b", "2");
            var c;
            var split = s.split(c = {a:{1:1, 2:1}, b:{2:1, 1:1, 4:1}});
            assert.equal('{"isFinal":false,"children":{"a":{"isFinal":false,"children":{"1":true,"2":true}},"b":{"isFinal":false,"children":{"1":true,"2":true}}}}', JSON.stringify(split.intersection.set));
            assert.equal('false', JSON.stringify(split.difference.set));
            assert.equal('{"a":{"1":3,"2":3},"b":{"1":3,"2":3,"4":1}}', JSON.stringify(c));
        });
        it("empty intersection", function () {
            var s = new Set();
            s.add("a", "1");
            s.add("a", "2");
            s.add("b", "1");
            s.add("b", "2");
            var c;
            var split = s.split(c = {a:{1:2, 2:2}, b:{2:2, 1:2, 4:1}});
            assert.equal('false', JSON.stringify(split.intersection.set));
            assert.equal('{"isFinal":false,"children":{"a":{"isFinal":false,"children":{"1":true,"2":true}},"b":{"isFinal":false,"children":{"1":true,"2":true}}}}', JSON.stringify(split.difference.set));
            assert.equal('{"a":{"1":2,"2":2},"b":{"1":2,"2":2,"4":1}}', JSON.stringify(c));
        });
    });

    describe("set size", function () {
        it("size 1", function () {
            var s = new Set();
            assert.equal(0, s.size());
        });
        it("size 1", function () {
            var s = new Set();
            s.add();
            assert.equal(1, s.size());
        });
        it("add one element", function () {
            var s = new Set();
            s.add(1);
            assert.equal(JSON.stringify(s.set), JSON.stringify({"isFinal": false, "children": {"1": true}}));
        });
        it("add two elements", function () {
            var s = new Set();
            s.add(1);
            s.add(2);
            assert.equal(2, s.size());
        });
        it("add same elements", function () {
            var s = new Set();
            s.add(1);
            s.add(1);
            assert.equal(1, s.size());
        });
        it("add multi dimensional elements 1", function () {
            var s = new Set();
            s.add("a", "b");
            s.add("a", "c");
            s.add("b", "c");
            assert.equal(3, s.size());
        });
        it("add multi dimensional elements 2", function () {
            var s = new Set();
            s.add("a", "b");
            s.add("a", "c");
            s.add("b", "c");
            s.add("c", "b");
            assert.equal(4, s.size());
        });
        it("add same multi dimensional elements 1", function () {
            var s = new Set();
            s.add("a", "b");
            s.add("a", "c");
            s.add("b", "c");
            s.add("a", "c");
            assert.equal(3, s.size());
        });
        it("add same multi dimensional elements 2", function () {
            var s = new Set();
            s.add("a", "b");
            s.add("a", "c");
            s.add("b", "c");
            s.add("b", "c");
            assert.equal(3, s.size());
        });
        it("add arbitrary multi dimensional elements 1", function () {
            var s = new Set();
            s.add("a", "b");
            s.add("a", "c");
            s.add("b", "c");
            s.add("b", "c");
            s.add("a");
            assert.equal(4, s.size());
        });
        it("add arbitrary multi dimensional elements 2", function () {
            var s = new Set();
            s.add("a", "b");
            s.add("a", "c");
            s.add("b", "c");
            s.add("b", "c");
            s.add("a");
            s.add();
            assert.equal(5, s.size());
        });
        it("add arbitrary multi dimensional elements 3", function () {
            var s = new Set();
            s.add("a", "b");
            s.add("a", "c");
            s.add("b", "c");
            s.add("b", "c");
            s.add("a");
            s.add();
            s.add("a", "b", "c");
            s.add("a", "b", "c", "d");
            assert.equal(7, s.size());
        });
    });

});
