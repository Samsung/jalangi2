

// The functions expects that str will contain substrings of the form [_[ function (){ ... } ]_]
// Any such substring will be replaced with the string returned by the invocation of the function.
// The replacement process will continue until there are no such substrings in str.
function expand(str) {
    var BEGIN_MARKER="[_[";
    var END_MARKER="]_]";
    var MARKER_LEN = BEGIN_MARKER.length;

    var sidx, eidx;
    while(sidx=str.indexOf(BEGIN_MARKER)>=0) {
        eidx = str.indexOf(END_MARKER);
        if (eidx < 0) {
            throw new Error("End marker not found in "+str);
        }
        var code = str.substring(sidx+MARKER_LEN,eidx);
        var geval = eval;
        var newCode = geval(code)();
        str = str.slice(0,sidx)+newCode + str.slice(eidx+MARKER_LEN);
    }
    return str;
}

module.exports = expand;