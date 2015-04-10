

function doTheThing() {
  return new Function('x', 'y', 'return x+y');
}

(function() {

  var originalFunction = Function;
  Function = function() { throw new Error("Eval not allowed."); };

  var exceptionThrown = false;
  try {
    doTheThing();
  } catch (e) {
    exceptionThrown = true;
  }
  console.log(exceptionThrown);

  Function = originalFunction;

})();


