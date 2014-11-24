var obj1 = {"0": 1, "1": 2};
var arr1 = [1, 2];
var arr2 = [1, "str"];
var arr3 = [];
var arr4 = [1, 2];
var arr5 = [1, 2];
var arr6 = [1, 2];

arr1[0] = 3;
arr3[0] = 4;
arr3[1] = "str";

arr4[1] = "str";
arr5[7] = 4;
arr6.x = 4;

//{"arrayTotal":6,"arrayNonUniform":3,"arrayWrite":6,"arrayOutOfBoundNumberIndexWrite":3,"arrayNonNumberIndexWrite":1}