

// The functions expects that str will contain substrings of the form [_[ function(){ ... } ]_]
// Any such substring will be replaced with the string returned by the invocation of the function.
// The replacement process will continue until there are no such substrings in str.
currentPath = process.cwd();

function expand(str) {
    var BEGIN_MARKER="//[_[";
    var END_MARKER="//]_]";
    var MARKER_LEN = BEGIN_MARKER.length;

    var sidx, eidx;
    while((sidx=str.indexOf(BEGIN_MARKER))>=0) {
        eidx = str.indexOf(END_MARKER);
        if (eidx < 0) {
            throw new Error("End marker not found in "+str);
        }
        console.log("str = "+str);
        console.log("sidx = "+sidx);
        console.log("eidx = "+eidx);
        var code = str.substring(sidx+MARKER_LEN,eidx);
        console.log("code = "+code);
        var geval = eval;
        var newCode = geval("("+code+")")();
        str = str.slice(0,sidx) + newCode + str.slice(eidx+MARKER_LEN);
    }
    return str;
}

fileExpand = function(file) {
    var fs = require('fs');
    var path = require('path');

    var fullFilePath = path.resolve(currentPath, file);
    var oldCurrentPath = currentPath;
    currentPath = path.dirname(fullFilePath);
    var content = fs.readFileSync(fullFilePath, "utf8");
    var newStr =  expand(content);
    currentPath = oldCurrentPath;
    return newStr;
};

if (require.main === module) {
    var fs = require('fs');
    var content = fileExpand(process.argv[2]);
    fs.writeFileSync(process.argv[3], content);
} else {
    module.exports = fileExpand;
}
