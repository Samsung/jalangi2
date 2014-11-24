if (typeof window === "undefined") {
    require('../../src/js/InputManager');
    require(process.cwd()+'/inputs');
}



var Triangle = {EQUILATERAL:"EQUILATERAL", ISOSCELES:"ISOSCELES", SCALENE: "SCALENE", ERROR: "ERROR"};



function getType(a, b, c)
{
    if(a<=0||b<=0||c<=0)
        throw new Error("Length of sides cannot be equal to or less than zero");

    if(a==b && b== c&& c==a)
        return Triangle.EQUILATERAL;
    else if((a==b)||(b==c)||(c==a))
        return Triangle.ISOSCELES;
    else if(a!=b && b!=c && c!=a)
        return Triangle.SCALENE;
    else
        return Triangle.ERROR;
}

var a = J$.readInput(1), b = J$.readInput(1), c= J$.readInput(1);
var ret = getType(a, b, c);

console.log("a = "+a+", b = "+b+", c = "+c);
console.log(ret);
