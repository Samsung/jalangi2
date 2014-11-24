/*
 * Copyright 2013 Samsung Information Systems America, Inc.
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

// Author: Koushik Sen
 

var url = require("url");
var http = require("http");
var httpProxy = require("http-proxy");
var bodyParser = require("connect").bodyParser;
var restreamer = require("connect-restreamer");


function proxyServer (request, response, proxy) {
    var parsedRequest = url.parse(request.url);

    console.log(request.url);
    console.log(parsedRequest);
        proxy.proxyRequest(request, response, {
            host: parsedRequest.host,
            port: parsedRequest.port || 80
        });
//    }
}

httpProxy.createServer(
    bodyParser(),
    restreamer(),
    proxyServer
).listen(9000);
