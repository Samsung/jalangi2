if (typeof window === "undefined") {
    require('../../src/js/InputManager');
    require(process.cwd()+'/inputs');
}

function isValidQuery(str)
{

// (1) check that str contains "/" followed by anything not
// containing "/" and containing "?q=..."
    var lastSlash = str.lastIndexOf('/');
    if (lastSlash < 0){
        return false;
    }
    var rest = str.substring(lastSlash + 1);

    if (!(RegExp('\\\?q=[a-zA-Z]+')).test(rest)){
        return false;
    }


// (2) Check that str starts with "http://"
    if (str.indexOf("http://") !== 0){
        return false;
    }


// (3) Take the string between "http://" and the last "/".
// if it starts with "www." strip the "www." off
    var t = str.substring("http://".length,lastSlash);
    if (t.indexOf("www.")===0){
        t = t.substring("www.".length);
    }


// (4) Check that after stripping we have either "live.com"
// or "google.com"
    if (t !== "google.com" && t !== "live.com"){
        console.log("False 4");
        return false;
    }

//    if (false) {
//        console.log("Unreachable");
//    }


// s survived all checks
    return true;
}




var str = J$.readInput(""); // this input
console.log("Input: "+str.toString());

if (isValidQuery(str)) {
    console.log("Valid input");
} else {
    console.log("Invalid input");
}
