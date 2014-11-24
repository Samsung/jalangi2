if (typeof window === "undefined") {
    require('../../src/js/InputManager');
    require(process.cwd()+'/inputs');
}

function isEasyChairQuery()
{
    var str = J$.readInput("");
    console.log("Input: "+str.toString());

// (1) check that str contains "/" followed by anything not
// containing "/" and containing "EasyChair"
    var lastSlash = str.lastIndexOf('/');
    if (lastSlash < 0){
        return false;
    }
    var rest = str.substring(lastSlash + 1);

    if (rest.indexOf("EasyChair")<0){
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


// s survived all checks
    return true;
}


if (isEasyChairQuery()) {
    console.log("Valid input");
} else {
    console.log("Invalid input");
}
