var jsdom = require("jsdom");
var fs = require("fs");
var jalangi = !!process.argv[2];

var scripts = jalangi ?   ['../../../src/js/analysis.js', '../../../src/js/InputManager.js', '../../../node_modules/escodegen/escodegen.browser.js', '../../../node_modules/esprima/esprima.js', '../../../src/js/utils/astUtil.js', '../../../src/js/instrument/esnstrument.js', '../jquery-2.0.2_jalangi_.js'] : ['../jquery-2.0.2.js'];

jsdom.env(
  '<html><head></head><body></body></html>',
  scripts,
  function (errors, window) {
        function ok(val, msg) {
          if (!val) {
            console.log("oops");
            console.log(msg);
          }
        }
    
	window.jQuery["_check9521"] = function(x){
		ok( x, "script called from #id-like selector with inline handler" );
		window.jQuery("#check9521").remove();
		delete window.jQuery["_check9521"];
	};
	try {
		// This throws an error because it's processed like an id
		window.jQuery( "#<img id='check9521' src='no-such-.gif' onerror='window.jQuery._check9521(false)'>" ).appendTo("#qunit-fixture");
	} catch (err) {
          console.log("caught exception");
		window.jQuery["_check9521"](true);
	}
    
  }
);
