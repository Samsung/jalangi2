
var fs = require('fs');
var content = fs.readFileSync("src/js/frame.html", "utf8");
fs.writeFileSync("src/js/mid.html", "<script type=\"text/javascript\">\n J$.frameHtml = "+JSON.stringify(content).replace(/</g,"\x5Cx3c")+";\n</script>\n");
