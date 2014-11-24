/*
 * Copyright (c) 2012, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

function Animation(id, startclass, ontime, property) {
    var self = this;
    self.id = id;
    self.elem = document.getElementById(id);
    self.offclass = self.elem.className;
    self.onclass = self.offclass+" "+startclass;
    self.ontime = ontime;
    self.phase = "off";
    if(property != undefined)
    {
        self.prop = property;
        self.elem.addEventListener('webkitTransitionEnd', function(e) {
            if(e.propertyName === self.prop)
            {
                if(self.phase === "starting")
                {
                    self.phase = "on";
                    self.timer = setTimeout(function() {
                        self.phase = "ending";
                        self.elem.className = self.offclass;
                    }, self.ontime);
                }
                else if(self.phase === "ending")
                {
                    self.phase = "off";
                    if(self.next&&self.next.begin)
                        self.next.begin();
                }
            }
        }, false);
    }
}

Animation.prototype.begin = function() {
    var self = this;
    self.phase = "starting";
    setTimeout(function(){self.elem.className = self.onclass;}, 0);
};

Animation.prototype.clear = function() {
    var self = this;
    if(self.timer)
        clearTimeout(self.timer);
    self.phase = "off";
    self.elem.className = self.offclass;
    if(self.next&&self.next.clear)
        self.next.clear();
};


