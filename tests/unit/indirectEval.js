var x = 1;

var e = eval;

eval("x = 3;");

e("x = 2;");


console.log(x);
// node src/js/commands/jalangi.js --inlineIID --inlineSource --analysis src/js/runtime/SMemory.js --analysis src/js/sample_analyses/scratch/SmemTest.js tests/unit/indirectEval.js
