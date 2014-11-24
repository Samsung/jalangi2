function nextIndices(indices, maxIndices) {
    var len = indices.length, i;
    indices[len-1] = indices[len-1]+1;
    for(i=len-1; i>=0; --i) {
        if (indices[i]===maxIndices[i]) {
            if (i===0) {
                return false;
            } else {
                indices[i] = 0;
                indices[i-1] = indices[i-1] + 1;
            }
        } else {
            break;
        }
    }
    return true;
}


var I = [0, 0, 0, 0];
var M = [3, 1, 2, 5];

do {
    console.log(I.join(' '));
} while (nextIndices(I, M));

I = [0];
M = [1];
do {
    console.log(I.join(' '));
} while (nextIndices(I, M));
