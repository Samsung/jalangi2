
x = 10;
function makeFCons() {
  var x = 20;
  return new Function('return x+30');
}
function makeF() {
  var x = 20;
  return Function('return x+30');
}

var f = makeFCons();
console.log(f());

var f = makeF();
console.log(f());

var exceptionCaught = false;
try {
  Function('},{');
} catch (e) {
  exceptionCaught = true;
}
if (!exceptionCaught) {
  throw new Error("Should have thrown an exception");
}

