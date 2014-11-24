/*
 * Copyright (c) 2012, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the 
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

/* game object, includes everything */
function MakeAMonster() {
    "use strict";

    var self = this;
    this.sounds = {};
    this.page = document.getElementById("main_page");
    this.title = document.getElementById("titleblurb");
    this.topbutton = document.getElementById("topbutton");
    this.bottombutton = document.getElementById("bottombutton");
    this.monsterbox = document.getElementById("monsterbox");
    this.mainbuttons = document.getElementById("mainbuttons");
    this.platform = document.getElementById("platform");
    this.randomeffect = document.getElementById("randomeffect");
    this.selected = false;
    this.partbox = {};
    this.partbox["head"] = {};
    this.partbox["body"] = {};
    this.partbox["legs"] = {};
    this.partbox["head"].elem = document.getElementById("monster_headbox");
    this.partbox["body"].elem = document.getElementById("monster_bodybox");
    this.partbox["legs"].elem = document.getElementById("monster_legsbox");
    this.gallery = new MonsterGallery(this);
    this.state = "startmode";

    function init() {
        webappCommon.useMouseEvents();
        license_init("license", "main_page");
        self.sounds.bubbles = webappCommon.createSound("audio.bubbles", 0);
        self.sounds.jacobsladder = webappCommon.createSound("audio.jacobsladder", 0);
        self.sounds.elevator = webappCommon.createSound("audio/elevator.ogg", 1);
        self.sounds.organ = webappCommon.createSound("audio.organ", 1);
        self.sounds.newmonster = webappCommon.createSound("audio/roar.ogg", 1);
        self.sounds.delmonster = webappCommon.createSound("audio/yahh.ogg", 1);
        self.sounds.random = webappCommon.createSound("audio/random.ogg", 1);
        self.sounds.thunder = webappCommon.createSound("audio/thunder.ogg", 1);
        self.sounds.button = webappCommon.createSound("audio/button.ogg", 1);
        self.partbox["head"].sound = webappCommon.createSound("audio/whip03.ogg", 1);
        self.partbox["body"].sound = webappCommon.createSound("audio/whip01.ogg", 1);
        self.partbox["legs"].sound = webappCommon.createSound("audio/whip02.ogg", 1);

        document.getElementById("leftbutton1").addEventListener('click', function () {
            self.changePart("head", "left");
        });
        document.getElementById("rightbutton1").addEventListener('click', function () {
            self.changePart("head", "right");
        });
        document.getElementById("leftbutton2").addEventListener('click', function () {
            self.changePart("body", "left");
        });
        document.getElementById("rightbutton2").addEventListener('click', function () {
            self.changePart("body", "right");
        });
        document.getElementById("leftbutton3").addEventListener('click', function () {
            self.changePart("legs", "left");
        });
        document.getElementById("rightbutton3").addEventListener('click', function () {
            self.changePart("legs", "right");
        });

        topbutton.addEventListener('click', function () {
            self.sounds.button.play();
            if (self.state === "startmode") {
                self.menuButtonPlay();
            }
            else if (self.state === "playmode") {
                self.menuButtonRandom();
            }
        });
        bottombutton.addEventListener('click', function () {
            self.sounds.button.play();
            if (self.state === "startmode") {
                self.menuButtonGallery();
            }
            else if (self.state === "playmode") {
                self.menuButtonSave();
            }
        });
        monsterbox.addEventListener('click', function () {
            if (self.gallery.isOpen()) {
                if (self.selected) {
                    self.menuButtonPlay();
                }
                else {
                    self.menuButtonGallery();
                }
            }
        });
        document.getElementById("littleshare").addEventListener('click', function () {
            self.sounds.button.play();
            self.menuButtonGallery();
        });
        document.getElementById("volume").addEventListener('click', function (e) {
            if (e.target.className === "on") {
                webappCommon.setVolume(0);
                e.target.className = "off";
            }
            else if (e.target.className === "off") {
                webappCommon.setVolume(1);
                e.target.className = "on";
            }
        });

        self.sounds.organ.play();
        self.sounds.bubbles.play();
        self.sounds.jacobsladder.play();
    }

    init();
};

MakeAMonster.prototype.changePart = function (part, dir) {
    this.partbox[part].sound.play();
    var box = this.partbox[part].elem;
    var val = parseInt(box.className.slice(4));
    if (dir === "left") {
        val = ((val + 12) % 7) + 1;
    }
    else {
        val = (val % 7) + 1;
    }
    box.className = "part" + val;
}

