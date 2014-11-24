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

// this file tests record and replay of asynchronous events

var events = require('events');

var Foo = function(initial_no) { this.count = initial_no; this.x = 1; this.y = 2; };

Foo.prototype = new events.EventEmitter;

Foo.prototype.increment = function() {
    console.log("calling increment")
    var self = this;
    var id = setInterval(function() {
        console.log("calling event handler")
        if (self.count<10) {
            if(self.count % 2 === 0) self.emit('even');
            self.count++;
            self.x += 5;
        } else {
            clearInterval(id);
        }
    }, 30);
};

var lol = new Foo(1);

lol.on('even', function() {
    console.log('Number is even! :: ' + this.count + " this.x "+this.x);
}).increment();
