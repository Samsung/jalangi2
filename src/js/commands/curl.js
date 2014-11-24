var http = require('http');
var fs = require('fs');

var file = fs.createWriteStream(process.argv[2]);
var request = http.get(process.argv[3], function(response) {
    if (response.statusCode >= 300) {
        console.log("Got error while downloading " + process.argv[3]);
        process.exit(1);
    } else {
        response.pipe(file);
    }
}).on('error', function(e) {
        console.log("Got error while downloading " + process.argv[3] + ":"+ e.message);
        process.exit(1);
    });

