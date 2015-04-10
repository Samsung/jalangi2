

function doTheThing(x, y) {
  return eval('x+y');
}

(function() {

  var originalJSONParse = JSON.parse;
  var originalJSONStringify = JSON.stringify;
  JSON.parse = function() { throw new Error("Should not call JSON.parse"); };
  JSON.stringify = function() { throw new Error("Should not call JSON.stringify"); };

  doTheThing();

  JSON.parse = originalJSONParse;
  JSON.stringify = originalJSONStringify;

})();


