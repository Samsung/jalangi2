MockElement = function MockElement_f() {
    this.appendChild = function(a) {};
    this.createComment = function(a) {};
    this.createDocumentFragment = function() {
        return new MockElement;
    };
    this.createElement = function(a) {
        return new MockElement;
    };
    this.documentElement = this;
    this.getElementById = function(a) {};
    this.getElementsByTagName = function(a) {
        return [ 0 ];
    };
    this.insertBefore = function(a, b) {};
    this.removeChild = function(a) {};
    this.setAttribute = function(a, b) {};
};

var windowmock = {
    document: new MockElement,
    navigator: {
        userAgent: ""
    }
};

(function(a, b) {
    var c = a.document, d = a.navigator, f = function() {
        var e = function(a, b) {
            return new e.fn.init(a, b, h);
        }, h, j = /\S/, r = /(webkit)[ \/]([\w.]+)/, s = /(opera)(?:.*version)?[ \/]([\w.]+)/, t = /(msie) ([\w.]+)/, u = /(mozilla)(?:.*? rv:([\w.]+))?/, y = d.userAgent, C = Object.prototype.toString, E = Array.prototype.push, G = String.prototype.trim, I = {};
        e.fn = e.prototype = {
            init: function(a, d, f) {
                if (e.isFunction(a)) return f.ready(a);
            }
        }, e.fn.init.prototype = e.fn, e.extend = e.fn.extend = function() {
            var c, i = arguments[0] || {}, j = 1, k = arguments.length, l = !1;
            typeof i == "boolean" && (l = i, i = arguments[1] || {}, j = 2), typeof i != "object" && !e.isFunction(i) && (i = {}), k === j && (i = this, --j);
            for (; j < k; j++) if ((a = arguments[j]) != null) for (c in a) {
                d = i[c], f = a[c];
                l && f && (e.isPlainObject(f) || (g = e.isArray(f))) ? (g ? (g = !1, h = d && e.isArray(d) ? d : []) : h = d && e.isPlainObject(d) ? d : {}, i[c] = e.extend(l, h, f)) : f !== b && (i[c] = f);
            }
        }, e.extend({
            isFunction: function(a) {
                return e.type(a) === "function";
            },
            type: function(a) {
                return a == null ? String(a) : I[C.call(a)] || "object";
            },
            each: function(a, c, d) {
                var h = a.length, i = h === b || e.isFunction(a);
            },
            uaMatch: function(a) {
                var b = r.exec(a) || s.exec(a) || t.exec(a) || a.indexOf("compatible") < 0 && u.exec(a) || [];
                return {};
            },
            browser: {}
        }), e.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(a, b) {}), z = e.uaMatch(y), z.browser && (e.browser[z.browser] = !0, e.browser.version = z.version), e.browser.webkit && (e.browser.safari = !0), j.test(" ") && (k = /^[\s\xA0]+/, l = /[\s\xA0]+$/), h = e(c), c.addEventListener ? B = function() {} : c.attachEvent && (B = function() {});
        return e;
    }();
    f.extend({}), f.support = function() {
        var p = c.createElement("div");
        p.setAttribute("className", "t"), p.innerHTML = "   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>", d = p.getElementsByTagName("*"), e = p.getElementsByTagName("a")[0];
    }();
})(windowmock);