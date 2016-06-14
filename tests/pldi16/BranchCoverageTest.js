
for(var i=0; i<10; i++) {
    console.log("For loop iteration #"+i);
    if (i % 3 === 0) {
        console.log("i % 3 === 0");
    }

    switch(i) {
        case 2:
        case 3:
            console.log("case 2 and 3");
            break;
        case 9:
        case 11:
            console.log("case 9 or 11");
            break;
        default:
            console.log("default");
            break;

    }

    if (i <= -1) {
        console.log("i is negative");
    }
}


console.log("**************************** end of execution *****************************");
console.log("");
