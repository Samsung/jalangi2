


(function() {

    var SPECIAL_PROP = "*J$*";
    var objectId = 1;
    var map = new WeakMap();
    var SZ = 10000;
    var N = 1000000;
    var arr = new Array(SZ);
    var APPLY = Function.prototype.apply;
    var CALL = Function.prototype.call;
    APPLY.apply = APPLY;
    APPLY.call = CALL;
    CALL.apply = APPLY;
    CALL.call = CALL;

    var HAS_OWN_PROPERTY = Object.prototype.hasOwnProperty;

    var HOP = function (obj, prop) {
        return (prop + "" === '__proto__') || CALL.call(HAS_OWN_PROPERTY, obj, prop); //Constants.HAS_OWN_PROPERTY_CALL.apply(Constants.HAS_OWN_PROPERTY, [obj, prop]);
    };

    function getUniqueId1(val) {
        if (!HOP(val, SPECIAL_PROP)) {
            if (Object && Object.defineProperty && typeof Object.defineProperty === 'function') {
                Object.defineProperty(val, SPECIAL_PROP, {
                    enumerable: false,
                    writable: true
                });
            }
            val[SPECIAL_PROP] = {};
            val[SPECIAL_PROP][SPECIAL_PROP] = objectId;
            objectId = objectId + 2;
        }
        if (HOP(val, SPECIAL_PROP) && val[SPECIAL_PROP] && typeof val[SPECIAL_PROP][SPECIAL_PROP] === 'number') {
            return val[SPECIAL_PROP][SPECIAL_PROP];
        } else {
            return -1;
        }
    }

    function getUniqueId2(val) {
        if (!HOP(val, SPECIAL_PROP)) {
            if (Object && Object.defineProperty && typeof Object.defineProperty === 'function') {
                Object.defineProperty(val, SPECIAL_PROP, {
                    enumerable: false,
                    writable: true
                });
            }
            val[SPECIAL_PROP] = objectId;
            objectId = objectId + 2;
        }
        if (HOP(val, SPECIAL_PROP) && typeof val[SPECIAL_PROP] === 'number') {
            return val[SPECIAL_PROP];
        } else {
            return -1;
        }
    }

    function getUniqueId5(val) {
        if (!val.hasOwnProperty(SPECIAL_PROP)) {
            if (Object && Object.defineProperty && typeof Object.defineProperty === 'function') {
                Object.defineProperty(val, SPECIAL_PROP, {
                    enumerable: false,
                    writable: true
                });
            }
            val[SPECIAL_PROP] = {};
            val[SPECIAL_PROP][SPECIAL_PROP] = objectId;
            objectId = objectId + 2;
        }
        if (val.hasOwnProperty(SPECIAL_PROP) && val[SPECIAL_PROP] && typeof val[SPECIAL_PROP][SPECIAL_PROP] === 'number') {
            return val[SPECIAL_PROP][SPECIAL_PROP];
        } else {
            return -1;
        }
    }

    function getUniqueId3(val) {
        if (!map.has(val)) {
            var o = {};
            o[SPECIAL_PROP] = objectId;
            map.set(val, o);
            objectId = objectId + 2;
        }
        if (map.has(val)) {
            return map.get(val)[SPECIAL_PROP];
        } else {
            return -1;
        }
    }

    function getUniqueId4(val) {
        if (!map.has(val)) {
            map.set(val, objectId);
            objectId = objectId + 2;
        }
        if (map.has(val)) {
            return map.get(val);
        } else {
            return -1;
        }
    }

    var sum = 1;
    var testfun;
    switch(process.argv[2]) {
        case "1":
            console.log("Using defineProperty and shadowObject");
            testfun = getUniqueId1;
            break;
        case "2":
            console.log("Using defineProperty and no shadowObject");
            testfun = getUniqueId2;
            break;
        case "3":
            console.log("Using WeakMap and shadowObject");
            testfun = getUniqueId3;
            break;
        case "4":
            console.log("Using WeakMap and no shadowObject");
            testfun = getUniqueId4;
            break;
    }

    for (var i=0; i<N; i++) {
        var o = arr[i%SZ] = {a:i, b:i+1};
        var x = testfun(o);
        sum = x;
    }
    console.log(sum);

})();
