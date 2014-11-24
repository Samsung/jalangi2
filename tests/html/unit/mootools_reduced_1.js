(function () {
    var typeOf = function () {
    };
    Function.prototype.overloadSetter = function () {
        var self = this;
        return function (a, b) {
            if (typeof a != 'string')
                for (var k in a)
                    self.call(this, k, a[k]);
            else
                self.call(this, a, b);
        };
    };
    Function.prototype.extend = function (key, value) {
        this[key] = value;
    }.overloadSetter();
    Function.prototype.implement = function (key, value) {
        this.prototype[key] = value;
    }.overloadSetter();
    var slice = Array.prototype.slice;
    Function.implement({
        protect: function () {
            return this;
        }
    });
    var Type = this.Type = function (name, object) {
            object.extend(this);
            return object;
        };
    var hooks = {};
    var hooksOf = function () {
        var type = typeOf();
        return hooks[type] || (hooks[type] = []);
    };
    var implement = function (name, method) {
        var hooks = hooksOf();
        for (var i = 0; i < hooks.length; i++) {
            var hook = hooks[i];
            hook.call(this, name, method);
        }
        this.prototype[name] = method;
        extend.call(this, name, function (item) {
            return method.apply(item, slice.call(arguments, 1));
        });
    };
    var extend = function (name, method) {
        this[name] = method;
    };
    Type.implement({
        implement: implement.overloadSetter(),
        mirror: function (hook) {
            hooksOf().push(hook);
        }
    });
    var force = function (name, object, methods) {
        var prototype = object.prototype;
        new Type(name, object);
        for (var i = 0, l = methods.length; i < l; i++) {
            var key = methods[i], proto = prototype[key];
            object.implement(key, proto.protect());
        }
        return force;
    };
    force('String', String, [])('Array', Array, ['slice'])('Number', Number, [])('Function', Function, [])('RegExp', RegExp, [])('Object', Object, [])('Date', Date, []);
}());
Array.implement({
    invoke: function (methodName) {
        var args = Array.slice(arguments, 1);
        return this.map(function (item) {
            return item[methodName].apply(item, args);
        });
    }
});
(function () {
    var window = this;
    this.Window = new Type('Window', function () {
    });
    Window.mirror(function (name, method) {
        window[name] = method;
    });
}());
(function () {
    [Window].invoke('implement', {
        addEvent: function () {
        }
    });
}());
(function () {
    window.addEvent();
}());