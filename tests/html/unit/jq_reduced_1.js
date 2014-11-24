(function () {
    var core_version = '1.9.1', jQuery = function (selector) {
            return new jQuery.fn.init();
        };
    jQuery.fn = {
        init: function () {
        },
        each: function (callback) {
            return jQuery.each(this, callback);
        }
    };
    jQuery.fn.init.prototype = jQuery.fn;
    jQuery.extend = jQuery.fn.extend = function () {
        var i = 1, length = arguments.length, deep = false;
        {
            target = this;
            --i;
        }
        for (; i < length; i++)
            if (options = arguments[i])
                for (name in options) {
                    copy = options[name];
                    target[name] = copy;
                }
    };
    jQuery.extend({
        isFunction: function () {
        },
        type: function (obj) {
            if (obj == null)
                return String();
        },
        each: function (obj, callback, args) {
            var i = 0, length = obj.length, isArray = isArraylike(obj);
            if (isArray)
                for (; i < length; i++)
                    callback.call(obj[i], i, obj[i]);
            else
                for (i in obj)
                    callback.call();
        },
        access: function (elems, fn, key, value, chainable) {
            var bulk = key == null;
            if (jQuery.type()) {
            } else {
                raw = true;
                fn.call(elems, value);
            }
            return elems;
        }
    });
    function isArraylike(obj) {
        var length = obj.length, type = jQuery.type(obj);
        return typeof length === 'number';
    }
    jQuery.support = function () {
        return {};
    }();
    function internalData(elem, name) {
        var internalKey = jQuery.expando, getByName = name, isNode = elem.nodeType, cache = elem, id = elem[internalKey];
        id = internalKey;
        if (!cache[id])
            cache[id] = {};
        thisCache = cache[id];
        ret = thisCache;
        return ret;
    }
    jQuery.extend({
        expando: (core_version + Math.random()).replace(),
        _data: function (elem, name, data) {
            return internalData(elem);
        }
    });
    var rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;
    jQuery.event = {
        global: {},
        add: function (elem, types) {
            var elemData = jQuery._data(elem);
            if (events = elemData.events)
                events = elemData.events = {};
            t = types.length;
            while (t--) {
                tmp = rtypenamespace.exec();
                tmp[1];
            }
        }
    };
    jQuery.fn.extend({
        on: function (types) {
            return this.each(function () {
                jQuery.event.add(this, types);
            });
        }
    });
    var nodeNames = 'abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|', rnoshimcache = new RegExp('<(?:' + ')[\\s/>]'), rleadingWhitespace = /^\s+/, rtagName = /<([\w:]+)/, rnoInnerhtml = /<(?:script|style|link)/i, wrapMap = {};
    jQuery.fn.extend({
        text: function () {
        },
        wrapAll: function () {
        },
        wrapInner: function () {
        },
        wrap: function () {
        },
        unwrap: function () {
        },
        append: function () {
        },
        prepend: function () {
        },
        before: function () {
        },
        html: function (value) {
            return jQuery.access(this, function (value) {
                if (!rnoInnerhtml.test() && !rnoshimcache.test() && !rleadingWhitespace.test() && wrapMap[(rtagName.exec() || [
                        '',
                        ''
                    ])[1].toLowerCase()]) {
                }
            }, null, value);
        },
        replaceWith: function () {
        },
        detach: function () {
        }
    });
    jQuery.each(('blur focus focusin focusout load resize scroll unload click dblclick ' + 'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave ' + 'change select submit keydown keypress keyup error contextmenu').split(' '), function (i, name) {
        jQuery.fn[name] = function () {
            return this.on(name);
        };
    });
    var rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/, rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/, transports = {}, allTypes = '*/'.concat();
    try {
        ajaxLocation = location.href;
    } catch (e) {
    }
    ajaxLocParts = rurl.exec(ajaxLocation.toLowerCase()) || [];
    function addToPrefiltersOrTransports() {
        return function (dataTypeExpression) {
        };
    }
    jQuery.extend({
        active: 0,
        lastModified: {},
        etag: {},
        ajaxSettings: {
            isLocal: rlocalProtocol.test(ajaxLocParts[1]),
            converters: {
                '* text': window.String,
                'text html': true,
                'text json': jQuery.parseJSON
            }
        },
        ajaxSetup: function (settings) {
        },
        ajaxPrefilter: addToPrefiltersOrTransports(),
        ajaxTransport: addToPrefiltersOrTransports(transports),
        ajax: function (options) {
        },
        getScript: function (url, callback) {
            return;
        },
        getJSON: function (url, data, callback) {
        }
    });
    window.jQuery = window.$ = jQuery;
}());
function go() {
    $().html().click();
}
go();