if (typeof window === "undefined") {
    require('../../src/js/InputManager');
    require(process.cwd()+'/inputs');
}

function isValidQuery(str)
{
    var lastSlash = str.lastIndexOf('/');
    if (lastSlash < 0){
        return false;
    }
    var t = str.substring(0,lastSlash);
    if (t !== "google.com" && t !== "live.com"){
        console.log("False 4");
        return false;
    }
    return true;
}




var str = J$.readInput(""); // this input
console.log("Input: "+str.toString());

if (isValidQuery(str)) {
    console.log("Valid input");
} else {
    console.log("Invalid input");
}
