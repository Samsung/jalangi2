var obj1 = {"0": 1, "1": 2};
var arr1 = new Array(1, 2);
var arr2 = new Array(1, "str");
var arr3 = new Array();
var arr4 = new Array(1, 2);
var arr5 = new Array(1, 2);
var arr6 = new Array(1, 2);

arr1[0] = 3;
arr3[0] = 4;
arr3[1] = "str";

arr4[1] = "str";
arr5[7] = 4;
arr6.x = 4;

//{"arrayTotal":6,"arrayNonUniform":3,"arrayWrite":6,"arrayOutOfBoundNumberIndexWrite":3,"arrayNonNumberIndexWrite":1}