var N = 4, i;
var array = [];

//function dosort()
//{
for(i=0; i<N; i++) {
    array[i] = i;
    array[i] = J$.readInput(array[i]);
}

i = J$.readInput(0);
function hist() {
    var sum = 0;
    for (var j = 0 ; j<i && j < N; j++) {
        sum += array[j]*array[j];
    }
    return sum;
}

console.log(hist());
