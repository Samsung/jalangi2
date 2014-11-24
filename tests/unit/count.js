var count = 0;

var i1, i2, i3, i4, i5;
for (i1 = 0; i1 <=3; i1++) {
    for (i2 = 1; i2 <4; i2++) {
        for (i3 = 15; i3 <= 23; i3++) {
            for (i4 = 0; i4 <= 23; i4++) {
                for (i5 = 0; i5 <= 23; i5++) {
                    if (i1 + i2 + i3 + i4+ i5 === 23) {
                        count++;
                    }
                }
            }
        }
    }
}

console.log(count);
