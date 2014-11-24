var count = 0;
function displayTime() {
    if (count < 5) {
        var elt = document.getElementById("clock");
        var now = Date();
        var str = now.toString();
        console.log(str);
        elt.innerHTML = str;
        setTimeout(displayTime,1000);
        count++;
    }
}

var i = 0;
var myFunction = function () {
    i++;
    console.log(arguments.length);
    console.log(i+" Click(s)");
    alert(i+" Click(s)");
}

window.onload = displayTime;
