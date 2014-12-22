/*
 * Copyright (c) 2014 Samsung Electronics Co., Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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

