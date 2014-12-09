var proxy = require("rewriting-proxy");

function rewriteInlineScript(src, metadata) {
    return src;
}

var origCode = '<html><head></head><body>Hello</body></html>'

instCode = proxy.rewriteHTML(origCode, "http://foo.com", rewriteInlineScript, '<meta http-equiv="Content-Type" content="text/html; charset=utf-8”><script type="text/javascript"> var x="hello";</script>');
console.log(instCode);