MakeAMonster.prototype.randomMonster = function () {
    var self = this;
    self.menuDisable();
    var rndhead = Math.floor(Math.random() * 7) + 1;
    var rndbody = Math.floor(Math.random() * 7) + 1;
    var rndlegs = Math.floor(Math.random() * 7) + 1;

    self.monsterbox.className = "";
    self.mainbuttons.className = "";
    self.partbox["head"].elem.className = "part" + (((rndhead) % 7) + 1);
    self.partbox["body"].elem.className = "part" + (((rndbody + 5) % 7) + 1);
    self.partbox["legs"].elem.className = "part" + (((rndlegs) % 7) + 1);

    var callback = function () {
        if (self.randomeffect.className === "start") {
            self.randomeffect.className = "finish";
            self.monsterbox.className = "fadein"
            self.partbox["head"].elem.className = "part" + rndhead;
            self.partbox["body"].elem.className = "part" + rndbody;
            self.partbox["legs"].elem.className = "part" + rndlegs;
            self.sounds.thunder.play();
        }
        else {
            self.randomeffect.removeEventListener('webkitTransitionEnd', callback, false);
            self.mainbuttons.className = "enable";
            self.randomeffect.className = "";
            self.sounds.newmonster.play();
            self.menuEnable();
        }
    }

    self.randomeffect.addEventListener('webkitTransitionEnd', callback);
    self.randomeffect.className = "start";
    self.sounds.random.play();
}

MakeAMonster.prototype.menuEnable = function () {
    this.topbutton.style.pointerEvents = "auto";
    this.bottombutton.style.pointerEvents = "auto";
}

MakeAMonster.prototype.menuDisable = function () {
    this.topbutton.style.pointerEvents = "none";
    this.bottombutton.style.pointerEvents = "none";
}

MakeAMonster.prototype.loadMonster = function (h, b, l) {
    var self = this;

    var head = "part" + h;
    var body = "part" + b;
    var legs = "part" + l;

    self.selected = true;
    self.monsterbox.className = "instant";
    self.partbox["head"].elem.className = head;
    self.partbox["body"].elem.className = body;
    self.partbox["legs"].elem.className = legs;
}

MakeAMonster.prototype.clearMonster = function () {
    var self = this;

    self.selected = false;
    self.monsterbox.className = "";
    self.sounds.newmonster.stop();
    self.sounds.delmonster.play();
}

MakeAMonster.prototype.menuButtonPlay = function () {
    var self = this;
    self.menuDisable();

    if (!self.gallery.isOpen()) {
        var callback = function () {
            self.platform.removeEventListener('webkitAnimationEnd', callback, false);
            self.platform.className = "";
            self.monsterbox.style.display = "block";
            self.randomMonster();
            self.page.className = "playmode";
            self.state = "playmode";
        }
        self.platform.addEventListener('webkitAnimationEnd', callback);
        self.title.className = "hideslow";
        self.platform.className = "start";
        self.sounds.elevator.play();
    }
    else {
        self.gallery.close();
        self.mainbuttons.className = "";
        self.monsterbox.style.display = "block";
        if (!self.selected) {
            self.randomMonster();
        }
        else {
            self.monsterbox.className = "fadein";
            self.mainbuttons.className = "enable";
            self.menuEnable();
        }
        self.page.className = "playmode";
        self.state = "playmode";
    }
}

MakeAMonster.prototype.menuButtonRandom = function () {
    var self = this;
    self.sounds.newmonster.stop();
    self.sounds.delmonster.play();
    self.gallery.close();
    self.randomMonster();
}

MakeAMonster.prototype.menuButtonGallery = function () {
    var self = this;

    if (self.gallery.isOpen()) {
        self.gallery.close();
        if (self.state === "startmode") {
            /* bring the title screen back up */
            self.title.className = "";
            self.monsterbox.style.display = "none";
            self.monsterbox.className = "";
            self.mainbuttons.className = "";
        }
        else {
            self.mainbuttons.className = "enable";
            self.monsterbox.style.display = "block";
            self.monsterbox.className = "fadein";
        }
    }
    else {
        self.gallery.open();
        self.mainbuttons.className = "hide";

        if (self.state === "startmode") {
            self.title.className = "hidefast";
            self.monsterbox.style.display = "block";
        }
    }
}

MakeAMonster.prototype.menuButtonSave = function () {
    var self = this;

    /* pull the current moster data from the DOM */
    var head = parseInt(self.partbox["head"].elem.className.substr(4));
    var body = parseInt(self.partbox["body"].elem.className.substr(4));
    var legs = parseInt(self.partbox["legs"].elem.className.substr(4));

    self.selected = true;
    if (self.gallery.save(head, body, legs)) {
        self.sounds.newmonster.play();
    }

    if (!self.gallery.isOpen()) {
        self.menuButtonGallery();
    }
}

window.addEventListener('load', function () {
    "use strict";
    var main = new MakeAMonster();

    scaleBody(document.getElementsByTagName("body")[0], 720);
});
