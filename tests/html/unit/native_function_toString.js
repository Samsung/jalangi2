(function() {
    (function() {
        var preferredDoc = window.document, rnative = /^[^{]+\{\s*\[native \w/;
        function isNative(fn) {
            return rnative.test(fn);
        }
        function assert() {}
        setDocument = function() {
            var doc = preferredDoc;
            docElem = doc.documentElement;
            if (isNative(doc.querySelectorAll)) assert();
            if (isNative(docElem.webkitMatchesSelector)) {}
        };
        setDocument();
    })();
})();
